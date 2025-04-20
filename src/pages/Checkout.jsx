import { useLocation, Navigate, data, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { profile } from '../services/client/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCheckoutData } from '../services/client/cart';
import { checkout } from '../services/client/checkout';

const CheckoutPage = () => {
    const location = useLocation();
    //lấy ra thằng state variant
    const selectedItems = location.state?.selectedItems;
    const [cartData, setCartData] = useState([]);
    const nav = useNavigate()
    const getCart = useMutation({
        mutationFn: async () => {
            const newData = selectedItems?.map((item) => {
                return item.cartItemId
            })
            const response = await getCheckoutData({
                ids: newData
            });
            return response;
        },
        onSuccess: (data) => {
            setCartData(data);
        },
    });

    const checkoutCart = useMutation({
        mutationFn: async (data) => {
            return await checkout(data);
        },
        onSuccess: (data) => {
            if (data?.payment_url) {
                window.open(data.payment_url)
            }
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const { data: userInfo, isLoading: isLoadingUser } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            return await profile()
        },
    });

    const [formData, setFormData] = useState({
        shipping_name: '',
        shipping_phone: '',
        shipping_email: '',
        shipping_address: '',
        payment_method: 'cod',
        note: ''
    });

    // Pre-fill form with user data when available
    useEffect(() => {
        if (userInfo) {
            setFormData(prev => ({
                ...prev,
                shipping_name: userInfo.name || '',
                shipping_phone: userInfo.phone || '',
                shipping_email: userInfo.email || '',
                shipping_address: userInfo.address || ''
            }));
        }

        if (selectedItems) {
            getCart.mutate();
        }
    }, [userInfo, selectedItems]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Format giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Tính tổng tiền hàng
    const calculateSubtotal = () => {
        if (!cartData?.items?.length) return 0;
        return cartData.items.reduce((total, item) => {
            return total + (parseFloat(item.variation.sale_price) * item.quantity);
        }, 0);
    };

    // Phí vận chuyển cố định
    const shippingFee = 30000;

    // Tính tổng cộng
    const calculateTotal = () => {
        return calculateSubtotal() + shippingFee;
    };

    // Redirect if no items were selected
    if (!selectedItems || selectedItems.length === 0) {
        return <Navigate to="/cart" replace />;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate form
        if (!formData.shipping_name || !formData.shipping_phone ||
            !formData.shipping_email || !formData.shipping_address) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            setIsSubmitting(false);
            return;
        }

        // Validate phone number
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(formData.shipping_phone)) {
            toast.error('Số điện thoại không hợp lệ');
            setIsSubmitting(false);
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.shipping_email)) {
            toast.error('Email không hợp lệ');
            setIsSubmitting(false);
            return;
        }

        try {
            // Prepare order data
            const orderData = {
                cart_item_ids: selectedItems.map(item => item.cartItemId),
                ...formData
            };

            // TODO: Call your API to create order
            console.log('Order Data:', orderData);

            // If payment method is VNPay, redirect to VNPay
            if (formData.payment_method === 'vnpay') {
                // TODO: Redirect to VNPay payment page
                checkoutCart.mutate(orderData)
                console.log('Redirect to VNPay');
            } else {
                // Show success message for COD
                nav('thanks')
            }
        } catch (error) {
            toast.error('Đã có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading spinner while fetching user data
    if (isLoadingUser || getCart.isPending) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Thanh toán</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form thanh toán */}
                <div className="space-y-6">
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-6">Thông tin giao hàng</h2>

                        {/* Họ tên */}
                        <div className="mb-4">
                            <label htmlFor="shipping_name" className="block text-sm font-medium text-gray-700 mb-1">
                                Họ tên người nhận *
                            </label>
                            <input
                                type="text"
                                id="shipping_name"
                                name="shipping_name"
                                value={formData.shipping_name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Nhập họ tên người nhận"
                                required
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div className="mb-4">
                            <label htmlFor="shipping_phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại *
                            </label>
                            <input
                                type="tel"
                                id="shipping_phone"
                                name="shipping_phone"
                                value={formData.shipping_phone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Nhập số điện thoại"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label htmlFor="shipping_email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                id="shipping_email"
                                name="shipping_email"
                                value={formData.shipping_email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Nhập email"
                                required
                            />
                        </div>

                        {/* Địa chỉ */}
                        <div className="mb-4">
                            <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-1">
                                Địa chỉ giao hàng *
                            </label>
                            <textarea
                                id="shipping_address"
                                name="shipping_address"
                                value={formData.shipping_address}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Nhập địa chỉ giao hàng"
                                required
                            />
                        </div>

                        {/* Ghi chú */}
                        <div className="mb-6">
                            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                                Ghi chú
                            </label>
                            <textarea
                                id="note"
                                name="note"
                                value={formData.note}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Nhập ghi chú cho đơn hàng (nếu có)"
                            />
                        </div>

                        {/* Phương thức thanh toán */}
                        <div className="mb-6">
                            <h3 className="text-base font-medium text-gray-900 mb-4">Phương thức thanh toán</h3>
                            <div className="space-y-3">
                                {/* COD */}
                                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-blue-500">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="cod"
                                        checked={formData.payment_method === 'cod'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <div className="ml-3">
                                        <span className="block text-sm font-medium text-gray-900">
                                            Thanh toán khi nhận hàng (COD)
                                        </span>
                                        <span className="block text-sm text-gray-500">
                                            Thanh toán bằng tiền mặt khi nhận hàng
                                        </span>
                                    </div>
                                </label>

                                {/* VNPay */}
                                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-blue-500">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="vnpay"
                                        checked={formData.payment_method === 'vnpay'}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <div className="ml-3">
                                        <span className="block text-sm font-medium text-gray-900">
                                            Thanh toán qua VNPay
                                        </span>
                                        <span className="block text-sm text-gray-500">
                                            Thanh toán online qua cổng VNPay
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 px-4 rounded-lg font-medium text-white
                                ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
                        </button>
                    </form>
                </div>

                {/* Order summary */}
                <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
                    <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>

                    {/* Danh sách sản phẩm */}
                    <div className="space-y-4 mb-6">
                        {cartData?.items?.map((item) => (
                            <div key={item.id} className="flex gap-4 py-4 border-b">
                                <img
                                    src={`http://127.0.0.1:8000/storage/${item.variation.product.main_image}`}
                                    alt={item.variation.product.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-800">
                                        {item.variation.product.name}
                                    </h3>
                                    <div className="text-sm text-gray-500 mt-1">
                                        <span>Màu: {item.variation.color.name}</span>
                                        <span className="mx-2">|</span>
                                        <span>Size: {item.variation.size.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-blue-600 font-medium">
                                            {formatPrice(item.variation.sale_price)}
                                        </span>
                                        <span className="text-gray-500">
                                            x{item.quantity}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tổng tiền */}
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Tạm tính:</span>
                            <span>{formatPrice(calculateSubtotal())}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Phí vận chuyển:</span>
                            <span>{formatPrice(shippingFee)}</span>
                        </div>
                        <div className="pt-4 border-t">
                            <div className="flex justify-between items-center text-lg font-semibold">
                                <span>Tổng cộng:</span>
                                <span className="text-blue-600">{formatPrice(calculateTotal())}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                (Đã bao gồm VAT nếu có)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage; 