// src/services/payment.service.ts
import api from './api';

interface StudentInfo {
  name: string;
  id: string;
  email: string;
}

interface CreatePaymentRequest {
  school_id: string;
  student_info: StudentInfo;
  amount: number;
  callback_url: string;
}

interface PaymentResponse {
  paymentRedirectUrl: string;
  collectRequestId: string;
}

export const paymentService = {
  createPayment: async (paymentData: CreatePaymentRequest): Promise<PaymentResponse> => {
    const response = await api.post<PaymentResponse>('/orders/create-payment', paymentData);
    return response.data;
  },
  getTransactions: async (params = {}) => {
    const response = await api.get('/orders/transactions', { params });
    return response.data;
  },
  getSchoolTransactions: async (schoolId: string, page = 1, limit = 10, additionalParams = {}) => {
    const params = {
      page,
      limit,
      ...additionalParams
    };
    const response = await api.get(`/orders/transactions/school/${schoolId}`, { params });
    return response.data;
  },
  getTransactionsBySchool: async (schoolId: string) => {
    const response = await api.get(`/orders/transactions?school_id=${schoolId}`);
    return response.data;
  },

  getTransactionStatus: async (orderId: string) => {
    const response = await api.get(`/orders/transaction-status/${orderId}`);
    return response.data;
  }


};


