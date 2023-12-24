import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Environment } from './env/env';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CONSTANTS } from './common/constant';

new Environment().setConfig();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // SWAGGER CONFIGURATION
  const config = new DocumentBuilder()
    .setTitle(CONSTANTS.swaggerTitle)
    .setDescription(CONSTANTS.swaggerDescription)
    .setVersion(CONSTANTS.swaggerVersion)
    .addTag(CONSTANTS.swaggerTag)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
