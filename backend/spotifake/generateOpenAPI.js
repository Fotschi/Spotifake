import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Spotifake API',
      version: '1.0.0',
      description: 'API Dokumentation für Spotifake',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Entwicklungs-Server',
      },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        }
    }
  },
  apis: ['./routes/v1/*.js'], 
};

const openapiSpecification = swaggerJsdoc(options);

export default openapiSpecification;
