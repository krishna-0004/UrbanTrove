import React from 'react';
import ImageSlider from '../components/ImageSlider.jsx';
import FeaturedCategories from '../components/FeaturedCategories.jsx';
import BestSellers from '../components/BestSellers.jsx';
import NewArrivals from '../components/NewArrivals.jsx';

const Home = () => {
  return (
    <>
        <ImageSlider />
        <FeaturedCategories />
        <BestSellers />
        <NewArrivals />
    </>
  );
};

export default Home;