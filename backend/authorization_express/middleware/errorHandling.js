export default function errorHandling(request, response, next) {
    try
    {
        next();
    } catch(error) {
        response
            .status(error.statusCode)
            .send(error.message);
    }
} 