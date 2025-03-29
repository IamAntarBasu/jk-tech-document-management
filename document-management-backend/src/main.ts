import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { json } from "body-parser";
import helmet from "helmet";
import { ApplicationModule } from "./app.module";

async function bootstrap() {
  // Create a NestJS application instance using the AppModule
  const app = await NestFactory.create(ApplicationModule);

  // Middleware to parse incoming JSON requests
  app.use(json());

  // Security middleware to set HTTP headers for protection against common vulnerabilities
  app.use(helmet());

  // Apply global validation pipe to validate and transform request data
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips out properties that are not in the DTO
      transform: true, // Automatically transforms request payloads to match DTOs
    }),
  );

  // Define the port from environment variables or default to 9000
  const port = process.env.PORT || 9000;

  // Start the application and listen on all network interfaces (0.0.0.0)
  await app.listen(port, "0.0.0.0");
}

// Bootstrap the application
bootstrap();
