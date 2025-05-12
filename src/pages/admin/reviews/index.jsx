import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, MessageSquare, EyeOff, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import reviewsService from '../../../services/reviews';

const ReviewDetailModal = ({ review, onClose, onReply, onBlock }) => {
    const [reply, setReply] = useState(review?.reply || '');
    const [hiddenReason, setHiddenReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReply = async (e) => {
        e.preventDefault();
        if (!reply.trim()) {
            toast.error('Vui lòng nhập nội dung phản hồi');
            return;
        }
        setIsSubmitting(true);
        try {
            await onReply(reply);
            onClose();
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra khi gửi phản hồi');
        }
        setIsSubmitting(false);
    };

    const handleBlock = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (review.is_active) {
                // Đang hiển thị, muốn ẩn => cần lý do
                if (!hiddenReason.trim()) {
                    toast.error('Vui lòng nhập lý do ẩn đánh giá');
                    setIsSubmitting(false);
                    return;
                }
                await onBlock({ is_active: false, hidden_reason: hiddenReason });
            } else {
                // Đang ẩn, muốn hiện lại => không cần lý do
                await onBlock({ is_active: true });
            }
            onClose();
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra khi thay đổi trạng thái');
        }
        setIsSubmitting(false);
    };

    if (!review) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 z-50">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">Chi tiết đánh giá</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col space-y-4">
                            <div>
                                <div className="text-sm font-medium text-gray-500">Sản phẩm</div>
                                <div className="mt-1 text-sm text-gray-900">
                                    {review.product?.name || 'Sản phẩm đã bị xóa'}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-gray-500">Đánh giá</div>
                                <div className="mt-1 flex items-center gap-1">
                                    {[...Array(5)].map((_, index) => (
                                        <span
                                            key={index}
                                            className={`text-xl ${
                                                index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                            }`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-gray-500">Nội dung</div>
                                <div className="mt-1 text-sm text-gray-900">{review.content}</div>
                            </div>

                            {review.images && review.images.length > 0 && (
                                <div>
                                    <div className="text-sm font-medium text-gray-500">Hình ảnh</div>
                                    <div className="mt-2 grid grid-cols-4 gap-2">
                                        {review.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={`http://127.0.0.1:8000/${image}`}
                                                alt={`Review ${index + 1}`}
                                                className="w-full h-24 object-cover rounded"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col space-y-4">
                            <div>
                                <div className="text-sm font-medium text-gray-500">Thời gian</div>
                                <div className="mt-1 text-sm text-gray-900">
                                    {new Date(review.created_at).toLocaleString('vi-VN')}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-gray-500">Trạng thái</div>
                                <div className="mt-1">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        review.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {review.is_active ? 'Đang hiển thị' : 'Đã ẩn'}
                                    </span>
                                </div>
                            </div>

                            {!review.is_active && review.hidden_reason && (
                                <div>
                                    <div className="text-sm font-medium text-gray-500">Lý do ẩn</div>
                                    <div className="mt-1 text-sm text-red-600">{review.hidden_reason}</div>
                                </div>
                            )}

                            {review.reply && (
                                <div>
                                    <div className="text-sm font-medium text-gray-500">Phản hồi</div>
                                    <div className="mt-1 text-sm text-gray-900">{review.reply}</div>
                                    <div className="mt-1 text-xs text-gray-500">
                                        {new Date(review.reply_at).toLocaleString('vi-VN')}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        {!review.reply && (
                            <form onSubmit={handleReply} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phản hồi đánh giá
                                    </label>
                                    <textarea
                                        value={reply}
                                        onChange={(e) => setReply(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                        placeholder="Nhập nội dung phản hồi..."
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Đang gửi...' : 'Gửi phản hồi'}
                                    </button>
                                </div>
                            </form>
                        )}
                        <form onSubmit={handleBlock} className="space-y-4">
                            {review.is_active ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Lý do ẩn đánh giá
                                        </label>
                                        <textarea
                                            value={hiddenReason}
                                            onChange={(e) => setHiddenReason(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows="3"
                                            placeholder="Nhập lý do ẩn đánh giá..."
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Đang xử lý...' : 'Ẩn đánh giá'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Đang xử lý...' : 'Hiện đánh giá'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Reviews = () => {
    const queryClient = useQueryClient();
    const [selectedReviewForView, setSelectedReviewForView] = useState(null);

    const { data: reviewsData, isLoading, error } = useQuery({
        queryKey: ['reviews'],
        queryFn: () => reviewsService.getAll()
    });

    const replyMutation = useMutation({
        mutationFn: ({ id, reply }) => reviewsService.reply(id, { reply }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
            toast.success('Phản hồi thành công');
        },
        onError: (error) => {
            toast.error(error.message || 'Phản hồi thất bại');
        }
    });

    const blockMutation = useMutation({
        mutationFn: ({ id, data }) => reviewsService.block(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
            toast.success(data.message);
        },
        onError: (error) => {
            toast.error(error.message || 'Thao tác thất bại');
        }
    });

    const handleReply = async (reply) => {
        await replyMutation.mutate({ id: selectedReviewForView.id, reply });
    };

    const handleBlock = async (data) => {
        await blockMutation.mutate({ id: selectedReviewForView.id, data });
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="text-red-500">Có lỗi xảy ra khi tải danh sách đánh giá</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý đánh giá</h1>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đánh giá</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nội dung</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {reviewsData?.data?.map((review) => (
                            <tr key={review.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {review.product?.name || 'Sản phẩm đã bị xóa'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, index) => (
                                            <span
                                                key={index}
                                                className={`text-xl ${
                                                    index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <div className="max-w-xs truncate">{review.content}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(review.created_at).toLocaleString('vi-VN')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        review.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {review.is_active ? 'Đang hiển thị' : 'Đã ẩn'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setSelectedReviewForView(review)}
                                            className="text-blue-600 hover:text-blue-900 transition-colors"
                                        >
                                            <Eye size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal xem chi tiết */}
            {selectedReviewForView && (
                <ReviewDetailModal
                    review={selectedReviewForView}
                    onClose={() => setSelectedReviewForView(null)}
                    onReply={handleReply}
                    onBlock={handleBlock}
                />
            )}
        </div>
    );
};

export default Reviews;
