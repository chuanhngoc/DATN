import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProductById } from "../services/client/product"
import { addToCart } from "../services/client/cart"
import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react";
import { toast } from "react-toastify";
import { token_auth } from "../auth/getToken";
import ReviewProductDetail from "../components/ReviewProductDetail";

export const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    // State cho màu và size được chọn
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const queryClient = useQueryClient();
    
    // Kiểm tra đăng nhập
    const isAuthenticated = !!token_auth();
    
    const { data: product, isLoading } = useQuery({
        queryKey: ["product-detail", id],
        queryFn: async () => {
            return await getProductById(id)
        },
        onSuccess: (data) => {
            // Khi data load xong, set ảnh chính làm ảnh được chọn
            setSelectedImage(data.main_image);
        }
    });

    // Mutation để thêm vào giỏ hàng
    const addToCartMutation = useMutation({
        mutationFn: addToCart,
        onSuccess: () => {
            // Invalidate query giỏ hàng để cập nhật lại số lượng
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success('Đã thêm vào giỏ hàng');
        },
        onError: (error) => {
            if (error.message.includes('đăng nhập')) {
                navigate('/login');
            }
            toast.error(error.message);
        }
    });

    // Loading state
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-1/2 space-y-4">
                            <div className="bg-gray-200 rounded-lg aspect-square"></div>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-gray-200 rounded-lg w-20 h-20"></div>
                                ))}
                            </div>
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

    // Tạo mảng tất cả ảnh (ảnh chính + ảnh gallery)
    const allImages = [
        product?.main_image,
        ...(product?.images?.map(img => img.url) || [])
    ];

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

    // Xử lý thêm vào giỏ hàng
    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.warning('Vui lòng đăng nhập để thêm vào giỏ hàng');
            navigate('/login', { state: { from: `/product/detail/${id}` } });
            return;
        }

        const selectedVariation = getSelectedVariation();
        if (!selectedVariation) return;

        addToCartMutation.mutate({
            product_id: product.id,
            variation_id: selectedVariation.id,
            quantity: quantity
        });
    };

    // Xử lý thay đổi số lượng
    const handleQuantityChange = (value) => {
        const newQuantity = quantity + value;
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Phần ảnh sản phẩm */}
                <div className="w-full md:w-1/2 space-y-4">
                    {/* Ảnh chính */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                        <img
                            src={`http://127.0.0.1:8000/storage/${selectedImage || product?.main_image}`}
                            alt={product?.name}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Gallery ảnh */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {allImages.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(image)}
                                className={`flex-shrink-0 relative rounded-lg overflow-hidden w-20 h-20 border-2 transition-all
                                    ${selectedImage === image 
                                        ? 'border-blue-500 shadow-md' 
                                        : 'border-transparent hover:border-gray-300'}
                                `}
                            >
                                <img
                                    src={`http://127.0.0.1:8000/storage/${image}`}
                                    alt={`Product view ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
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

                        {/* Số lượng */}
                        <div className="pt-6 border-t">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Số lượng</h2>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border
                                        ${quantity <= 1 
                                            ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'border-gray-300 hover:border-gray-400 text-gray-600'}
                                    `}
                                >
                                    <span className="text-xl">-</span>
                                </button>
                                <span className="w-16 text-center text-lg font-medium">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 hover:border-gray-400 text-gray-600"
                                >
                                    <span className="text-xl">+</span>
                                </button>
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
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-lg text-gray-600">Tổng tiền:</span>
                                        <span className="text-2xl font-bold text-blue-600">
                                            {formatPrice(getSelectedVariation().sale_price * quantity)}
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

                        {/* Nút thêm vào giỏ */}
                        <button
                            onClick={handleAddToCart}
                            disabled={!getSelectedVariation() || addToCartMutation.isPending}
                            className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all
                                ${!getSelectedVariation() || addToCartMutation.isPending
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : isAuthenticated
                                        ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                                        : 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700'}
                            `}
                        >
                            {addToCartMutation.isPending ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                                    Đang thêm...
                                </div>
                            ) : !isAuthenticated 
                                ? 'Đăng nhập để mua hàng'
                                : !getSelectedVariation()
                                    ? 'Vui lòng chọn biến thể'
                                    : 'Thêm vào giỏ hàng'}
                        </button>
                    </div>
                </div>
            </div>

            <ReviewProductDetail/>
        </div>
    );
};