import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, User, ShoppingBag, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import reviewsService from '../services/reviews';
import { useParams } from 'react-router-dom';

const ReviewProductDetail = () => {
    const [page, setPage] = useState(1);
    const { id } = useParams();

    const { data: mockData, isLoading } = useQuery({
        queryKey: ["product-review-detail", id, page],
        queryFn: async () => {
            return await reviewsService.getReviewProductDetail(id, page);
        },
    });

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <Star
                key={index}
                className={`h-4 w-4 transition-colors duration-200 ${index < rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300'
                    }`}
            />
        ));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải đánh giá...</p>
                </div>
            </div>
        );
    }

    if (!mockData || mockData.stats.total === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
                <div className="bg-white rounded-3xl shadow-lg p-12 max-w-md">
                    <div className="mb-6">
                        <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Chưa có đánh giá nào</h2>
                    <p className="text-gray-600 mb-6">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors duration-200">
                        Viết đánh giá
                    </button>
                </div>
            </div>
        );
    }

    const { stats, reviews, pagination } = mockData;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Đánh giá sản phẩm</h1>
                    <p className="text-gray-600">Xem ý kiến của khách hàng về sản phẩm này</p>
                </div>

                {/* Statistics Section */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Overall Rating */}
                        <div className="text-center lg:text-left">
                            <div className="flex flex-col lg:flex-row items-center lg:items-start">
                                <div className="mb-4 lg:mb-0 lg:mr-6">
                                    <div className="text-6xl font-bold text-gray-900 mb-2">
                                        {stats.average_rating || 'N/A'}
                                    </div>
                                    <div className="flex justify-center lg:justify-start mb-2">
                                        {renderStars(Math.round(stats.average_rating || 0))}
                                    </div>
                                    <p className="text-gray-600 font-medium">
                                        {stats.total} đánh giá
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Rating Breakdown */}
                        <div className="space-y-4">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const count = stats.rating_counts[rating] || 0;
                                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

                                return (
                                    <div key={rating} className="flex items-center">
                                        <div className="flex items-center w-16">
                                            <span className="text-sm font-medium text-gray-700 mr-1">{rating}</span>
                                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                        </div>
                                        <div className="flex-1 mx-4">
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700 ease-out"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 w-8 text-right">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300"
                        >
                            {/* Review Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="relative">
                                        {review.user.avatar ? (
                                            <img
                                                src={review.user.avatar}
                                                alt={review.user.name}
                                                className="h-12 w-12 rounded-full ring-2 ring-blue-100 object-cover"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded-full ring-2 ring-blue-100 bg-gray-100 flex items-center justify-center">
                                                <User className="h-6 w-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">{review.user.name}</h3>
                                        <p className="text-sm text-gray-500">{review.user.email}</p>
                                        <div className="flex items-center mt-1 space-x-3">
                                            <div className="flex">
                                                {renderStars(review.rating)}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {formatDate(review.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Purchase Info */}
                                {review.order_item && (
                                    <div className="flex items-center bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm">
                                        <ShoppingBag className="h-4 w-4 mr-2" />
                                        Đã mua {review.order_item.quantity} sản phẩm
                                    </div>
                                )}
                            </div>

                            {/* Review Content */}
                            {review.content && (
                                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                    <p className="text-gray-700 leading-relaxed">{review.content}</p>
                                </div>
                            )}

                            {/* Review Images */}
                            {review.images && review.images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                                    {review.images.map((image, index) => (
                                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                                            <img
                                                src={`http://127.0.0.1:8000/${image}`}

                                                alt={`Review image ${index + 1}`}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Variation Info */}
                            {review.order_item && review.order_item.variation && (
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(review.order_item.variation).map(([key, value]) => (
                                        <span key={key} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
                                            <span className="font-medium">{key}:</span>
                                            <span className="ml-1">{value}</span>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="mt-12 flex justify-center">
                        <nav className="flex items-center space-x-2">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="flex items-center px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                            >
                                <ChevronLeft className="h-5 w-5 mr-1" />
                                Trước
                            </button>

                            <div className="flex items-center space-x-1">
                                {[...Array(Math.min(5, pagination.last_page))].map((_, index) => {
                                    let pageNum;
                                    if (pagination.last_page <= 5) {
                                        pageNum = index + 1;
                                    } else {
                                        if (page <= 3) {
                                            pageNum = index + 1;
                                        } else if (page >= pagination.last_page - 2) {
                                            pageNum = pagination.last_page - 4 + index;
                                        } else {
                                            pageNum = page - 2 + index;
                                        }
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${page === pageNum
                                                    ? 'bg-blue-500 text-white shadow-lg'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setPage(Math.min(pagination.last_page, page + 1))}
                                disabled={page === pagination.last_page}
                                className="flex items-center px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                            >
                                Sau
                                <ChevronRight className="h-5 w-5 ml-1" />
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewProductDetail;