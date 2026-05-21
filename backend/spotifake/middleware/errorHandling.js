export default function errorHandling(error, request, response, next) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    
    console.error(`[Error] ${statusCode}: ${message}`);
    if (error.stack) console.error(error.stack);

    response
        .status(statusCode)
        .json({ 
            error: error.name || 'Error',
            message: message 
        });
}
