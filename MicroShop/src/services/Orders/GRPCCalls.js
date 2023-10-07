import grpc from '@grpc/grpc-js';
import services from '../../shared/protos/compiled/payment_grpc_pb.cjs';
import messages from '../../shared/protos/compiled/payment_pb.cjs';

const paymentClient = new services.PaymentClient(process.env.PAYMENT_GRPC, grpc.credentials.createInsecure());

export function createPayment({ customer_id, amount }) {
    return new Promise((resolve, reject) => {
        const newPaymentRequest = new messages.NewPaymentRequest();
        newPaymentRequest.setCustomerId(customer_id);
        newPaymentRequest.setAmount(amount);

        paymentClient.createPayment(newPaymentRequest, (error, response) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(response);
        });
    });
}
