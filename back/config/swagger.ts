import swaggerJsdoc from 'swagger-jsdoc';

interface SwaggerOptions {
  definition: {
    openapi: string;
    info: {
      title: string;
      version: string;
      description: string;
      contact: {
        name: string;
        email: string;
      };
    };
    components?: {
      securitySchemes?: {
        [key: string]: {
          type: string;
          scheme: string;
          bearerFormat?: string;
        };
      };
    };
    security?: Array<{
      [key: string]: string[];
    }>;
    servers: Array<{
      url: string;
      description: string;
    }>;
  };
  apis: string[];
}

const options: SwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gamer Challenge API with PostgreSQL and Prisma',
      version: '1.0.0',
      description: 'A RESTful API with full CRUD operations built with Express, PostgreSQL, and Prisma',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    servers: [
      {
        url: `http://localhost:${process.env.PORT || "3000"}`,
        description: 'Development server',
      },
    ],
  },

  apis: [
    './routes/*.ts',
    './swagger/*.ts'
  ],
};

const swaggerSpecs = swaggerJsdoc(options);

export default swaggerSpecs;