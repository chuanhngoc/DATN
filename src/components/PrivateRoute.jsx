import { Navigate, Outlet } from 'react-router-dom';


const PrivateRoute = () => {
  // Kiểm tra xem người dùng đã đăng nhập chưa bằng cách kiểm tra token trong localStorage
  // Có thể thay thế bằng logic xác thực thực tế (Redux, Context API, v.v.)
  const isAuthenticated = localStorage.getItem('token');

  // Nếu đã đăng nhập thì render children (Outlet), ngược lại chuyển hướng về trang login
  // return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
  return <Outlet/>
};

export default PrivateRoute; 