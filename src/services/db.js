// Mock implementation of the database service
// In a real application, this would connect to your actual database

import instance from "./instance";



export const db = {
    getDashboard: async (params) => {
        // This is a mock implementation that returns the sample data
        // In a real application, you would fetch this data from your API

        // Use the provided dates or default to current month
        const start_date = params.start_date || "2025-05-01"
        const end_date = params.end_date || "2025-05-10"
        
        // Convert params to query string
        const queryParams = new URLSearchParams({
            start_date,
            end_date,
            ...params
        }).toString();
        
        return (await instance.get(`/dashboard?${queryParams}`)).data;
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        return {
            start_date,
            end_date,
            overview: {
                total_orders: 120,
                total_revenue: 58000000,
                total_users: 45,
                total_products: 130,
                total_reviews: 65,
                total_categories: 12,
                total_vouchers: 7,
                average_order_value: 483333.33,
                conversion_rate: 26.67,
            },
            order_status_stats: [
                { order_status_id: 1, total: 25, status: { id: 1, name: "Chờ xác nhận" } },
                { order_status_id: 2, total: 35, status: { id: 2, name: "Đã xác nhận" } },
                { order_status_id: 3, total: 20, status: { id: 3, name: "Đang giao" } },
                { order_status_id: 4, total: 32, status: { id: 4, name: "Đã giao" } },
                { order_status_id: 5, total: 5, status: { id: 5, name: "Đã hủy" } },
                { order_status_id: 6, total: 3, status: { id: 6, name: "Hoàn tiền" } },
            ],
            cancel_and_refund_stats: {
                total_cancelled: 5,
                total_refunded: 3,
                total_orders: 120,
                cancelled_amount: 2400000,
                refunded_amount: 1500000,
                cancel_rate: 4.17,
                refund_rate: 2.5,
            },
            revenue_by_day: [
                { date: "2025-05-01", total_revenue: 2000000, total_orders: 5, average_order_value: 400000 },
                { date: "2025-05-02", total_revenue: 3500000, total_orders: 8, average_order_value: 437500 },
                { date: "2025-05-03", total_revenue: 5000000, total_orders: 12, average_order_value: 416667 },
                { date: "2025-05-04", total_revenue: 4200000, total_orders: 10, average_order_value: 420000 },
                { date: "2025-05-05", total_revenue: 6800000, total_orders: 15, average_order_value: 453333 },
                { date: "2025-05-06", total_revenue: 7500000, total_orders: 18, average_order_value: 416667 },
                { date: "2025-05-07", total_revenue: 8200000, total_orders: 20, average_order_value: 410000 },
                { date: "2025-05-08", total_revenue: 7800000, total_orders: 16, average_order_value: 487500 },
                { date: "2025-05-09", total_revenue: 6500000, total_orders: 12, average_order_value: 541667 },
                { date: "2025-05-10", total_revenue: 6500000, total_orders: 14, average_order_value: 464286 },
            ],
            pending_orders: {
                total: 12,
                average_waiting_hours: 5.6,
            },
            payment_method_stats: [
                { payment_method: "vnpay", total: 30, total_amount: 15000000, percentage: 25.0 },
                { payment_method: "momo", total: 25, total_amount: 12000000, percentage: 20.8 },
                { payment_method: "zalopay", total: 20, total_amount: 10000000, percentage: 16.7 },
                { payment_method: "cod", total: 35, total_amount: 16000000, percentage: 29.2 },
                { payment_method: "bank", total: 10, total_amount: 5000000, percentage: 8.3 },
            ],
            review_stats: {
                average_rating: 4.5,
                total_reviews: 65,
                positive_reviews: 55,
                negative_reviews: 3,
            },
            top_selling_products: [
                { id: 101, name: "Đèn sân vườn SL-Temple", total_sold: 30, total_revenue: 9000000 },
                { id: 102, name: "Đèn treo tường Moonlight", total_sold: 25, total_revenue: 7500000 },
                { id: 103, name: "Đèn LED dây 10m", total_sold: 20, total_revenue: 6000000 },
                { id: 104, name: "Đèn thả trần Crystal", total_sold: 15, total_revenue: 4500000 },
                { id: 105, name: "Đèn bàn làm việc Flexo", total_sold: 10, total_revenue: 3000000 },
            ],
            voucher_stats: {
                total_vouchers: 7,
                total_usage: 55,
                avg_discount_percent: 10.5,
                avg_discount_amount: 50000,
            },
            refund_stats: {
                total_requests: 6,
                approved_requests: 4,
                rejected_requests: 2,
                total_refunded_amount: 3000000,
            },
            category_stats: [
                { id: 3, name: "Đèn sân vườn", products_count: 15, total_sold: 120 },
                { id: 4, name: "Đèn nội thất", products_count: 25, total_sold: 95 },
                { id: 5, name: "Đèn trang trí", products_count: 20, total_sold: 85 },
                { id: 6, name: "Đèn thông minh", products_count: 10, total_sold: 65 },
                { id: 7, name: "Phụ kiện đèn", products_count: 30, total_sold: 50 },
            ],
        }
    },
}
