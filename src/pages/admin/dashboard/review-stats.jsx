export const ReviewStats = ({ data }) => {
    const positivePercentage = data?.positive_reviews && data?.total_reviews 
        ? Math.round((data.positive_reviews / data.total_reviews) * 100) 
        : 0;

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm font-medium text-gray-600">Tổng đánh giá</p>
                    <p className="text-2xl font-bold text-gray-900">{data?.total_reviews || 0}</p>
                </div>
                <div className="space-y-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <p className="text-sm font-medium text-amber-700">Đánh giá trung bình</p>
                    <p className="text-2xl font-bold text-amber-600">{(data?.average_rating || 0)}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <p className="text-sm font-medium mb-2 text-gray-700">Phân loại đánh giá</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                            <p className="text-sm font-medium text-green-700">Tích cực</p>
                            <p className="text-xl font-bold text-green-600">{data?.positive_reviews || 0}</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                            <p className="text-sm font-medium text-red-700">Tiêu cực</p>
                            <p className="text-xl font-bold text-red-600">{data?.negative_reviews || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <p className="text-sm font-medium mb-2 text-gray-700">Tỷ lệ đánh giá tích cực</p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                            style={{ width: `${positivePercentage}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
