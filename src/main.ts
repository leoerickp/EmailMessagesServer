import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      //forbidNonWhitelisted: true,

      // para transformar los DTO de string a nuestros tipos de datos y verificar
      /*transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      }*/
    })
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
