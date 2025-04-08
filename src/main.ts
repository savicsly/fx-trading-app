import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  console.log('Loaded API Key:', configService.get<string>('API_KEY')); // Log the loaded API key

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('FX Trading App API')
    .setDescription('API documentation for the FX Trading App')
    .setVersion('1.0')
    .addBearerAuth() // Use the default Bearer token scheme
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
});
