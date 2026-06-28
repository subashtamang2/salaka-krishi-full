/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import helmet from "helmet";
import {
    ValidationPipe,
    BadRequestException,
    ValidationError,
} from "@nestjs/common";
import { helmetConfig } from "./config/helmet.config";
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { config, options } from "./config/swagger.config";
import { join } from "path";
async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bufferLogs: true,
    });
    const configService = app.get(ConfigService);

    console.log("MAIL HOST:", process.env.MAIL_HOST);
    console.log("MAIL PORT:", process.env.MAIL_PORT);
    console.log("MAIL USER:", process.env.MAIL_USER);

    app.enableCors({
        origin: [
            "http://localhost:5174",
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:8000",
            "http://192.168.1.74:5173",
            "http://192.168.1.74:3000",
            "http://192.168.1.74:3001",
            "http://192.168.1.74:8000",
        ],
        methods: "GET,HEAD,PATCH,PUT,POST,DELETE,OPTIONS",
        allowedHeaders: ["content-type", "authorization"],
    });
    app.use(helmet(helmetConfig));
    app.useStaticAssets(join(process.cwd(), "public"));

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            exceptionFactory: (validationErrors: ValidationError[] = []) => {
                return new BadRequestException(
                    validationErrors.map((error) => {
                        if (error.constraints) {
                            return {
                                field: error.property,
                                errors: Object.values(error.constraints).join(", "),
                            };
                        } else {
                            return error;
                        }
                    })
                );
            },
        })
    );

    app.setGlobalPrefix("api");

    // swagger configuration
    const documentFactory = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup("api/docs", app, documentFactory);

    const port = configService.get<number>("APP_PORT")!;
    await app.listen(port, "0.0.0.0", () => {

    });
}
bootstrap();
