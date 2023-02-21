import * as Joi from 'joi';

// This function create environment variables if they don't exist in the .env file and to user it in the ConfigModule
export const JoiValidationSchema = Joi.object({
    STATE: Joi.required().default('prod'),
    PORT: Joi.required().default(3000),
    MONGODB: Joi.required(),
    JWT_SECRET: Joi.required(),
    ADMIN_EMAIL: Joi.required()
})