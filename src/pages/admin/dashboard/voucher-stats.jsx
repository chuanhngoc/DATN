export const VoucherStats = ({ data }) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
    }

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm font-medium text-gray-600">Tổng số mã</p>
                    <p className="text-2xl font-bold text-gray-900">{data?.total_vouchers || 0}</p>
                </div>
                <div className="space-y-2 p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm font-medium text-green-700">Đã sử dụng</p>
                    <p className="text-2xl font-bold text-green-600">{data?.total_usage || 0}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <p className="text-sm font-medium mb-2 text-gray-700">Giảm giá trung bình</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-sm font-medium text-blue-700">Phần trăm</p>
                            <p className="text-xl font-bold text-blue-600">{(data?.avg_discount_percent || 0)}%</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                            <p className="text-sm font-medium text-purple-700">Số tiền</p>
                            <p className="text-xl font-bold text-purple-600">
                                {formatCurrency(data?.avg_discount_amount || 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
