import React, { useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import Carousel from 'react-material-ui-carousel';
import { Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GearImagesSequence from './ElementCarousel';

const images = [
  '/istockphoto-1413050425-1024x1024.jpg',
  // '/istockphoto-1444800538-1024x1024.jpg',
  // '/istockphoto-1447172966-1024x1024.jpg',
  // '/istockphoto-1413050425-1024x1024.jpg',
  // '/istockphoto-1444800538-1024x1024.jpg',
  // '/istockphoto-1447172966-1024x1024.jpg',
  // '/istockphoto-1413050425-1024x1024.jpg',
  // '/istockphoto-1444800538-1024x1024.jpg',
  // '/istockphoto-1447172966-1024x1024.jpg',
  // '/istockphoto-1413050425-1024x1024.jpg',
  // '/istockphoto-1444800538-1024x1024.jpg',
  // '/istockphoto-1447172966-1024x1024.jpg',
  // '/istockphoto-1413050425-1024x1024.jpg',
  // '/istockphoto-1444800538-1024x1024.jpg',
  // '/istockphoto-1447172966-1024x1024.jpg',
  // Agrega más URLs de imágenes aquí
];

const useStyles = makeStyles()((theme) => ({
  root: {
    width: '100%',
    height: 300,
    display: 'flex',
    overflow: 'hidden',
  },
  carouselItem: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    color: '#fff',
    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)',
  },
  productName: {
    fontWeight: 'bold',
  },
  button: {
    marginTop: theme.spacing(1),
  },
  gearImage: {
    width: "200px",
    height: "200px",
    objectFit: 'cover',
    clipPath: 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)',
  },
}));

const RandomProductImages = () => {
  const {classes} = useStyles();
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/tiendas/AAMHTbjHxuZzzMn5y/products');
  };

  const handleSlideChange = (index) => {
    setActiveIndex(index);
  };

  return (
    // <div className={classes.root}>
      <Carousel
        index={activeIndex}
        onChange={handleSlideChange}
        autoPlay={true}
        animation="slide"
      >
            {images.map((image, index) => (
              <GearImagesSequence images={image}/>
            // <img
            //   key={index}
            //   src={image}
            //   alt="Gear"
            //   className={classes.gearImage}
            // />
        ))}
      </Carousel>
            // <GearImagesSequence/>

    // </div>
  );
};

export default RandomProductImages;
