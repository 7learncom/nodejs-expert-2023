import express from 'express';
import routes from './routes.js';

const app = express();

function loggerMiddleware(req, res, next) {
    console.log('Request:', req.method, req.url);
    next();
}

app.disable('etag');
app.use(loggerMiddleware);
app.use('/contacts', routes);
app.listen(3000, () => {
    console.log('express server is listening on the port 3000');
});
