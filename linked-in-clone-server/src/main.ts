import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Environment } from './env/env';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CONSTANT_STRINGS } from './common/constant';
import { join } from 'path';
import * as express from 'express';

new Environment().setConfig();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Serve Images Statically
  app.use('/images', express.static(join(__dirname, '..', 'user-profile-pictures')));

  // SWAGGER CONFIGURATION
  const config = new DocumentBuilder()
    .setTitle(CONSTANT_STRINGS.swaggerTitle)
    .setDescription(CONSTANT_STRINGS.swaggerDescription)
    .setVersion(CONSTANT_STRINGS.swaggerVersion)
    .addTag(CONSTANT_STRINGS.swaggerTag)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
