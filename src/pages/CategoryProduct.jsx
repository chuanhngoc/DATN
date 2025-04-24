import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { categoriesProducts } from "../services/client/categories";

const CategoriesProduct = () => {
    const { id } = useParams();

    const { data: categories, isLoading } = useQuery({
        queryKey: ['categoriesProduct', id],
        queryFn: () => categoriesProducts(id)
    });


    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Sản phẩm</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories?.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <Link to={'/product/detail/' + product.id}>
                            <div className="relative h-64">
                                <img
                                    src={`http://127.0.0.1:8000/storage/${product.main_image}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2 line-clamp-2">{product.name}</h2>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                                <div className="flex justify-between items-center">
                                    <div className="space-y-1">
                                        {product.variation_min_price && (
                                            <>
                                                <p className="text-lg font-bold text-red-600">
                                                    {Number(product.variation_min_price.sale_price).toLocaleString('vi-VN')}đ
                                                </p>
                                                <p className="text-sm text-gray-500 line-through">
                                                    {Number(product.variation_min_price.price).toLocaleString('vi-VN')}đ
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {product.category?.name || 'Không có danh mục'}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesProduct;