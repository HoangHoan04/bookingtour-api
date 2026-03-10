import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express, { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters';

// Cache cho serverless function (Cold Start optimization)
let cachedServer: express.Application;

// Bootstrap function cho local development
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Set global prefix 'api' but exclude health check endpoint
  app.setGlobalPrefix('api', {
    exclude: ['health', '/'],
  });

  // CORS Configuration for multi-subdomain support
  app.enableCors({
    origin: [
      'https://himlamtourist.xyz',
      'https://admin.himlamtourist.xyz',
      'https://dev.himlamtourist.xyz',
      'https://dev-admin.himlamtourist.xyz',
      'http://localhost:3000',
      'http://localhost:3005',
      'http://localhost:3350',
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'tokenid', // Custom header for token authentication
      'x-api-key', // For AI service integration
    ],
  });

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  const options = new DocumentBuilder()
    .setTitle('BookingTour API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  // Railway provides PORT via environment variable
  const port = parseInt(
    process.env.PORT || configService.get('PORT') || '4300',
    10,
  );
  const host = '0.0.0.0'; // Always bind to 0.0.0.0 in production/Railway

  await app.listen(port, host);

  console.log('='.repeat(50));
  console.log(`🚀 Application started successfully!`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Listening on: ${host}:${port}`);
  console.log(`💚 Health Check: http://${host}:${port}/health`);
  console.log(`📚 API Docs: http://${host}:${port}/api-docs`);
  console.log(`🔗 API Endpoints: http://${host}:${port}/api/*`);
  console.log('='.repeat(50));
}

// Bootstrap function cho Vercel serverless
async function bootstrapServer() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    // Set global prefix 'api' but exclude health check endpoint
    app.setGlobalPrefix('api', {
      exclude: ['health', '/'],
    });

    // CORS Configuration for multi-subdomain support
    app.enableCors({
      origin: [
        'https://himlamtourist.xyz',
        'https://admin.himlamtourist.xyz',
        'https://dev.himlamtourist.xyz',
        'https://dev-admin.himlamtourist.xyz',
        'http://localhost:3000',
        'http://localhost:3005',
        'http://localhost:3350',
        'http://localhost:5173',
        'http://localhost:5174',
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'tokenid', // Custom header for token authentication
        'x-api-key', // For AI service integration
      ],
    });
    app.use(json({ limit: '10mb' }));
    app.use(urlencoded({ extended: true, limit: '10mb' }));
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new AllExceptionsFilter());

    // Swagger setup cho Vercel
    const options = new DocumentBuilder()
      .setTitle('BookingTour API')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);

    await app.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

// Chạy bootstrap nếu không phải môi trường Vercel
if (require.main === module) {
  bootstrap().catch((err) => {
    console.error('Error starting application:', err);
    process.exit(1);
  });
}

// Export handler cho Vercel
export default async (req: any, res: any) => {
  const server = await bootstrapServer();
  server(req, res);
};
