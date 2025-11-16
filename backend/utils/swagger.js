/**
 * Configuration Swagger/OpenAPI
 * ✅ Documentation API automatique
 * ✅ À intégrer dans server.js
 */
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TalentProof API',
      version: '2.0.0',
      description: 'API REST pour la plateforme TalentProof',
      contact: {
        name: 'TalentProof Support',
        email: 'support@talentproof.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development Server',
      },
      {
        url: 'https://api.talentproof.com/api',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token dans le header Authorization ou cookie HttpOnly',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
        Company: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nom: { type: 'string' },
            email: { type: 'string' },
            logo: { type: 'string', nullable: true },
            role: { type: 'string', enum: ['entreprise', 'admin'] },
            isActive: { type: 'boolean' },
          },
        },
        Talent: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            prenom: { type: 'string' },
            typeProfil: { type: 'string' },
            niveau: { type: 'string' },
            technologies: { type: 'array', items: { type: 'string' } },
            scoreTest: { type: 'number' },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
