import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'teste']).default('development'),
    PORT: z.coerce.number().default(3001),
    DB_HOST: z.string(),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_PORT: z.coerce.number(),
    DB_NAME: z.string(),
    JWT_SECRET: z.string()
})

const _env = envSchema.safeParse(process.env)

if(!_env.success) {
    console.error('Variáveis de ambientes inválidas', _env.error.format());
    throw new Error('Variáveis de ambientes inválidas');   
}

export const env = _env.data;