// Componente Funcion en react con un Card en MUI
import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { ProductosCollection } from "/imports/collection/collections";
import Carousel from "../carousel/Carousel";
import { Paper } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import CardProducto from "./CardProducto";
import { useParams } from "react-router-dom";

const useStyles = makeStyles()((theme) => ({
  papper: {
    margin: 10,
  },
}));
function CarouselByTiendas(props) {
  let { tiendaId } = useParams();
  const idTienda = props.tiendaId || tiendaId;
  
  const { classes } = useStyles();
  const item = (product) => {
    return <CardProducto product={product} />;
  };

  const productos = useTracker(() => {
    // Meteor.subscribe("users");

    Meteor.subscribe("productos", idTienda ? { idTienda: idTienda } : {});
    return ProductosCollection.find(idTienda ? { idTienda: idTienda } : {}).map(
      (producto) => item(producto)
    );
  });

  return <Carousel items={productos} />;
}

export default CarouselByTiendas;
