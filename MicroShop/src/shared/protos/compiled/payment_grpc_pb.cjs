// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var payment_pb = require('./payment_pb.cjs');

function serialize_microshop_payment_NewPayment(arg) {
  if (!(arg instanceof payment_pb.NewPayment)) {
    throw new Error('Expected argument of type microshop.payment.NewPayment');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_microshop_payment_NewPayment(buffer_arg) {
  return payment_pb.NewPayment.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_microshop_payment_NewPaymentRequest(arg) {
  if (!(arg instanceof payment_pb.NewPaymentRequest)) {
    throw new Error('Expected argument of type microshop.payment.NewPaymentRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_microshop_payment_NewPaymentRequest(buffer_arg) {
  return payment_pb.NewPaymentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var PaymentService = exports.PaymentService = {
  createPayment: {
    path: '/microshop.payment.Payment/createPayment',
    requestStream: false,
    responseStream: false,
    requestType: payment_pb.NewPaymentRequest,
    responseType: payment_pb.NewPayment,
    requestSerialize: serialize_microshop_payment_NewPaymentRequest,
    requestDeserialize: deserialize_microshop_payment_NewPaymentRequest,
    responseSerialize: serialize_microshop_payment_NewPayment,
    responseDeserialize: deserialize_microshop_payment_NewPayment,
  },
};

exports.PaymentClient = grpc.makeGenericClientConstructor(PaymentService);
