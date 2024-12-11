import fs from 'fs';
import {defineConfig} from 'drizzle-kit'
import { dbConfig } from './src/config/dbConfig';

export default defineConfig ({
    schema: './src/db/schemas',
    dialect: 'postgresql',
    out: './migrations',
    dbCredentials: {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
        ssl: { 
            rejectUnauthorized: true,
            ca: fs.readFileSync('./ca.pem').toString()
        }
    }
})