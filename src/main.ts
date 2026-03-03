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

  app.setGlobalPrefix('api');
  app.enableCors();
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

  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger is running on: http://localhost:${port}/api-docs`);
}

// Bootstrap function cho Vercel serverless
async function bootstrapServer() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    app.setGlobalPrefix('api');
    app.enableCors();
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
