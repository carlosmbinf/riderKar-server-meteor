import { Grid} from '@mui/material';
import { Image } from 'primereact/image';
import React from 'react';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  root: {
    width: '100%',
    height: 300,
    display: 'flex',
    overflow: 'hidden',
  },
  gearImage: {
    width: "200px",
    height: "200px",
    objectFit: 'cover',
    clipPath: 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)',
  },
}));

const GearImagesSequence = ({images}) => {
  const {classes} = useStyles();

  // const images = [
  //   '/istockphoto-1413050425-1024x1024.jpg',
  //   '/istockphoto-1444800538-1024x1024.jpg',
  //   '/istockphoto-1447172966-1024x1024.jpg',
  //   '/istockphoto-1413050425-1024x1024.jpg',
  //   '/istockphoto-1444800538-1024x1024.jpg',
  //   '/istockphoto-1447172966-1024x1024.jpg',
  //   '/istockphoto-1413050425-1024x1024.jpg',
  //   '/istockphoto-1444800538-1024x1024.jpg',
  //   '/istockphoto-1447172966-1024x1024.jpg',
  //   '/istockphoto-1413050425-1024x1024.jpg',
  //   '/istockphoto-1444800538-1024x1024.jpg',
  //   '/istockphoto-1447172966-1024x1024.jpg',
  //   '/istockphoto-1413050425-1024x1024.jpg',
  //   '/istockphoto-1444800538-1024x1024.jpg',
  //   '/istockphoto-1447172966-1024x1024.jpg',
  //   // Agrega más URLs de imágenes aquí
  // ];

  return <img src={images} alt="Gear" className={classes.gearImage} />;
};

export default GearImagesSequence;