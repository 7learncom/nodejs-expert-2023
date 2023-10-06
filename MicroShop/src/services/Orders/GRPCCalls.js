import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync('../../shared/protos/payment.proto', { keepCase: true });
const paymentProto = grpc.loadPackageDefinition(packageDefinition).microshop.payment;

const paymentClient = new paymentProto.Payment(process.env.PAYMENT_GRPC, grpc.credentials.createInsecure());

export function createPayment({ customer_id, amount }) {
    return new Promise((resolve, reject) => {
        paymentClient.createPayment({ customer_id, amount }, (error, response) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(response);
        });
    });
}
