import React, { useState } from 'react';
import { IconButton, Dialog, Card, CardContent, Typography, Grid, useTheme, Chip, CardActions, Button, DialogTitle, Divider, CardHeader, DialogContent, DialogActions, CardActionArea } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';

import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { CarritoCollection } from '/imports/collection/collections';
import useMediaQuery from '@mui/material/useMediaQuery';

import CloseIcon from '@mui/icons-material/Close';

const ShoppingCart = () => {
  const [isOpen, setIsOpen] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  
  const confirmarPago = () => {
    {idTiendas.forEach((idTienda) => {
      const comprasEnCarrito = compras.filter(
        (compra) => compra.idTienda === idTienda
      );
          console.log(comprasEnCarrito);
          // comprasEnCarrito.map((compra) => {
          //  console.log(compra);
          // })
          Meteor.call("addVenta",Meteor.userId(),comprasEnCarrito,"",(error,idResult)=>console.log(`Venta agregada con id: ${idResult}`));
    })}
    handleClose()
  };

  const ProductoCard = ({_id, precio, nombre, cantidad }) => {
    const handleRemoveCarrito = () => CarritoCollection.remove(_id)
    return (
      <Card
      elevation={5}
        style={{
          marginTop: 20,
          marginBottom: 20,
          backgroundColor: theme.palette.background.default,
          padding: 20,
          paddingTop:0,
          borderRadius:15
          
        }}
      >
        <Grid
           container
           direction="row"
           justifyContent="space-between"
           alignItems="center"
        >
          <Grid item >
            <h3>{nombre}</h3>
          </Grid>
          <Grid item >
          <IconButton aria-label="close" onClick={handleRemoveCarrito}>
            <CloseIcon />
          </IconButton>
        </Grid>
        </Grid>

        

        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1" color="textSecondary">
                Precio: ${precio}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" color="textSecondary">
                Cantidad: {cantidad}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const userId = Meteor.userId();

  const { compras, idTiendas, precioTotal } = useTracker(() => {
    Meteor.subscribe("carrito", { idUser: userId });

    const compras = CarritoCollection.find({ idUser: userId }, { sort: { idTienda: 1 } }).fetch();
    let precioTotal = 0
    compras.forEach(
      (compra) => (precioTotal += compra.producto.precio * compra.cantidad)
    );
    const idTiendas = [...new Set(compras.map(compra => compra.idTienda))];

    return { compras, idTiendas, precioTotal };
  });
  

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Badge badgeContent={compras.length} color="error">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      <Dialog
        fullWidth={true}
        open={isOpen}
        onClose={handleClose}
        fullScreen={fullScreen}
      >
        <DialogTitle>
          Carrito de compras
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          style={{ backgroundColor: theme.palette.background.default }}
        >
          {idTiendas.map((idTienda) => {
            const comprasTienda = compras.filter(
              (compra) => compra.idTienda === idTienda
            );
            return (
              <Grid item xs={12} key={idTienda}>
                <Divider>
                  <Chip
                    variant='outlined'
                    label={`${comprasTienda[0].tienda.title}`}
                    color="secondary"
                  />
                </Divider>

                {comprasTienda.map((compra) => {
                  return (
                    <ProductoCard
                      key={compra._id}
                      _id={compra._id}
                      precio={compra.producto.precio}
                      nombre={compra.producto.name}
                      cantidad={compra.cantidad}
                    />
                  );
                })}
              </Grid>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid
              item
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              xs={12}
              style={{paddingBottom:20}}

            >
              <Chip color="info" label={`Total a pagar: ${precioTotal} CUP`} />
            </Grid>
            <Grid
              item
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              xs={12}
            >
              {/* <Button>Cerrar Carrito</Button> */}
              <Button disabled={idTiendas.length==0} onClick={confirmarPago} variant="contained">Confirmar</Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ShoppingCart;
