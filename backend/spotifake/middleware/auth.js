import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'spotifake_geheimnis_123';

export default function checkAuth(req, res, next) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ error: 'Nicht eingeloggt!' });
    }

    const parts = authHeader.split(' ');
    const token = parts.length === 2 ? parts[1] : parts[0];

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = { id: payload.sub, username: payload.username };
        next();
    } catch (e) {
        return res.status(401).json({ error: 'Ungültiger Ausweis!' });
    }
}
