export const CancelRefundStats = ({ data }) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
    }

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                    <p className="text-2xl font-bold text-gray-900">{data?.total_orders || 0}</p>
                </div>
                <div className="space-y-2 p-3 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-sm font-medium text-red-700">Đã hủy</p>
                    <p className="text-2xl font-bold text-red-600">{data?.total_cancelled || 0}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <p className="text-sm font-medium mb-2 text-gray-700">Thống kê hoàn tiền</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-sm font-medium text-blue-700">Số lượng</p>
                            <p className="text-xl font-bold text-blue-600">{data?.total_refunded || 0}</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                            <p className="text-sm font-medium text-purple-700">Tổng tiền</p>
                            <p className="text-xl font-bold text-purple-600">
                                {formatCurrency(data?.refunded_amount || 0)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <p className="text-sm font-medium mb-2 text-gray-700">Tỷ lệ hủy đơn</p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full"
                            style={{ width: `${data?.cancel_rate || 0}%` }}
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
    )
}
