import express from 'express';
import errorHandler from './middleware/error-handler.middleware.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import initModels from './models/index.js';
import initRepositories from './repositories/index.js';
import initServices from './services/index.js';
import initRouters from './routes/index.js';
import initControllers from './controllers/index.js';
import initMiddlewares from './middleware/index.js';
import { PORT, STATIC_DIR } from './common/constants.js';

export const app = express();

app.use(express.static(STATIC_DIR));

/**
 * @type {import('swagger-jsdoc').Options}
 */
const swaggerSpecification = swaggerJsdoc({
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Fake Restaurant API',
            version: '1.0.0',
        },
        tags: [
            {
                name: 'auth',
                description: 'Authentication related endpoints',
            },
            {
                name: 'restaurants',
                description: 'Restaurant related endpoints',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecification));
app.get('/api', (req, res) => {
    res.json(swaggerSpecification);
});

const models = await initModels();
const repositories = await initRepositories(models);
const services = await initServices(repositories);
const controllers = await initControllers(services);
const middlewares = await initMiddlewares(services);
const routers = await initRouters(controllers, middlewares);

app.use('/auth', routers.authRouter);
app.use('/restaurants', routers.restaurantRouter);

app.use(errorHandler);

app.listen(PORT);
