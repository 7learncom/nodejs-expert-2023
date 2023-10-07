import grpc from '@grpc/grpc-js';
import services from '../../shared/protos/compiled/payment_grpc_pb.cjs';
import messages from '../../shared/protos/compiled/payment_pb.cjs';
import { STATUS } from './constants.js';
import sql from './db.js';

async function createPayment(call, callback) {
    try {
        const customer_id = call.request.getCustomerId();
        const amount = call.request.getAmount();

        const [payment] = await sql`INSERT INTO payment(customer_id, amount, status) VALUES(${customer_id}, ${amount}, ${STATUS.PENDING}) RETURNING *`;

        const newPayment = new messages.NewPayment();
        newPayment.setId(payment.id);

        callback(null, newPayment);
    } catch (error) {
        callback(error, null);
    }
}

const server = new grpc.Server();

server.addService(services.PaymentService, {
    createPayment,
});

export default function startServer(port) {
    server.bindAsync(`localhost:${port}`, grpc.ServerCredentials.createInsecure(), () => {
        console.log('Payment gRPC server is running on port', port);
        server.start();
    });
}
