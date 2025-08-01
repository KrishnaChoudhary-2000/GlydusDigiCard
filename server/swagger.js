import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Glydus Digital Card API',
            version: '1.0.0',
            description: 'API for managing digital business cards',
            contact: {
                name: 'API Support',
                email: 'support@glydus.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            },
            {
                url: 'https://your-domain.vercel.app',
                description: 'Production server'
            }
        ],
        components: {
            schemas: {
                Card: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Unique identifier for the card'
                        },
                        name: {
                            type: 'string',
                            description: 'Full name of the person'
                        },
                        title: {
                            type: 'string',
                            description: 'Job title or position'
                        },
                        company: {
                            type: 'string',
                            description: 'Company or organization name'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email address'
                        },
                        phone: {
                            type: 'string',
                            description: 'Phone number'
                        },
                        website: {
                            type: 'string',
                            format: 'uri',
                            description: 'Personal or company website'
                        },
                        linkedin: {
                            type: 'string',
                            format: 'uri',
                            description: 'LinkedIn profile URL'
                        },
                        twitter: {
                            type: 'string',
                            description: 'Twitter/X handle'
                        },
                        bio: {
                            type: 'string',
                            description: 'Short bio or description'
                        },
                        avatar: {
                            type: 'string',
                            description: 'Avatar image URL or base64 data'
                        },
                        theme: {
                            type: 'object',
                            description: 'Card theme configuration'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Card creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Card last update timestamp'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error message'
                        }
                    }
                },
                ShortUrlResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            description: 'Operation success status'
                        },
                        shortUrl: {
                            type: 'string',
                            description: 'Generated short URL'
                        },
                        shortId: {
                            type: 'string',
                            description: 'Short URL identifier'
                        },
                        originalId: {
                            type: 'string',
                            description: 'Original card ID'
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js']
};

export const specs = swaggerJsdoc(options); 