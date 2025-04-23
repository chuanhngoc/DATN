import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrderDetail, cancelOrder, retryPayment, requestRefund, completeOrder } from '../services/order';
import { toast } from 'react-toastify';
import { useState } from 'react';

const OrderDetail = () => {
    // Hooks và state management
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // State cho các modal
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showRefundDetailModal, setShowRefundDetailModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    // State cho form hoàn tiền
    const [refundData, setRefundData] = useState({
        reason: '', // Lý do hoàn tiền
        bank_name: '', // Tên ngân hàng
        bank_account_name: '', // Tên chủ tài khoản
        bank_account_number: '', // Số tài khoản
        images: [] // Danh sách ảnh đính kèm
    });

    // Query lấy thông tin chi tiết đơn hàng
    const { data: orderDetail, isLoading, error } = useQuery({
        queryKey: ['order-detail', id],
        queryFn: async () => {
            const response = await getOrderDetail(id);
            return response.data;
        },
    });

    // Mutation hủy đơn hàng
    const cancelOrderMutation = useMutation({
        mutationFn: async (data) => await cancelOrder(id, data.cancel_reason),
        onSuccess: () => {
            queryClient.invalidateQueries(['order-detail', id]);
            toast.success('Đơn hàng đã được hủy thành công');
            setShowCancelModal(false);
            setCancelReason('');
        },
        onError: (error) => {
            toast.error(error.message || 'Không thể hủy đơn hàng');
        }
    });

    // Mutation thanh toán lại
    const retryPaymentMutation = useMutation({
        mutationFn: () => retryPayment(id),
        onSuccess: (data) => {
            if (data?.payment_url) {
                window.location.href = data.payment_url;
            } else {
                toast.error('Không thể tạo liên kết thanh toán');
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Không thể thực hiện thanh toán lại');
        }
    });

    // Mutation hoàn thành đơn hàng
    const completeOrderMutation = useMutation({
        mutationFn: () => completeOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['order-detail', id]);
            toast.success('Đơn hàng đã được hoàn thành');
            setShowCompleteModal(false);
        },
        onError: (error) => {
            toast.error(error.message || 'Không thể hoàn thành đơn hàng');
        }
    });

    // Mutation yêu cầu hoàn tiền
    const requestRefundMutation = useMutation({
        mutationFn: (data) => requestRefund(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['order-detail', id]);
            toast.success('Yêu cầu hoàn tiền đã được gửi');
            setShowRefundModal(false);
            // Reset form
            setRefundData({
                reason: '',
                bank_name: '',
                bank_account_name: '',
                bank_account_number: '',
                images: []
            });
        },
        onError: (error) => {
            toast.error(error.message || 'Không thể gửi yêu cầu hoàn tiền');
        }
    });

    // Xử lý hủy đơn hàng
    const handleCancelOrder = async (e) => {
        e.preventDefault();
        if (!cancelReason.trim()) {
            toast.error('Vui lòng nhập lý do hủy đơn hàng');
            return;
        }
        await cancelOrderMutation.mutate({ cancel_reason: cancelReason });
    };

    // Xử lý thanh toán lại
    const handleRetryPayment = async () => {
        await retryPaymentMutation.mutate();
    };

    // Xử lý gửi yêu cầu hoàn tiền
    const handleRefundSubmit = (e) => {
        e.preventDefault();
        if (!refundData.reason.trim()) {
            toast.error('Vui lòng nhập lý do hoàn tiền');
            return;
        }
        if (!refundData.bank_name.trim() || !refundData.bank_account_name.trim() || !refundData.bank_account_number.trim()) {
            toast.error('Vui lòng nhập đầy đủ thông tin ngân hàng');
            return;
        }
        requestRefundMutation.mutate(refundData);
    };

    // Xử lý hoàn thành đơn hàng
    const handleCompleteOrder = () => {
        completeOrderMutation.mutate();
    };

    // Xử lý upload ảnh
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setRefundData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    // Format giá tiền sang VND
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Hiển thị loading
    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Hiển thị lỗi
    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Đã có lỗi xảy ra</h2>
                    <p className="text-gray-600">{error.message || 'Không thể tải thông tin đơn hàng'}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                        {/* Header */}
                        <div className="relative p-8 border-b border-slate-200 bg-gradient-to-r from-slate-800 to-slate-900">
                            <div className="absolute inset-0 bg-grid-slate-100/[0.05] bg-[size:8px_8px]"></div>
                            <div className="relative flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        Đơn hàng #{orderDetail?.code}
                                    </h1>
                                    <p className="text-slate-300 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {orderDetail?.created_at}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <span className={`px-6 py-2.5 rounded-full text-sm font-medium inline-flex items-center justify-center shadow-lg ${
                                        orderDetail?.status?.id === 8 ? 'bg-emerald-500 text-white' :
                                        orderDetail?.status?.id === 6 ? 'bg-rose-500 text-white' :
                                        'bg-white text-slate-800'
                                    }`}>
                                        {orderDetail?.status?.name}
                                    </span>
                                    <span className={`px-6 py-2.5 rounded-full text-sm font-medium inline-flex items-center justify-center shadow-lg ${
                                        orderDetail?.payment_status?.id === 3 ? 'bg-emerald-500 text-white' :
                                        orderDetail?.payment_status?.id === 2 ? 'bg-rose-500 text-white' :
                                        'bg-white text-slate-800'
                                    }`}>
                                        {orderDetail?.payment_status?.name}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin hoàn tiền */}
                        {orderDetail?.refund_request && (
                            <div className="p-8 border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-4 flex items-center text-slate-800">
                                            <div className="p-2 bg-slate-100 rounded-lg mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                            </div>
                                            Thông tin hoàn tiền
                                        </h3>
                                        <div className="flex items-center gap-4">
                                            <span className="text-slate-600 font-medium">Trạng thái:</span>
                                            <span className={`px-5 py-2 rounded-full text-sm font-semibold shadow-md ${
                                                orderDetail.refund_request.status === 'pending' ? 'bg-amber-500 text-white' :
                                                orderDetail.refund_request.status === 'approved' ? 'bg-emerald-500 text-white' :
                                                orderDetail.refund_request.status === 'rejected' ? 'bg-rose-500 text-white' :
                                                'bg-slate-500 text-white'
                                            }`}>
                                                {orderDetail.refund_request.status === 'pending' ? 'Đang chờ xử lý' :
                                                 orderDetail.refund_request.status === 'approved' ? 'Đã được chấp nhận' :
                                                 orderDetail.refund_request.status === 'rejected' ? 'Đã bị từ chối' :
                                                 'Đã hoàn tiền'}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowRefundDetailModal(true)}
                                        className="px-6 py-3 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl border border-slate-200 font-medium"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Thông tin khách hàng */}
                        <div className="p-8 border-b border-slate-200">
                            <h2 className="text-xl font-bold mb-6 flex items-center text-slate-800">
                                <div className="p-2 bg-slate-100 rounded-lg mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                Thông tin khách hàng
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-500">Họ tên</label>
                                    <p className="text-slate-800 font-medium">{orderDetail?.name}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-500">Số điện thoại</label>
                                    <p className="text-slate-800 font-medium">{orderDetail?.phone}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-500">Email</label>
                                    <p className="text-slate-800 font-medium">{orderDetail?.email}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-500">Địa chỉ</label>
                                    <p className="text-slate-800 font-medium">{orderDetail?.address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Sản phẩm đã đặt */}
                        <div className="p-8 border-b border-slate-200">
                            <h2 className="text-xl font-bold mb-6 flex items-center text-slate-800">
                                <div className="p-2 bg-slate-100 rounded-lg mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                Sản phẩm đã đặt
                            </h2>
                            <div className="space-y-6">
                                {orderDetail?.items.map((item) => (
                                    <div key={item.id} className="flex gap-6 p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-300 border border-slate-200">
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}/${item.image}`}
                                            alt={item.product_name}
                                            className="w-32 h-32 object-cover rounded-xl shadow-md"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-800 mb-3">{item.product_name}</h3>
                                            <div className="flex flex-wrap gap-3 mb-4">
                                                {Object.entries(item.variation).map(([key, value]) => (
                                                    <span key={key} className="px-3 py-1 rounded-full text-sm font-medium bg-white text-slate-700 border border-slate-200 shadow-sm">
                                                        {key}: {value}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xl font-bold text-slate-800">
                                                    {formatPrice(item.product_price)}
                                                </span>
                                                <span className="px-4 py-1.5 bg-white text-slate-700 rounded-full text-sm font-medium border border-slate-200 shadow-sm">
                                                    x{item.quantity}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tổng kết đơn hàng */}
                        <div className="p-8 bg-slate-50">
                            <div className="max-w-sm ml-auto space-y-4">
                                <div className="flex justify-between items-center text-slate-600">
                                    <span className="font-medium">Tạm tính</span>
                                    <span className="text-lg">{formatPrice(orderDetail?.total_amount)}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600">
                                    <span className="font-medium">Phí vận chuyển</span>
                                    <span className="text-lg">{formatPrice(orderDetail?.shipping)}</span>
                                </div>
                                <div className="border-t-2 border-slate-200 pt-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-slate-800">Tổng cộng</span>
                                        <span className="text-2xl font-bold text-slate-800">
                                            {formatPrice(orderDetail?.final_amount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lịch sử đơn hàng */}
                        {orderDetail?.histories && orderDetail.histories.length > 0 && (
                            <div className="p-8 border-t border-slate-200">
                                <h3 className="text-xl font-bold mb-6 flex items-center text-slate-800">
                                    <div className="p-2 bg-slate-100 rounded-lg mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    Lịch sử đơn hàng
                                </h3>
                                <div className="space-y-6">
                                    {orderDetail.histories.map((history) => (
                                        <div key={history.id} className="flex items-center gap-4">
                                            <div className="w-3 h-3 rounded-full bg-slate-400 shadow-md"></div>
                                            <div className="flex-1">
                                                <p className="text-slate-800 font-medium">{history.status}</p>
                                                <p className="text-sm text-slate-500">{history.created_at}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal hủy đơn hàng */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold mb-4">Hủy đơn hàng</h2>
                        <form onSubmit={handleCancelOrder}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Lý do hủy đơn hàng
                                </label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                    placeholder="Vui lòng cho biết lý do hủy đơn hàng..."
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCancelModal(false);
                                        setCancelReason('');
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="submit"
                                    disabled={cancelOrderMutation.isPending}
                                    className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200
                                        ${cancelOrderMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {cancelOrderMutation.isPending ? 'Đang xử lý...' : 'Xác nhận hủy'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal yêu cầu hoàn tiền */}
            {showRefundModal && (
                <div className="fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">Yêu cầu hoàn tiền</h2>
                        <form onSubmit={handleRefundSubmit} className="space-y-4">
                            {/* Form nhập lý do hoàn tiền */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Lý do hoàn tiền
                                </label>
                                <textarea
                                    value={refundData.reason}
                                    onChange={(e) => setRefundData(prev => ({ ...prev, reason: e.target.value }))}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    rows="3"
                                    placeholder="Nhập lý do hoàn tiền"
                                />
                            </div>

                            {/* Form nhập thông tin ngân hàng */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Thông tin ngân hàng
                                </label>
                                <input
                                    type="text"
                                    value={refundData.bank_name}
                                    onChange={(e) => setRefundData(prev => ({ ...prev, bank_name: e.target.value }))}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 mb-2"
                                    placeholder="Tên ngân hàng"
                                />
                                <input
                                    type="text"
                                    value={refundData.bank_account_name}
                                    onChange={(e) => setRefundData(prev => ({ ...prev, bank_account_name: e.target.value }))}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 mb-2"
                                    placeholder="Tên chủ tài khoản"
                                />
                                <input
                                    type="text"
                                    value={refundData.bank_account_number}
                                    onChange={(e) => setRefundData(prev => ({ ...prev, bank_account_number: e.target.value }))}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Số tài khoản"
                                />
                            </div>

                            {/* Form upload ảnh */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Hình ảnh chứng minh
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full"
                                />
                                {refundData.images.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {refundData.images.map((image, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setRefundData(prev => ({
                                                        ...prev,
                                                        images: prev.images.filter((_, i) => i !== index)
                                                    }))}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Nút hủy và gửi yêu cầu */}
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowRefundModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={requestRefundMutation.isPending}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {requestRefundMutation.isPending ? 'Đang xử lý...' : 'Gửi yêu cầu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal xác nhận hoàn thành đơn hàng */}
            {showCompleteModal && (
                <div className="fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Xác nhận hoàn thành đơn hàng</h2>
                        <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn xác nhận đã nhận được đơn hàng và hài lòng với sản phẩm?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowCompleteModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleCompleteOrder}
                                disabled={completeOrderMutation.isPending}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {completeOrderMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal chi tiết hoàn tiền */}
            {showRefundDetailModal && orderDetail?.refund_request && (
                <div className="fixed inset-0 bg-[#00000080] bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-6">Chi tiết yêu cầu hoàn tiền</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Thông tin bên trái */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                    <div className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                                        orderDetail.refund_request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        orderDetail.refund_request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        orderDetail.refund_request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                        {orderDetail.refund_request.status === 'pending' ? 'Đang chờ xử lý' :
                                         orderDetail.refund_request.status === 'approved' ? 'Đã được chấp nhận' :
                                         orderDetail.refund_request.status === 'rejected' ? 'Đã bị từ chối' :
                                         'Đã hoàn tiền'}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại hoàn tiền</label>
                                    <p className="text-gray-600">
                                        {orderDetail.refund_request.type === 'return_after_received' ? 
                                        'Hoàn tiền sau khi nhận hàng' : 'Hoàn tiền trước khi nhận hàng'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền hoàn</label>
                                    <p className="text-gray-600">{formatPrice(orderDetail.refund_request.amount)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lý do hoàn tiền</label>
                                    <p className="text-gray-600">{orderDetail.refund_request.reason}</p>
                                </div>
                                {orderDetail.refund_request.reject_reason && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Lý do từ chối</label>
                                        <p className="text-gray-600">{orderDetail.refund_request.reject_reason}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Thông tin ngân hàng</label>
                                    <div className="text-gray-600 space-y-1">
                                        <p>Ngân hàng: {orderDetail.refund_request.bank_name}</p>
                                        <p>Chủ tài khoản: {orderDetail.refund_request.bank_account_name}</p>
                                        <p>Số tài khoản: {orderDetail.refund_request.bank_account_number}</p>
                                    </div>
                                </div>
                                {orderDetail.refund_request.approved_at && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian phê duyệt</label>
                                        <p className="text-gray-600">{orderDetail.refund_request.approved_at}</p>
                                    </div>
                                )}
                                {orderDetail.refund_request.refunded_at && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian hoàn tiền</label>
                                        <p className="text-gray-600">{orderDetail.refund_request.refunded_at}</p>
                                    </div>
                                )}
                            </div>

                            {/* Hình ảnh bên phải */}
                            <div className="space-y-6">
                                {orderDetail.refund_request.images && orderDetail.refund_request.images.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Hình ảnh đính kèm</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {orderDetail.refund_request.images.map((image, index) => (
                                                <div key={index} className="aspect-w-4 aspect-h-3">
                                                    <img
                                                        src={`${import.meta.env.VITE_API_URL}/${image}`}
                                                        alt={`Hình ảnh ${index + 1}`}
                                                        className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer shadow-md"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {orderDetail.refund_request.proof_image_url && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Ảnh chứng minh hoàn tiền</label>
                                        <div className="aspect-w-16 aspect-h-9">
                                            <img
                                                src={orderDetail.refund_request.proof_image_url}
                                                alt="Ảnh chứng minh hoàn tiền"
                                                className="w-full h-full object-contain rounded-lg hover:scale-105 transition-transform cursor-pointer shadow-md"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => setShowRefundDetailModal(false)}
                                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderDetail;
