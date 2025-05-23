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
export const cancelOrder = async (orderId, data) => {
    try {
        const response = await instanceLocal.post(`/orders/${orderId}/cancel`, data, {
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
        const response = await instanceLocal.post(`/orders/${orderId}/complete`, null, {
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

        const response = await instanceLocal.post(`/orders/${orderId}/refund-request`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...getAuthHeaders()
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
        const response = await instanceLocal.post(`/admin/orders/${orderId}/change-status`, data,{
               headers: 
                getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};

// Admin: Approve refund
export const approveRefund = async (refundId) => {
    try {
        const response = await instanceLocal.post(`/admin/orders/refunds/${refundId}/approve`, null, {
            headers: getAuthHeaders()
        });
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
        }, {
            headers: getAuthHeaders()
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
                'Content-Type': 'multipart/form-data',
                ...getAuthHeaders()
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

export const getAdminOrders = async (filters = {}) => {
    try {
        // Construct query parameters from filters
        const queryParams = new URLSearchParams();
        if (filters.status_id) queryParams.append('status_id', filters.status_id);
        if (filters.order_code) queryParams.append('order_code', filters.order_code);
        if (filters.name) queryParams.append('name', filters.name);
        if (filters.phone) queryParams.append('phone', filters.phone);
        
        const queryString = queryParams.toString();
        const url = `/orders${queryString ? `?${queryString}` : ''}`;
        
        const response = await instance.get(url, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};

export const getOrderStatus = async () => {
    try {
        const response = await instance.get(`/orders/status`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};

export const getOrderDetailAdmin = async (orderId) => {
    try {
        const response = await instance.get(`/orders/${orderId}`, {
            headers: getAuthHeaders(),
        });
        return response;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};

// Add review for order
export const addOrderReview = async (data) => {
    try {
        const formData = new FormData();
        formData.append('order_id', data.order_id);
        formData.append('order_item_id', data.order_item_id);
        formData.append('variation_id', data.variation_id);
        formData.append('rating', data.rating);
        formData.append('content', data.content);
        
        // Append images if any
        if (data.images && data.images.length > 0) {
            data.images.forEach(image => {
                formData.append('images[]', image);
            });
        }

        const response = await instanceLocal.post(`/reviews`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...getAuthHeaders()
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};

// Update review
export const updateOrderReview = async (reviewId, data) => {
    try {
        const formData = new FormData();
        formData.append('rating', data.rating);
        formData.append('content', data.content);
        formData.append('_method', 'PUT');
        
        // Append existing images to keep
        if (data.keep_images && data.keep_images.length > 0) {
            data.keep_images.forEach(image => {
                formData.append('keep_images[]', image);
            });
        }

        // Append new images if any
        if (data.images && data.images.length > 0) {
            data.images.forEach(image => {
                formData.append('images[]', image);
            });
        }

        const response = await instanceLocal.post(`/reviews/${reviewId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...getAuthHeaders()
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Có lỗi xảy ra';
    }
};