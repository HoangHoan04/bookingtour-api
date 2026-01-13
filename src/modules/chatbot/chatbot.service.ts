import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ChatHistoryRepository } from 'src/repositories';
import { DynamicQueryService } from './services/dynamic-query.service';
import { SchemaDiscoveryService } from './services/schema-discovery.service';

interface ChatSession {
  history: any[];
  lastActive: Date;
}

@Injectable()
export class ChatbotService implements OnModuleInit {
  private readonly logger = new Logger(ChatbotService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;
  private sessions = new Map<string, ChatSession>();
  private systemContext: string = '';
  private tools: any[] = [];
  constructor(
    private readonly schemaService: SchemaDiscoveryService,
    private readonly queryService: DynamicQueryService,
    private readonly chatHistoryRepo: ChatHistoryRepository,
  ) {}

  async onModuleInit() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      this.logger.error('GOOGLE_API_KEY không tồn tại');
      return;
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.systemContext = this.schemaService.generateCompactSchemaContext();
    this.tools = this.generateDynamicTools();
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      tools: this.tools as any,
    });
    this.logger.log(
      'Chatbot Service initialized (Lazy mode). API sẽ chỉ được gọi khi có user chat.',
    );
  }

  private generateDynamicTools() {
    const entities = this.schemaService.getAllEntities();
    const functionDeclarations: any[] = [
      {
        name: 'get_system_overview',
        description:
          'Lấy báo cáo tổng quan về toàn bộ hệ thống: số lượng records trong tất cả các entities',
      },
      {
        name: 'count_records',
        description:
          'Đếm số lượng records trong một entity/table cụ thể. Có thể áp dụng filters.',
        parameters: {
          type: 'object',
          properties: {
            tableName: {
              type: 'string',
              description: `Tên table cần đếm. Available tables: ${entities.map((e) => e.tableName).join(', ')}`,
            },
            filters: {
              type: 'array',
              description:
                'Điều kiện lọc (optional). VD: [{"field": "status", "operator": "eq", "value": "active"}]',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  operator: {
                    type: 'string',
                    enum: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like'],
                  },
                  value: { type: 'string' },
                },
              },
            },
          },
          required: ['tableName'],
        },
      },
      {
        name: 'search_records',
        description:
          'Tìm kiếm và lấy danh sách records từ một entity. Hỗ trợ filters, search text, relations, pagination.',
        parameters: {
          type: 'object',
          properties: {
            tableName: {
              type: 'string',
              description: `Tên table. Available: ${entities.map((e) => e.tableName).join(', ')}`,
            },
            searchTerm: {
              type: 'string',
              description: 'Từ khóa tìm kiếm (tìm trong tất cả text columns)',
            },
            filters: {
              type: 'array',
              description: 'Điều kiện lọc',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  operator: {
                    type: 'string',
                    enum: ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'in'],
                  },
                  value: {},
                },
              },
            },
            includeRelations: {
              type: 'array',
              description:
                'Danh sách relations cần join (VD: ["department", "position"])',
              items: { type: 'string' },
            },
            limit: {
              type: 'number',
              description: 'Số lượng records tối đa (default: 50)',
            },
          },
          required: ['tableName'],
        },
      },
      {
        name: 'get_record_detail',
        description:
          'Lấy thông tin chi tiết của một record cụ thể dựa trên điều kiện.',
        parameters: {
          type: 'object',
          properties: {
            tableName: {
              type: 'string',
              description: 'Tên table',
            },
            filters: {
              type: 'array',
              description:
                'Điều kiện tìm kiếm (VD: [{"field": "id", "operator": "eq", "value": "123"}])',
              items: {
                type: 'object',
              },
            },
            includeRelations: {
              type: 'array',
              description: 'Relations cần load',
              items: { type: 'string' },
            },
          },
          required: ['tableName', 'filters'],
        },
      },
      {
        name: 'aggregate_data',
        description:
          'Thống kê, phân tích dữ liệu với group by và aggregate functions (count, sum, avg, min, max).',
        parameters: {
          type: 'object',
          properties: {
            tableName: {
              type: 'string',
              description: 'Tên table',
            },
            groupBy: {
              type: 'array',
              description: 'Các columns để group by',
              items: { type: 'string' },
            },
            aggregations: {
              type: 'array',
              description:
                'Các hàm aggregate. VD: [{"function": "count", "column": "id", "alias": "total"}]',
              items: {
                type: 'object',
                properties: {
                  function: {
                    type: 'string',
                    enum: ['count', 'sum', 'avg', 'min', 'max'],
                  },
                  column: { type: 'string' },
                  alias: { type: 'string' },
                },
              },
            },
            filters: {
              type: 'array',
              description: 'Điều kiện lọc',
              items: { type: 'object' },
            },
          },
          required: ['tableName'],
        },
      },
      {
        name: 'find_related_data',
        description:
          'Tìm dữ liệu liên quan giữa nhiều entities (auto-join thông minh).',
        parameters: {
          type: 'object',
          properties: {
            sourceTable: {
              type: 'string',
              description: 'Entity nguồn',
            },
            targetTable: {
              type: 'string',
              description: 'Entity đích cần lấy dữ liệu',
            },
            filters: {
              type: 'array',
              description: 'Điều kiện lọc trên entity nguồn',
              items: { type: 'object' },
            },
            limit: {
              type: 'number',
              description: 'Số lượng records',
            },
          },
          required: ['sourceTable', 'targetTable'],
        },
      },
      {
        name: 'list_available_entities',
        description:
          'Liệt kê tất cả các entities/tables có sẵn trong hệ thống với thông tin columns và relations.',
      },
      {
        name: 'find_entity_by_name',
        description:
          'Tìm kiếm entities dựa trên tên (fuzzy search). Useful khi user không nhớ chính xác tên table.',
        parameters: {
          type: 'object',
          properties: {
            searchTerm: {
              type: 'string',
              description:
                'Từ khóa tìm kiếm (VD: "employee", "dept", "branch")',
            },
          },
          required: ['searchTerm'],
        },
      },
    ];

    return [{ functionDeclarations }];
  }

  private async executeFunction(name: string, args: any) {
    this.logger.log(
      `AI gọi: ${name}(${JSON.stringify(args).slice(0, 100)}...)`,
    );

    try {
      switch (name) {
        case 'get_system_overview':
          return await this.getSystemOverview();

        case 'count_records':
          return await this.countRecords(args);

        case 'search_records':
          return await this.searchRecords(args);

        case 'get_record_detail':
          return await this.getRecordDetail(args);

        case 'aggregate_data':
          return await this.aggregateData(args);

        case 'find_related_data':
          return await this.findRelatedData(args);

        case 'list_available_entities':
          return this.listAvailableEntities();

        case 'find_entity_by_name':
          return this.findEntityByName(args);

        default:
          return { error: 'Function không tồn tại' };
      }
    } catch (error) {
      this.logger.error(`Lỗi thực thi ${name}: ${error.message}`);
      return { error: error.message, suggestion: 'Thử lại với tham số khác' };
    }
  }

  private async getSystemOverview() {
    const entities = this.schemaService.getAllEntities();
    const counts: any = {};
    await Promise.all(
      entities.map(async (entity) => {
        try {
          const count = await this.queryService.count({
            tableName: entity.tableName,
          });
          counts[entity.tableName] = count;
        } catch (error) {
          counts[entity.tableName] = 'N/A';
        }
      }),
    );

    return {
      totalEntities: entities.length,
      entities: counts,
      summary: `Hệ thống có ${entities.length} entities với tổng cộng ${Object.values(counts).reduce((a: any, b: any) => (typeof b === 'number' ? a + b : a), 0)} records`,
    };
  }

  private async countRecords(args: any) {
    const count = await this.queryService.count({
      tableName: args.tableName,
      filters: args.filters || [],
    });

    return {
      tableName: args.tableName,
      count,
      hasFilters: (args.filters || []).length > 0,
    };
  }

  private async searchRecords(args: any) {
    const results = await this.queryService.find({
      tableName: args.tableName,
      searchTerm: args.searchTerm,
      filters: args.filters || [],
      includeRelations: args.includeRelations || [],
      limit: args.limit || 50,
    });

    return {
      tableName: args.tableName,
      count: results.length,
      data: results,
    };
  }

  private async getRecordDetail(args: any) {
    const result = await this.queryService.findOne({
      tableName: args.tableName,
      filters: args.filters,
      includeRelations: args.includeRelations || true,
    });

    if (!result) {
      return { message: 'Không tìm thấy record phù hợp' };
    }

    return {
      tableName: args.tableName,
      data: result,
    };
  }

  private async aggregateData(args: any) {
    const results = await this.queryService.aggregate({
      tableName: args.tableName,
      groupBy: args.groupBy,
      aggregations: args.aggregations,
      filters: args.filters,
    });

    return {
      tableName: args.tableName,
      aggregations: args.aggregations,
      count: results.length,
      data: results,
    };
  }

  private async findRelatedData(args: any) {
    const results = await this.queryService.findWithAutoJoin({
      sourceTable: args.sourceTable,
      targetTable: args.targetTable,
      filters: args.filters,
      limit: args.limit || 20,
    });

    return {
      sourceTable: args.sourceTable,
      targetTable: args.targetTable,
      count: results.length,
      data: results,
    };
  }

  private listAvailableEntities() {
    const entities = this.schemaService.getAllEntities();
    return {
      totalEntities: entities.length,
      entities: entities.map((e) => ({
        tableName: e.tableName,
        entityName: e.entityName,
        columns: e.displayColumns,
        relations: e.relations.map((r) => ({
          name: r.name,
          target: r.targetEntity,
        })),
        searchableFields: e.searchableColumns,
      })),
    };
  }

  private findEntityByName(args: any) {
    const entities = this.schemaService.findEntitiesByName(args.searchTerm);
    return {
      searchTerm: args.searchTerm,
      found: entities.length,
      entities: entities.map((e) => ({
        tableName: e.tableName,
        columns: e.displayColumns,
      })),
    };
  }

  private getSystemPrompt(): string {
    return ` Bạn là AI Assistant thông minh cho hệ thống HRM (Human Resource Management).
            NHIỆM VỤ:
            - Giải đáp mọi thắc mắc về dữ liệu nhân sự, tổ chức, phòng ban, v.v.
            - Sử dụng TOOLS để truy vấn database thực tế, KHÔNG TỰ BỊA SỐ LIỆU
            - Phân tích và tổng hợp dữ liệu một cách thông minh

            DATABASE SCHEMA:
            ${this.systemContext}

            QUY TẮC:
            1. Khi user hỏi về số lượng, danh sách, thống kê → GỌI TOOLS
            2. Nếu không chắc entity nào → dùng "find_entity_by_name" hoặc "list_available_entities"
            3. Muốn lấy dữ liệu liên quan giữa nhiều bảng → dùng "find_related_data" (auto-join thông minh)
            4. Muốn thống kê, phân tích → dùng "aggregate_data"
            5. Trả lời ngắn gọn, súc tích, chuyên nghiệp
            6. Nếu tool trả về lỗi, giải thích và đề xuất cách khác

            THÔNG MINH:
            - Hiểu ngữ cảnh tiếng Việt tự nhiên
            - Tự động chọn tools phù hợp
            - Kết hợp nhiều tools nếu cần thiết
            - Format dữ liệu dễ đọc cho user`;
  }

  async chat(user: any, query: string) {
    if (!this.model) {
      return this.fallbackResponse(query);
    }

    const userId = user?.id || 'guest';
    const session = this.getOrCreateSession(userId);

    const chat = this.model.startChat({
      history: session.history,
      systemInstruction: {
        role: 'system',
        parts: [{ text: this.getSystemPrompt() }],
      },
    });

    try {
      let result = await chat.sendMessage(query);
      let response = result.response;
      let maxIterations = 10;
      let iteration = 0;
      while (iteration < maxIterations) {
        const callParts =
          response.candidates?.[0]?.content?.parts?.filter(
            (p: any) => p.functionCall,
          ) || [];

        if (callParts.length === 0) break;
        const functionResponses: any[] = [];
        for (const part of callParts) {
          const fn = part.functionCall;
          const data = await this.executeFunction(fn.name, fn.args);
          functionResponses.push({
            functionResponse: {
              name: fn.name,
              response: data,
            },
          });
        }
        result = await chat.sendMessage(functionResponses);
        response = result.response;
        iteration++;
      }
      session.history = await chat.getHistory();
      session.lastActive = new Date();

      const responseText = response.text();
      await this.saveChatHistory(userId, query, responseText);

      return {
        response: responseText,
        success: true,
        tokensUsed: iteration,
      };
    } catch (error) {
      this.logger.error('Lỗi Chat: ' + error.message);
      return {
        response: 'Xin lỗi, hệ thống AI đang gặp sự cố. Vui lòng thử lại sau.',
        error: error.message,
        success: false,
      };
    }
  }

  private getOrCreateSession(userId: string): ChatSession {
    if (!this.sessions.has(userId)) {
      this.sessions.set(userId, { history: [], lastActive: new Date() });
    }
    return this.sessions.get(userId)!;
  }

  clearHistory(userId: string) {
    this.sessions.delete(userId);
    return { success: true, message: 'Đã xóa lịch sử chat' };
  }

  getStats() {
    return {
      totalActiveSessions: this.sessions.size,
      totalEntities: this.schemaService.getAllEntities().length,
      availableTables: this.schemaService
        .getAllEntities()
        .map((e) => e.tableName),
    };
  }

  private async fallbackResponse(query: string) {
    this.logger.warn(`Fallback mode: ${query}`);
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('bao nhiêu') && lowerQuery.includes('nhân viên')) {
      try {
        const count = await this.queryService.count({ tableName: 'employee' });
        return {
          response: `Hệ thống hiện có ${count} nhân viên.`,
          success: true,
          fallbackMode: true,
        };
      } catch (error) {
        return this.fallbackError();
      }
    }
    if (lowerQuery.includes('phòng ban')) {
      try {
        const departments = await this.queryService.find({
          tableName: 'department',
          limit: 10,
        });
        return {
          response: `Có ${departments.length} phòng ban: ${departments.map((d: any) => d.name).join(', ')}`,
          success: true,
          fallbackMode: true,
        };
      } catch (error) {
        return this.fallbackError();
      }
    }
    if (lowerQuery.includes('tổng quan') || lowerQuery.includes('overview')) {
      try {
        const overview = await this.getSystemOverview();
        return {
          response: overview.summary,
          data: overview,
          success: true,
          fallbackMode: true,
        };
      } catch (error) {
        return this.fallbackError();
      }
    }
    return {
      response:
        'Xin lỗi, AI chatbot hiện đang trong chế độ fallback (Google API không khả dụng). ' +
        'Bạn có thể hỏi về: số lượng nhân viên, danh sách phòng ban, hoặc tổng quan hệ thống.',
      success: true,
      fallbackMode: true,
      suggestion: [
        'Có bao nhiêu nhân viên?',
        'Liệt kê phòng ban',
        'Tổng quan hệ thống',
      ],
    };
  }

  private fallbackError() {
    return {
      response:
        'Xin lỗi, không thể truy vấn dữ liệu. Vui lòng kiểm tra kết nối database.',
      success: false,
      fallbackMode: true,
    };
  }

  private async saveChatHistory(
    userId: string,
    question: string,
    answer: string,
  ) {
    try {
      await this.chatHistoryRepo.save({
        userId,
        question,
        answer,
        createdBy: userId,
      });
    } catch (error) {
      this.logger.error(`Lỗi lưu lịch sử: ${error.message}`);
    }
  }

  async getChatHistory(userId: string, limit = 50, offset = 0) {
    const [data, total] = await this.chatHistoryRepo.findAndCount({
      where: { userId, isDeleted: false },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return {
      data,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
    };
  }

  async searchChatHistory(userId: string, searchTerm: string) {
    const qb = this.chatHistoryRepo
      .createQueryBuilder('ch')
      .where('ch.userId = :userId', { userId })
      .andWhere('ch.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('(ch.question LIKE :search OR ch.answer LIKE :search)', {
        search: `%${searchTerm}%`,
      })
      .orderBy('ch.createdAt', 'DESC')
      .take(20);

    return await qb.getMany();
  }

  async clearChatHistory(userId: string) {
    await this.chatHistoryRepo.update(
      { userId, isDeleted: false },
      { isDeleted: true },
    );

    this.sessions.delete(userId);

    return { success: true, message: 'Đã xóa toàn bộ lịch sử chat' };
  }

  async deleteChatHistoryItem(userId: string, historyId: string) {
    const item = await this.chatHistoryRepo.findOne({
      where: { id: historyId, userId },
    });

    if (!item) {
      throw new Error('Không tìm thấy lịch sử này');
    }

    item.isDeleted = true;
    await this.chatHistoryRepo.save(item);

    return { success: true, message: 'Đã xóa câu hỏi' };
  }

  async getChatHistoryStats(userId: string) {
    const total = await this.chatHistoryRepo.count({
      where: { userId, isDeleted: false },
    });

    const today = await this.chatHistoryRepo
      .createQueryBuilder('ch')
      .where('ch.userId = :userId', { userId })
      .andWhere('ch.isDeleted = false')
      .andWhere('DATE(ch.createdAt) = CURDATE()')
      .getCount();

    return {
      total,
      today,
      hasActiveSession: this.sessions.has(userId),
    };
  }
}
