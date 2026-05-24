import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT ?? 4000);
  Logger.log(`Nest application URL: ${await app.getUrl()}`, 'NestApplication');
}

bootstrap();
