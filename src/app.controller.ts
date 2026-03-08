import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Root')
@Controller()
export class AppController {
  @Get()
  root() {
    return {
      message: 'BookingTour API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  // Health check endpoint for Railway/Render/K8s
  @Get('health')
  health() {
    return {
      status: 'ok',
      message: 'API is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  // Alternative health check
  @Get('api/health')
  apiHealth() {
    return this.health();
  }
}
