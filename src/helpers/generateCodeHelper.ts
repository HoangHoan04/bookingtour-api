import { Injectable } from '@nestjs/common';
import { CODE_CONFIG, CodeType } from './generateCode.config';
import type { CodeQueryRepo } from './generateCode.config';

export class GenerateCodeHelper {
  constructor(private readonly repo: CodeQueryRepo) {}

  static async generate(type: CodeType, repo: CodeQueryRepo): Promise<string> {
    const config = CODE_CONFIG[type];

    if (!config) {
      throw new Error(`CodeType ${type} không hợp lệ`);
    }

    const result = await repo.query<{ value: number }>(
      `SELECT nextval('${config.sequence}') as value`,
    );

    const number = String(result[0].value).padStart(4, '0');

    return `${config.prefix}-${number}`;
  }
}
