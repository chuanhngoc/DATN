import Slider from 'react-slick';



const HomeSlider = () => {
  // Cấu hình cho slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false
        }
      }
    ]
  };

  // Dữ liệu slider (có thể lấy từ API)
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80',
      title: 'Giày Sneaker Mới',
      description: 'Khám phá bộ sưu tập giày sneaker mới nhất',
      buttonText: 'Mua ngay'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Giày Thể Thao',
      description: 'Thoải mái và phong cách cho mọi hoạt động',
      buttonText: 'Xem thêm'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      title: 'Giày Cao Cấp',
      description: 'Sang trọng và đẳng cấp trong từng bước đi',
      buttonText: 'Khám phá'
    }
  ];

  return (
    <div className="relative">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="relative">
            {/* Hình ảnh slider */}
            <div 
              className="h-[500px] bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              
              {/* Nội dung slider */}
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div className="text-white max-w-2xl px-8">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                  <p className="text-xl mb-8">{slide.description}</p>
                  <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition duration-300">
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Custom CSS cho slider */}
      <style jsx global>{`
        .slick-dots {
          bottom: 20px;
        }
        .slick-dots li button:before {
          color: white;
          font-size: 12px;
        }
        .slick-dots li.slick-active button:before {
          color: #ef4444;
        }
        .slick-prev, .slick-next {
          width: 40px;
          height: 40px;
        }
        .slick-prev:before, .slick-next:before {
          font-size: 40px;
          color: white;
        }
        .slick-prev {
          left: 50px;
        }
        .slick-next {
          right: 50px;
        }
      `}</style>
    </div>
  );
};

export default HomeSlider; 