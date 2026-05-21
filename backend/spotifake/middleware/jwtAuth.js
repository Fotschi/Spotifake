import authService from '../services/authService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

export default function jwtAuth(request, response, next) {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response.status(401).json({ error: 'Unauthorized', message: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    const payload = authService.verifyToken(token);

    if (!payload) {
        return response.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
    }

    request.user = { id: payload.sub, username: payload.username };
    next();
}
