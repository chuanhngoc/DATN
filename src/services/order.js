import { token_auth } from "../auth/getToken";
import instance, { instanceLocal } from "./instance";

// Get orders with optional status filter
const getAuthHeaders = () => {
    const token_ = token_auth();
    return token_ ? { Authorization: `Bearer ${token_}` } : {};
};
export const getOrders = async (status = '') => {
    try {
        const response = await instanceLocal.get(`/orders/history${status ? `?status=${status}` : ''}`, {
            headers: getAuthHeaders(),
        });
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};

// Get order details by ID
export const getOrderDetail = async (orderId) => {
    try {
        const response = await instanceLocal.get(`/orders/${orderId}`, {
            headers: getAuthHeaders(),
        });
        return response;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};

// Cancel order with reason
export const cancelOrder = async (orderId, cancelReason) => {
    try {
        const response = await instanceLocal.post(`/orders/${orderId}/cancel`, {
            cancel_reason: cancelReason
        }, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};

// Complete order
export const completeOrder = async (orderId) => {
    try {
        const response = await instanceLocal.post(`/orders/history/${orderId}/complete`, null, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};

// Request refund
export const requestRefund = async (orderId, data) => {
    try {
        const formData = new FormData();
        formData.append('type', data.type);
        formData.append('amount', data.amount);
        formData.append('reason', data.reason);
        formData.append('bank_name', data.bank_name);
        formData.append('bank_account_name', data.bank_account_name);
        formData.append('bank_account_number', data.bank_account_number);

        // Append images if any
        if (data.images && data.images.length > 0) {
            data.images.forEach(image => {
                formData.append('images[]', image);
            });
        }

        const response = await instanceLocal.post(`/orders/history/${orderId}/refund-request`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};

// Admin: Change order status
export const changeOrderStatus = async (orderId, newStatusId, cancelReason = '') => {
    try {
        const data = {
            new_status_id: newStatusId,
            ...(newStatusId === 6 && { cancel_reason: cancelReason })
        };
        const response = await instanceLocal.post(`/admin/orders/${orderId}/change-status`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};

// Admin: Approve refund
export const approveRefund = async (refundId) => {
    try {
        const response = await instanceLocal.post(`/admin/orders/refunds/${refundId}/approve`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};

// Admin: Reject refund
export const rejectRefund = async (refundId, rejectReason) => {
    try {
        const response = await instanceLocal.post(`/admin/orders/refunds/${refundId}/reject`, {
            reject_reason: rejectReason
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};

// Admin: Mark refund as refunded
export const markRefundAsRefunded = async (refundId, refundProofImage) => {
    try {
        const formData = new FormData();
        formData.append('refund_proof_image', refundProofImage);

        const response = await instanceLocal.post(`/admin/orders/refunds/${refundId}/refunded`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};

export const paymentReusult = async (queryString) => {
    return instanceLocal.get(`/vnpay/return?${queryString}`);
};

// Retry payment for an order
export const retryPayment = async (orderId) => {
    try {
        const response = await instanceLocal.post(`/orders/${orderId}/retry-payment`, null, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};

//admin

export const getAdminOrders = async () => {
    try {
        const response = await instance.get(`/orders`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};