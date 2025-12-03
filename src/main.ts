import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { DomainExceptionFilter } from './shared/infrastructure/filters/domain-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new DomainExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Project X')
    .setDescription('The Project X API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
