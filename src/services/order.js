import { instanceLocal } from "./instance";

// Get orders with optional status filter
export const getOrders = async (status = '') => {
    try {
        const response = await instanceLocal.get(`/orders/history${status ? `?status=${status}` : ''}`);
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};

// Get order details by ID
export const getOrderDetail = async (orderId) => {
    try {
        const response = await instanceLocal.get(`/orders/history/${orderId}`);
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};

export const paymentReusult = async (queryString) => {
    return instanceLocal.get(`/vnpay/return?${queryString}`);
};

// Cancel order with reason
export const cancelOrder = async (orderId, cancelReason) => {
    try {
        const response = await instanceLocal.post(`/orders/history/${orderId}/cancel`, {
            cancel_reason: cancelReason
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};