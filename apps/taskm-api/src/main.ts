/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = '';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => {
          let message = error.constraints
            ? error.constraints[Object.keys(error.constraints)[0]]
            : '';

          message = message.replace(`${error.property} `, '');
          message = message.charAt(0).toUpperCase() + message.slice(1);

          return {
            property: error.property,
            message,
          };
        });
        return new BadRequestException(result);
      },
    })
  );

  const port = process.env.TASK_MANAGER_API_PORT || 3001;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
