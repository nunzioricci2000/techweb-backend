import express from 'express';
import errorHandler from './middleware/error-handler.middleware.js';
import AuthRouter from './routes/auth.router.js';
import AuthController from './controllers/auth.controller.js';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use(errorHandler);

app.listen(PORT);
