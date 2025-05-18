
export function ReviewStats({ data }) {
    const neutralReviews = data.total_reviews - data.positive_reviews - data.negative_reviews

    const positivePercentage = (data.positive_reviews / data.total_reviews) * 100
    const neutralPercentage = (neutralReviews / data.total_reviews) * 100
    const negativePercentage = (data.negative_reviews / data.total_reviews) * 100

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-center flex-col">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-4xl font-bold">{data.average_rating.toFixed(1)}</span>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                className={`h-5 w-5 ${star <= Math.round(data.average_rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                    }`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        ))}
                    </div>
                </div>
                <p className="text-sm text-gray-500">Dựa trên {data.total_reviews} đánh giá</p>
            </div>

            <div className="space-y-3">
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="text-sm font-medium">Tích cực</span>
                        </div>
                        <span className="text-sm font-medium">{positivePercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${positivePercentage}%` }}></div>
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="text-sm font-medium">Trung lập</span>
                        </div>
                        <span className="text-sm font-medium">{neutralPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${neutralPercentage}%` }}></div>
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="text-sm font-medium">Tiêu cực</span>
                        </div>
                        <span className="text-sm font-medium">{negativePercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${negativePercentage}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
