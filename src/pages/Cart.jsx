import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, updateCartItem, removeFromCart } from "../services/client/cart";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const CartPage = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState([]);
    const SHIPPING_FEE = 30000; // Định nghĩa phí vận chuyển cố định

    // Query để lấy giỏ hàng
    const { data: cartData, isLoading } = useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            return await getCart()
        },
    });

    // Mutation để cập nhật số lượng
    const updateQuantityMutation = useMutation({
        mutationFn: updateCartItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success('Đã cập nhật số lượng');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    // Mutation để xóa sản phẩm
    const removeItemMutation = useMutation({
        mutationFn: removeFromCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    // Xử lý cập nhật số lượng
    const handleUpdateQuantity = (cartItemId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return;

        updateQuantityMutation.mutate({
            cart_item_id: cartItemId,
            quantity: newQuantity
        });
    };

    // Xử lý xóa sản phẩm
    const handleRemoveItem = (cartItemId) => {
        removeItemMutation.mutate({
            cart_item_id: cartItemId
        });
        // Remove from selected items if it was selected
        setSelectedItems(selectedItems.filter(item => item.cartItemId !== cartItemId));
    };

    // Format giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Handle item selection
    const handleItemSelect = (cartItem, isChecked) => {
        if (isChecked) {
            setSelectedItems([...selectedItems, {
                cartItemId: cartItem.id,
                variationId: cartItem.variation_id,
                quantity: cartItem.quantity
            }]);
        } else {
            setSelectedItems(selectedItems.filter(item => item.cartItemId !== cartItem.id));
        }
    };

    // Handle "Select All" functionality
    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            const allItems = cartData.items.map(item => ({
                cartItemId: item.id,
                variationId: item.variation_id,
                quantity: item.quantity
            }));
            setSelectedItems(allItems);
        } else {
            setSelectedItems([]);
        }
    };

    // Calculate subtotal (before shipping)
    const calculateSubtotal = () => {
        if (!cartData?.items?.length) return 0;
        return cartData.items.reduce((total, item) => {
            if (selectedItems.some(selected => selected.cartItemId === item.id)) {
                const price = item.variation.sale_price > 0 ? item.variation.sale_price : item.variation.price;
                return total + (parseFloat(price) * item.quantity);
            }
            return total;
        }, 0);
    };

    // Calculate total (including shipping)
    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        return subtotal + (selectedItems.length > 0 ? SHIPPING_FEE : 0);
    };

    // Proceed to checkout
    const handleProceedToCheckout = () => {
        if (selectedItems.length === 0) {
            toast.error('Vui lòng chọn ít nhất một sản phẩm');
            return;
        }
        //lưu id thằng variant
        navigate('/checkout', { state: { selectedItems } });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Check if cart is empty
    const isCartEmpty = !cartData?.items?.length;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Giỏ hàng của bạn</h1>

            {isCartEmpty ? (
                // Empty cart state
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4">
                        <svg className="w-full h-full text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-medium text-gray-900 mb-2">Giỏ hàng trống</h2>
                    <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Tiếp tục mua sắm
                    </Link>
                </div>
            ) : (
                // Cart items
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Danh sách sản phẩm */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Select All Checkbox */}
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.length === cartData.items.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-700">Chọn tất cả</span>
                            </label>
                        </div>

                        {cartData.items.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4">
                                {/* Checkbox */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.some(selected => selected.cartItemId === item.id)}
                                        onChange={(e) => handleItemSelect(item, e.target.checked)}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Ảnh sản phẩm */}
                                <Link to={`/product/detail/${item.variation.product.id}`} className="w-full sm:w-32 h-32">
                                    <img
                                        src={`http://127.0.0.1:8000/storage/${item.variation.product.main_image}`}
                                        alt={item.variation.product.name}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </Link>

                                {/* Thông tin sản phẩm */}
                                <div className="flex-1 flex flex-col">
                                    <div className="flex-1">
                                        <Link 
                                            to={`/product/detail/${item.variation.product.id}`}
                                            className="text-lg font-medium text-gray-800 hover:text-blue-600"
                                        >
                                            {item.variation.product.name}
                                        </Link>
                                        <div className="mt-1 text-sm text-gray-500">
                                            <span>Màu: {item.variation.color.name}</span>
                                            <span className="mx-2">|</span>
                                            <span>Size: {item.variation.size.name}</span>
                                        </div>
                                        <div className="mt-2 text-blue-600 font-medium">
                                            {item.variation.sale_price > 0 ? (
                                                <>
                                                    <span className="line-through text-gray-500 mr-2">
                                                        {formatPrice(item.variation.price)}
                                                    </span>
                                                    {formatPrice(item.variation.sale_price)}
                                                </>
                                            ) : (
                                                formatPrice(item.variation.price)
                                            )}
                                        </div>
                                    </div>

                                    {/* Số lượng và actions */}
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                                                disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                                                className={`w-8 h-8 rounded flex items-center justify-center border
                                                    ${item.quantity <= 1 
                                                        ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                                                        : 'border-gray-300 hover:border-gray-400 text-gray-600'}
                                                `}
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                                                disabled={updateQuantityMutation.isPending || item.quantity >= item.variation.stock_quantity}
                                                className={`w-8 h-8 rounded flex items-center justify-center border
                                                    ${item.quantity >= item.variation.stock_quantity
                                                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'border-gray-300 hover:border-gray-400 text-gray-600'}
                                                `}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            disabled={removeItemMutation.isPending}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tổng tiền và checkout */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Tổng đơn hàng</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
                                    <span>{formatPrice(calculateSubtotal())}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển</span>
                                    <span>{selectedItems.length > 0 ? formatPrice(SHIPPING_FEE) : '---'}</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between items-center text-lg font-semibold">
                                        <span>Tổng cộng</span>
                                        <span className="text-blue-600">{formatPrice(calculateTotal())}</span>
                                    </div>
                                    {selectedItems.length > 0 && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            (Đã bao gồm phí vận chuyển)
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleProceedToCheckout}
                                disabled={selectedItems.length === 0}
                                className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors
                                    ${selectedItems.length === 0
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                            >
                                Tiến hành thanh toán
                            </button>
                            <Link
                                to="/"
                                className="w-full mt-4 block text-center text-blue-600 hover:text-blue-700"
                            >
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;