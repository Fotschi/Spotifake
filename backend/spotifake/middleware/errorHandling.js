export default function errorHandling(error, request, response, next) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Interner Server Fehler';
    
    console.error(`[Fehler] ${statusCode}: ${message}`);

    response
        .status(statusCode)
        .json({ 
            error: error.name || 'Fehler',
            message: message 
        });
}
