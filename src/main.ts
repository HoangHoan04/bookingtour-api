import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express, { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters';

let cachedServer: express.Application;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api', {
    exclude: ['health', '/'],
  });

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
    'tokenid',      
    'x-api-key',
    'x-lang',       
    'tokenId',      
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

  const port = parseInt(
    process.env.PORT || configService.get('PORT') || '4300',
    10,
  );
  const host = '0.0.0.0';

  await app.listen(port, host);

  console.log('='.repeat(50));
  console.log(`Application started successfully!`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Listening on: ${host}:${port}`);
  console.log(`Health Check: http://${host}:${port}/health`);
  console.log(`API Docs: http://${host}:${port}/api-docs`);
  console.log(`API Endpoints: http://${host}:${port}/api/*`);
  console.log('='.repeat(50));
}

async function bootstrapServer() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    app.setGlobalPrefix('api', {
      exclude: ['health', '/'],
    });
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
      'tokenid',      
      'x-api-key',  
      'x-lang',       
      'tokenId',      
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

    await app.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

if (require.main === module) {
  bootstrap().catch((err) => {
    console.error('Error starting application:', err);
    process.exit(1);
  });
}

export default async (req: any, res: any) => {
  const server = await bootstrapServer();
  server(req, res);
};
