import React, { useState, useEffect } from 'react';
import { IconButton, Dialog, Card, CardContent, Typography, Grid, useTheme, Chip, CardActions, Button, DialogTitle, Divider, CardHeader, DialogContent, DialogActions, CardActionArea, Stepper, Step, StepButton, Box, StepLabel } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';

import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { CarritoCollection } from '/imports/collection/collections';
import useMediaQuery from '@mui/material/useMediaQuery';

import CloseIcon from '@mui/icons-material/Close';
import Mapa from '../Maps/Maps';


const steps = ["Confirmar Pedidos", "Pagar", "Registro"];

const ShoppingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitud = position.coords.latitude;
        const longitud = position.coords.longitude;
        console.log('Ubicación del cliente:', latitud, longitud);
        
        let cordenadas = {"latitude":latitud,"longitude":longitud}
        Meteor.call('updateUbicacion', cordenadas, function(error, success) { 
          if (error) { 
            console.log('error', error); 
          } 
          if (success) { 
             console.log("Actualizado correctamente");
          } 
        });
      }, (error) => {
        console.error('Error al obtener la ubicación del cliente:', error);
      });
    } else {
      console.error('Geolocalización no es compatible en este navegador.');
    }

    if (activeStep === steps.length - 1) {
      // confirmarPago();
    } else {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };
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


const StepElements =()=>{
let ElementFinish = () => <React.Fragment>
<Typography sx={{ mt: 2, mb: 1 }}>
  All steps completed - you&apos;re finished
</Typography>
<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
  <Box sx={{ flex: "1 1 auto" }} />
  <Button onClick={handleReset}>Reset</Button>
</Box>
</React.Fragment>



let ContentSteps = () => {
  switch (activeStep) {
    case 0:
     return (
       <>
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
              style={{ paddingBottom: 20 }}
            >
              <Chip color="info" label={`Tienes ${compras.length} compras en el Carrito`} />
            </Grid>
          </Grid>
         {idTiendas.map((idTienda) => {
           const comprasTienda = compras.filter(
             (compra) => compra.idTienda === idTienda
           );
           return (
             <Grid item xs={12} key={idTienda}>
               <Divider>
                 <Chip
                   variant="outlined"
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
       </>
     );
     
     
     
      case 1:
        return (
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
              style={{ paddingBottom: 20 }}
            >
              <Mapa/>
              <Chip color="info" label={`Total a pagar: ${precioTotal} CUP`} />
            </Grid>
          </Grid>
        );
      case steps.length-1:
        return (
          <Grid
            item
            container
            direction="column"
            justifyContent="flex-end"
            alignItems="center"
            xs={12}
          >
            {/* <Button>Cerrar Carrito</Button> */}
            <h1>TOTAL PAGADO</h1>
            <Chip color="info" label={`Total a pagar: ${precioTotal} CUP`} />
            {/* <Button
              disabled={idTiendas.length == 0}
              onClick={confirmarPago}
              variant="contained"
            >
              Confirmar
            </Button> */}
          </Grid>
        );
    default:
      return <></>
  }
}

 return activeStep === steps.length ? (
    <ElementFinish/>
  ) : (
    <React.Fragment>
      <ContentSteps/>
      
    </React.Fragment>
  )
}





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
  
  useEffect(() => {
    // Update the document title using the browser API
    compras.length == 0 && setActiveStep(0)
    
  },[compras]);

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
          {/* STEPER */}
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                if (isStepOptional(index)) {
                  labelProps.optional = (
                    <Typography variant="caption">Optional</Typography>
                  );
                }
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <StepElements />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          {isStepOptional(activeStep) && (
            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
              Skip
            </Button>
          )}

          <Button
            disabled={compras.length == 0}
            variant="contained"
            onClick={handleNext}
          >
            {activeStep === steps.length - 1 ? "Finish" : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ShoppingCart;
