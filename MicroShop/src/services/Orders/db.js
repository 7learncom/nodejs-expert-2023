import postgres from 'postgres';

const sql = postgres(process.env.DB_CONNECTION);

export default sql;
