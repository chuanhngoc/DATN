

export function CancelRefundStats({ data }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Đơn hủy</p>
                    <p className="text-2xl font-bold">{data.total_cancelled}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(data.cancelled_amount)}</p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Đơn hoàn tiền</p>
                    <p className="text-2xl font-bold">{data.total_refunded}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(data.refunded_amount)}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Tỷ lệ hủy đơn</span>
                        <span className="text-sm font-medium">{data.cancel_rate.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${Math.min((data.cancel_rate / 15) * 100, 100)}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                        {data.cancel_rate < 5
                            ? "Tỷ lệ hủy đơn thấp, hiệu suất tốt"
                            : data.cancel_rate < 10
                                ? "Tỷ lệ hủy đơn trung bình"
                                : "Tỷ lệ hủy đơn cao, cần cải thiện"}
                    </p>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Tỷ lệ hoàn tiền</span>
                        <span className="text-sm font-medium">{data.refund_rate.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${Math.min((data.refund_rate / 10) * 100, 100)}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                        {data.refund_rate < 3
                            ? "Tỷ lệ hoàn tiền thấp, chất lượng sản phẩm tốt"
                            : data.refund_rate < 7
                                ? "Tỷ lệ hoàn tiền trung bình"
                                : "Tỷ lệ hoàn tiền cao, cần kiểm tra chất lượng sản phẩm"}
                    </p>
                </div>
            </div>
        </div>
    )
}
