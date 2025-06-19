import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import "./imageslider.css";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import slider1 from "../assets/slider/slider1.jpeg";
import slider2 from "../assets/slider/slider2.png";
import slider3 from "../assets/slider/slider3.png";
import slider4 from "../assets/slider/slider4.png";
import slider5 from "../assets/slider/slider5.png";

const ImageSlider = () => {
    return (
        <div className="slider-container">
            <Swiper
                loop={true}
                autoplay={{ delay: 3000 }}
                pagination={{ clickable: true }}
                // navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
            >
                {[slider1, slider2, slider3, slider4, slider5].map((img, index) => (
                    <SwiperSlide key={index}>
                        <div className="slide-wrapper">
                            <img src={img} alt={`Slide ${index + 1}`} />
                        </div>
                    </SwiperSlide>

                ))}
            </Swiper>
        </div>
    );
};

export default ImageSlider;
