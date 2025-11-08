// src/services/mockPaymentService.js
import { showSuccess, showError } from '../utils/toast';

// Mock payment processing
export const processMockPayment = async (plan, paymentMethod) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate payment processing
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        resolve({
          transactionId: `TXN-${Date.now()}`,
          plan,
          amount: plan === 'PREMIUM' ? 9.99 : 19.99,
          paymentMethod,
          status: 'SUCCESS',
          timestamp: new Date().toISOString()
        });
      } else {
        reject({
          error: 'Payment declined',
          message: 'Please try another payment method'
        });
      }
    }, 2000); // Simulate network delay
  });
};

// Mock subscription upgrade
export const upgradeMockSubscription = async (userId, newTier) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        userId,
        tier: newTier,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE'
      });
    }, 1500);
  });
};

// Mock refund request
export const requestMockRefund = async (subscriptionId, reason) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        refundId: `REF-${Date.now()}`,
        subscriptionId,
        reason,
        amount: 9.99,
        status: 'PENDING',
        estimatedProcessingTime: '3-5 business days'
      });
    }, 1000);
  });
};