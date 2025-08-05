import express from 'express';
import errorHandler from './middleware/error-handler.middleware.js';
import AuthRouter from './routes/auth.router.js';
import AuthController from './controllers/auth.controller.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const PORT = 3000;

const swaggerSpecification = swaggerJsdoc({
    swaggerDefinition: {
    openapi: '3.0.0',
        info: {
            title: 'Fake Restaurant API',
            version: '1.0.0',
        },
    },
    apis: ['./src/routes/*.js'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecification));

const authController = new AuthController();

app.use('/auth', AuthRouter(authController));

app.use(errorHandler);

app.listen(PORT);
