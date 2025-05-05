// src/main.ts

//pm2 start dist/src/main.js --name school-payment-backend

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common'; // Import ValidationPipe

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Add CORS configuration
//   // const frontendUrl = process.env.FRONTEND_URL || '*';
//   // app.enableCors({
//   //   origin: frontendUrl,
//   //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//   //   credentials: true,
//   // });

//   app.enableCors({
//     origin: '*',
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization']
//   });

//   // Enable global validation pipe
//   app.useGlobalPipes(new ValidationPipe({
//     whitelist: true, // Automatically remove properties without decorators
//     forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
//     transform: true, // Automatically transform payloads to DTO instances
//     transformOptions: {
//       enableImplicitConversion: true, // Convert primitive types implicitly (e.g., string query param to number)
//     },
//   }));

//   // Use Heroku's dynamic port or fallback to 3000
//   const port = process.env.PORT || 3000;
//   await app.listen(port);
//   console.log(`Application is running on port ${port}`);
// }
// bootstrap();



import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://school-payment-assessment-sanket-devmundes-projects.vercel.app',
        'https://school-payment-assessment.vercel.app',
        'https://school-payment-assessment-git-main-sanket-devmundes-projects.vercel.app',
        'http://localhost:3000',
        'http://localhost:5173'
      ];
      
      // Allow requests with no origin (like mobile apps, curl requests, etc)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('Blocked origin:', origin);
        callback(null, true); // For development - allow all origins
        // For production: callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'], // Add all methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Length', 'Content-Type']
  });
  console.log('CORS enabled for http://localhost:3000');
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port ${port}`);

}
bootstrap();