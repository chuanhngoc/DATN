import HomeSlider from '../components/HomeSlider';

/**
 * Component Home - Trang chủ của website
 * @returns {JSX.Element} - Giao diện trang chủ với slider và các section khác
 */
const Home = () => {
  return (
    <div>
      {/* Slider */}
      <HomeSlider />

      {/* Các section khác có thể thêm vào sau */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Sản phẩm nổi bật</h2>
        {/* Thêm danh sách sản phẩm ở đây */}
      </div>
    </div>
  );
};

export default Home; 