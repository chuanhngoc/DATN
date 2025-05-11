import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import ClientLayout from './layouts/ClientLayout';
import Home from './pages/Home';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import AddCategory from './pages/admin/categories/AddCategory';
import EditCategory from './pages/admin/categories/EditCategory';
import Users from './pages/admin/Users';
import AddUser from './pages/admin/users/AddUser';
import Color from './pages/admin/Color';
import AddColor from './pages/admin/colors/AddColor';
import EditColor from './pages/admin/colors/EditColor';
import Size from './pages/admin/Size';
import AddSize from './pages/admin/sizes/AddSize';
import EditSize from './pages/admin/sizes/EditSize';
import EditUser from './pages/admin/users/EditUser';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProduct from './pages/admin/products/AddProduct';
import EditProduct from './pages/admin/products/EditProduct';
import ProductImage from './pages/admin/products/ProductImage';
import ProductVariant from './pages/admin/products/ProductVariant';
import { ProductDetail } from './pages/ProductDetail';
import CartPage from './pages/Cart';
import ThanksPage from './pages/Thanks';
import CheckoutPage from './pages/Checkout';
import OrderPage from './pages/Order';
import PaymentResult from './pages/PaymentResult';
import OrderDetail from './pages/OrderDetail';
import Orders from './pages/admin/Orders';
import OrderDetailAdmin from './pages/admin/orders/detail';
import ProductAll from './pages/Products';
import CategoriesProduct from './pages/CategoryProduct';
import Profile from './pages/Profile';
import Coupons from './pages/admin/cuopons';
import CouponForm from './pages/admin/cuopons/Form';
const router = createBrowserRouter([
  {
    // Route cho phần client (public)
    path: '/',
    element: <ClientLayout />,
    children: [
      {
        // Trang chủ
        index: true,
        element: <Home />
      },
      {
        // Trang giới thiệu
        path: 'about',
        element: <About />
      },
      {
        // Trang đăng nhập
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'product/detail/:id',
        element: <ProductDetail />
      },
      {
        path: 'products',
        element: <ProductAll />
      },
      {
        path: 'categories/:id/products',
        element: <CategoriesProduct />
      },
      {
        path: 'cart',
        element: <CartPage />
      },
      {
        path: 'checkout',
        element: <CheckoutPage />
      },
      {
        path: 'checkout/thanks',
        element: <ThanksPage />
      },
      {
        path: 'orders',
        element: <OrderPage />
      },
      {
        path: 'orders/:id',
        element: <OrderDetail />
      },
      {
        path: 'thanks',
        element: <PaymentResult />
      },
      {
        path: 'profile',
        element: <Profile />
      },
    ]
  },
  {
    // Route cho phần admin (protected)
    path: '/admin',
    // Sử dụng PrivateRoute để bảo vệ các route admin
    element: <PrivateRoute />,
    children: [
      {
        // Layout cho admin
        element: <AdminLayout />,
        children: [
          {
            // Trang dashboard của admin
            index: true,
            element: <AdminDashboard />
          },
          {
            // Trang dashboard của admin
            path: 'products',
            element: <Products />
          },
          {
            // Trang quản lý sản phẩm
            path: 'products/add',
            element: <AddProduct />
          },
          {
            // Trang quản lý sản phẩm
            path: 'products/edit/:id',
            element: <EditProduct />
          },
          {
            // Trang quản lý sản phẩm
            path: 'product/image/:id',
            element: <ProductImage />
          }, {
            // Trang quản lý sản phẩm
            path: 'product/variant/:id',
            element: <ProductVariant />
          },
          {
            path: 'categories',
            element: <Categories />
          },
          {
            path: 'categories/add',
            element: <AddCategory />
          },
          {
            path: 'categories/:id/edit',
            element: <EditCategory />
          },
          {
            // Trang quản lý người dùng
            path: 'users',
            element: <Users />
          },
          {
            path: 'users/add',
            element: <AddUser />
          },

          {
            // Trang quản lý màu
            path: 'colors',
            element: <Color />
          },
          {
            path: 'colors/add',
            element: <AddColor />
          },
          {
            path: 'colors/edit/:id',
            element: <EditColor />
          },
          {
            // Trang quản lý size
            path: 'sizes',
            element: <Size />
          },
          {
            path: 'sizes/add',
            element: <AddSize />
          },
          {
            path: 'sizes/edit/:id',
            element: <EditSize />
          },
          {
            path: 'users/edit/:id',
            element: <EditUser />
          },
          {
            path: 'orders',
            element: <Orders />
          },
          {
            path: 'orders/:id',
            element: <OrderDetailAdmin />
          },
           {
            path: 'coupons',
            element: <Coupons />
          },
          {
            path: 'coupons/add',
            element: <CouponForm isEdit={false} />
          },
          {
            path: 'coupons/edit/:id',
            element: <CouponForm isEdit={true} />
          },
            {
            path: 'reviews',
            element: <Reviews />
          },
        ]
      },

    ]
  }
]);

export default router;