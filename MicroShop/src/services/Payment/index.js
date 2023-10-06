import 'dotenv/config';
import sql from './db.js';
import startRESTServer from './RESTServer.js';
import startGRPCServer from './GRPCServer.js';

async function establishDBTable() {
    await sql`CREATE TABLE IF NOT EXISTS payment (id SERIAL, customer_id INTEGER, amount INTEGER, status INTEGER)`;
}

async function main() {
    await establishDBTable();

    startRESTServer(process.env.PORT);
    startGRPCServer(process.env.GRPC_PORT);
}

main();
