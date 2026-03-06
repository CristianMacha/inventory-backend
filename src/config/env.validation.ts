import * as Joi from 'joi';

export const envValidation = Joi.object({
  APP_PORT: Joi.number().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_TYPE: Joi.string()
    .valid('mysql', 'postgres', 'mariadb')
    .default('mysql'),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.number().default(3600),
  JWT_REFRESH_SECRET: Joi.string().optional(),
  FIREBASE_PROJECT_ID: Joi.string().required(),
  GOOGLE_APPLICATION_CREDENTIALS: Joi.string().optional(),
  FIREBASE_SERVICE_ACCOUNT_JSON: Joi.string().optional(),
  FIREBASE_DEFAULT_ROLE_NAME: Joi.string().optional(),
  ALLOWED_ORIGINS: Joi.string().optional(),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  FIREBASE_STORAGE_BUCKET: Joi.string().required(),
});
