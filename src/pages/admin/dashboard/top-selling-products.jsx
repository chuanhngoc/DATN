export const TopSellingProducts = ({ data }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="space-y-4">
      {data?.map((product, index) => (
        <div key={product?.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
            <div>
              <p className="font-medium text-gray-900">{product?.name}</p>
              <p className="text-sm text-gray-500">Đã bán: {product?.total_sold || 0}</p>
            </div>
          </div>
          <p className="font-bold text-blue-600">{formatCurrency(product?.total_revenue || 0)}</p>
        </div>
      ))}
    </div>
  );
};
  