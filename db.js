import pg from 'pg';

const {Pool} = pg;

let localPoolConfig = {
    user: 'postgres',
    password: 'think two',
    host: 'localhost',
    port: '5432',
    database: 'tat'
};

const poolConfig = process.env.DATABASE_URL ? {connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:false}} : localPoolConfig;
const pool = new Pool(poolConfig);
export default pool;