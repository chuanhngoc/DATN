/**
 * Component Login - Trang đăng nhập
 * @returns {JSX.Element} - Giao diện trang đăng nhập với nút đăng nhập
 */
const Login = () => {
  /**
   * Xử lý sự kiện đăng nhập
   * Lưu token vào localStorage và chuyển hướng về trang admin
   */
  const handleLogin = () => {
    // Lưu token giả vào localStorage để mô phỏng đăng nhập thành công
    localStorage.setItem('token', 'dummy-token');
    // Chuyển hướng về trang admin
    window.location.href = '/admin';
  };

  return (
    <div>
      <h2>Login Page</h2>
      {/* Nút đăng nhập - khi click sẽ gọi hàm handleLogin */}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login; 