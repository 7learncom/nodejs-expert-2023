import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { STATUS } from './constants.js';
import sql from './db.js';

async function createPayment(call, callback) {
    try {
        const { customer_id, amount } = call.request;
        const [payment] = await sql`INSERT INTO payment(customer_id, amount, status) VALUES(${customer_id}, ${amount}, ${STATUS.PENDING}) RETURNING *`;

        callback(null, { id: payment.id });
    } catch (error) {
        callback(error, null);
    }
}

const server = new grpc.Server();

const packageDefinition = protoLoader.loadSync('../../shared/protos/payment.proto', { keepCase: true });
const paymentProto = grpc.loadPackageDefinition(packageDefinition).microshop.payment;

server.addService(paymentProto.Payment.service, {
    createPayment,
});

export default function startServer(port) {
    server.bindAsync(`localhost:${port}`, grpc.ServerCredentials.createInsecure(), () => {
        console.log('Payment gRPC server is running on port', port);
        server.start();
    });
}
