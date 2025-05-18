export function VoucherStats({ data }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                    <svg
                        className="h-8 w-8 mb-2 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                        <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                    <span className="text-2xl font-bold">{data.total_vouchers}</span>
                    <span className="text-sm text-gray-500">Mã giảm giá</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                    <svg
                        className="h-8 w-8 mb-2 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                    <span className="text-2xl font-bold">{data.total_usage}</span>
                    <span className="text-sm text-gray-500">Lượt sử dụng</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Giảm giá trung bình (%):</span>
                    <span className="font-bold">{data.avg_discount_percent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Giảm giá trung bình (VNĐ):</span>
                    <span className="font-bold">{formatCurrency(data.avg_discount_amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Lượt sử dụng/mã:</span>
                    <span className="font-bold">{(data.total_usage / data.total_vouchers).toFixed(1)}</span>
                </div>
            </div>
        </div>
    )
}
