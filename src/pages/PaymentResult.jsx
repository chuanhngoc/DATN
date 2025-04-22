import { useLocation, useNavigate } from "react-router-dom";
import { paymentReusult } from "../services/order";
import { useQuery } from "@tanstack/react-query";

const PaymentResult = () => {
    const location = useLocation();
    const queryString = location.search.substring(1);
    const navigate = useNavigate();
    const { data: orderResult, isLoading } = useQuery({
        queryFn: async () => {
            return (await paymentReusult(queryString)).data;
        },
    });
    const SuccessIcon = () => (
        <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" stroke="#22C55E" strokeWidth="2"/>
            <path 
                d="M6.75 12.75L10.25 16.25L17.25 9.75" 
                stroke="#22C55E" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </svg>
    );

    const ErrorIcon = () => (
        <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" stroke="#EF4444" strokeWidth="2"/>
            <path 
                d="M8.75 8.75L15.25 15.25" 
                stroke="#EF4444" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
            <path 
                d="M15.25 8.75L8.75 15.25" 
                stroke="#EF4444" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </svg>
    );

    const LoadingIcon = () => (
        <svg className="w-24 h-24 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" stroke="#E5E7EB" strokeWidth="2"/>
            <path 
                d="M12 1C14.7689 1 17.4757 2.02784 19.5711 3.87741" 
                stroke="#3B82F6" 
                strokeWidth="2" 
                strokeLinecap="round"
            />
        </svg>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    {/* Icon */}
                    <div className="flex justify-center">
                        {isLoading ? (
                            <LoadingIcon />
                        ) : orderResult?.success ? (
                            <SuccessIcon />
                        ) : (
                            <ErrorIcon />
                        )}
                    </div>

                    {/* Status Text */}
                    <div className="text-center space-y-3">
                        <h1 className={`text-2xl font-bold ${
                            isLoading ? 'text-gray-700' :
                            orderResult?.success ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {isLoading
                                ? "Đang xử lý thanh toán"
                                : orderResult?.success
                                    ? "Thanh toán thành công!"
                                    : "Thanh toán thất bại!"}
                        </h1>
                        <p className="text-gray-600">
                            {isLoading
                                ? "Vui lòng không tắt trình duyệt trong quá trình xử lý..."
                                : orderResult?.success
                                    ? "Cảm ơn bạn đã mua hàng! Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất."
                                    : "Rất tiếc, thanh toán không thành công. Vui lòng thử lại hoặc liên hệ với chúng tôi để được hỗ trợ."}
                        </p>
                    </div>


                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            onClick={() => navigate("/")}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Về trang chủ
                        </button>
                        {!isLoading && orderResult?.success && (
                            <button
                                onClick={() => navigate("/orders")}
                                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                            >
                                Xem đơn hàng
                            </button>
                        )}
                    </div>
                </div>

                {/* Support Section */}
                {!isLoading && !orderResult?.success && (
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Cần hỗ trợ? {' '}
                            <a href="tel:1900xxxx" className="text-blue-600 hover:underline font-medium">
                                Liên hệ 1900xxxx
                            </a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentResult;
