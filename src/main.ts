import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', // Allow requests from this domain
    methods: 'GET', // Allowed HTTP methods
    credentials: true, // Allow cookies to be sent
  };

  app.enableCors(corsOptions);
  await app.listen(8000);
}
bootstrap();
