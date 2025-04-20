const ThanksPage = () => {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="text-green-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Cảm ơn bạn đã đặt hàng! 🎉</h2>
          <p className="text-gray-600">
            Đơn hàng của bạn đã được ghi nhận và sẽ sớm được xử lý.
          </p>
          <p className="mt-4 text-sm text-gray-400">Chúc bạn một ngày tuyệt vời ❤️</p>
          <a
            href="/"
            className="mt-6 inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full transition"
          >
            Quay lại trang chủ
          </a>
        </div>
      </div>
    );
  };
  
  export default ThanksPage;
  