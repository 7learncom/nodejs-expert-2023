export default function loggerMiddleware(req, res, next) {
    console.log('Request:', req.method, req.url);
    next();
}
