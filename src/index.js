import express from 'express';
import { errorHandler } from './middleware';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use(errorHandler);

app.listen(PORT);
