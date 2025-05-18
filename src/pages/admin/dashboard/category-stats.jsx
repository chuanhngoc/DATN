export const CategoryStats = ({ data }) => {
    return (
        <div className="space-y-4">
            {data?.map((category) => (
                <div key={category?.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                        <p className="font-medium text-gray-900">{category?.name}</p>
                        <p className="text-sm text-gray-500">Sản phẩm: {category?.products_count || 0}</p>
                    </div>
                    <p className="font-bold text-blue-600">{category?.total_sold || 0} đã bán</p>
                </div>
            ))}
        </div>
    );
};
