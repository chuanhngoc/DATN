import { useQuery } from "@tanstack/react-query"
import { getProductById } from "../services/client/product"
import { useParams } from "react-router-dom"
import { useState } from "react";

export const ProductDetail = () => {
    const { id } = useParams();
    // State cho màu và size được chọn
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    
    const { data: product, isLoading } = useQuery({
        queryKey: ["product-detail", id],
        queryFn: async () => {
            return await getProductById(id)
        }
    });

    // Loading state
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-1/2">
                            <div className="bg-gray-200 rounded-lg h-96"></div>
                        </div>
                        <div className="w-full md:w-1/2">
                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Lấy các biến thể có sẵn
    const variations = product?.variations || [];

    // Lấy danh sách màu có sẵn dựa trên size đã chọn
    const getAvailableColors = () => {
        if (!selectedSize) {
            return Array.from(new Set(variations.map(v => v.color.id))).map(colorId => {
                return variations.find(v => v.color.id === colorId).color;
            });
        }
        return Array.from(new Set(
            variations
                .filter(v => v.size.id === selectedSize.id)
                .map(v => v.color.id)
        )).map(colorId => {
            return variations.find(v => v.color.id === colorId).color;
        });
    };

    // Lấy danh sách size có sẵn dựa trên màu đã chọn
    const getAvailableSizes = () => {
        if (!selectedColor) {
            return Array.from(new Set(variations.map(v => v.size.id))).map(sizeId => {
                return variations.find(v => v.size.id === sizeId).size;
            });
        }
        return Array.from(new Set(
            variations
                .filter(v => v.color.id === selectedColor.id)
                .map(v => v.size.id)
        )).map(sizeId => {
            return variations.find(v => v.size.id === sizeId).size;
        });
    };

    // Xử lý khi chọn màu
    const handleColorSelect = (color) => {
        if (selectedColor?.id === color.id) {
            // Nếu click vào màu đang chọn, bỏ chọn nó
            setSelectedColor(null);
        } else {
            setSelectedColor(color);
            // Kiểm tra nếu size hiện tại không có trong các size phù hợp với màu mới
            const availableSizes = variations
                .filter(v => v.color.id === color.id)
                .map(v => v.size.id);
            if (selectedSize && !availableSizes.includes(selectedSize.id)) {
                setSelectedSize(null);
            }
        }
    };

    // Xử lý khi chọn size
    const handleSizeSelect = (size) => {
        if (selectedSize?.id === size.id) {
            // Nếu click vào size đang chọn, bỏ chọn nó
            setSelectedSize(null);
        } else {
            setSelectedSize(size);
            // Kiểm tra nếu màu hiện tại không có trong các màu phù hợp với size mới
            const availableColors = variations
                .filter(v => v.size.id === size.id)
                .map(v => v.color.id);
            if (selectedColor && !availableColors.includes(selectedColor.id)) {
                setSelectedColor(null);
            }
        }
    };

    // Lấy biến thể được chọn
    const getSelectedVariation = () => {
        if (!selectedColor || !selectedSize) return null;
        return variations.find(
            v => v.color.id === selectedColor.id && v.size.id === selectedSize.id
        );
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Phần ảnh sản phẩm */}
                <div className="w-full md:w-1/2">
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                        <img
                            src={`http://127.0.0.1:8000/storage/${product?.main_image}`}
                            alt={product?.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Phần thông tin sản phẩm */}
                <div className="w-full md:w-1/2">
                    {/* Tên sản phẩm */}
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        {product?.name}
                    </h1>

                    {/* Trạng thái */}
                    <div className="mb-4">
                        <span className={`
                            inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                            ${product?.is_active 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-red-50 text-red-700 border border-red-200'}
                        `}>
                            {product?.is_active ? 'Còn hàng' : 'Hết hàng'}
                        </span>
                    </div>

                    {/* Mô tả */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Mô tả sản phẩm</h2>
                        <p className="text-gray-600">
                            {product?.description}
                        </p>
                    </div>

                    {/* Phần biến thể */}
                    <div className="space-y-6">
                        {/* Màu sắc */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-lg font-semibold text-gray-800">Màu sắc</h2>
                                {selectedColor && (
                                    <button 
                                        onClick={() => setSelectedColor(null)}
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        Bỏ chọn
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {getAvailableColors().map(color => (
                                    <button
                                        key={color.id}
                                        onClick={() => handleColorSelect(color)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
                                            ${selectedColor?.id === color.id 
                                                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                                : 'border-gray-200 hover:border-gray-300'}
                                        `}
                                    >
                                        {color.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Kích thước */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-lg font-semibold text-gray-800">Kích thước</h2>
                                {selectedSize && (
                                    <button 
                                        onClick={() => setSelectedSize(null)}
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        Bỏ chọn
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {getAvailableSizes().map(size => (
                                    <button
                                        key={size.id}
                                        onClick={() => handleSizeSelect(size)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
                                            ${selectedSize?.id === size.id 
                                                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                                : 'border-gray-200 hover:border-gray-300'}
                                        `}
                                    >
                                        {size.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Giá */}
                        <div className="pt-6 border-t">
                            {getSelectedVariation() ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg text-gray-600">Giá gốc:</span>
                                        <span className="text-lg font-semibold text-gray-900">
                                            {formatPrice(getSelectedVariation().price)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg text-gray-600">Giá khuyến mãi:</span>
                                        <span className="text-xl font-bold text-blue-600">
                                            {formatPrice(getSelectedVariation().sale_price)}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">
                                    {!selectedColor && !selectedSize 
                                        ? "Vui lòng chọn màu sắc và kích thước"
                                        : !selectedColor 
                                            ? "Vui lòng chọn màu sắc"
                                            : "Vui lòng chọn kích thước"}
                                </p>
                            )}
                        </div>

                        {/* Nút mua hàng */}
                        <button
                            disabled={!getSelectedVariation()}
                            className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all
                                ${getSelectedVariation()
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-gray-300 cursor-not-allowed'}
                            `}
                        >
                            {getSelectedVariation() ? 'Thêm vào giỏ hàng' : 'Vui lòng chọn biến thể'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};