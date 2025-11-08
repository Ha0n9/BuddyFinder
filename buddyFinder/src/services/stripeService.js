// src/services/stripeService.js
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY);

export const createCheckoutSession = async (plan) => {
  const response = await api.post('/payments/create-checkout-session', { plan });
  const stripe = await stripePromise;
  await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
};

export const cancelSubscription = async () => {
  return api.post('/payments/cancel-subscription');
};

export const requestRefund = async (subscriptionId, reason) => {
  return api.post('/payments/refund', { subscriptionId, reason });
};