/* eslint-disable prettier/prettier */
import { DocumentBuilder, SwaggerDocumentOptions } from "@nestjs/swagger";

export const config = new DocumentBuilder()
  .setTitle("Salaka Krishi Api")
  .setDescription("API documentation for Salaka Krishi")
  .setVersion("1.0")
  .addBearerAuth()
  .addSecurityRequirements("bearer")
  .build();

export const options: SwaggerDocumentOptions = {
  operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
};
