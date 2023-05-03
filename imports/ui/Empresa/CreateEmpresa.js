import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";

import AddCircleIcon from '@mui/icons-material/AddCircle';

import { useTracker } from "meteor/react-meteor-data";
import { TiendasCollection } from "/imports/collection/collections";


const CreateEmpresa = () => {
  //   const [nombre, setNombre] = useState('');
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [title, setTitle] = useState();
  const [descripcion, setDescripcion] = useState();
  const [openDialog, setOpenDialog] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(`Nombre: ${email}, Correo electrónico: ${password}`);

    let tienda = {
      coordenadas: {
        latitude,
        longitude,
      },
      title,
      descripcion,
      idUser: Meteor.userId(),
    };

    Meteor.call("addEmpresa", tienda);
  };


  const tiendaUser = useTracker(() => {
    // Meteor.subscribe("productos");
    Meteor.subscribe("tiendas", { idUser: Meteor.userId() }) .ready()

    return TiendasCollection.findOne(
      { idUser: Meteor.userId() },
      {
        // sort: {userId:1, type: 1, precio: 1 }
      }
    );
  });


  return (
    <>
      {!tiendaUser ? (
        <Grid item paddingLeft={5}>
          <Button
            startIcon={<AddCircleIcon />}
            size="large"
            variant="contained"
            color="primary"
            // style={{color:"primary"}}
            onClick={() => setOpenDialog(true)}
          >
            Crear Empresa
          </Button>
        </Grid>
      ) : (
        <Grid container>
          <Grid item xs={12} md={6} lg={4} padding={5}>
            <Card elevation={6}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {tiendaUser.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tiendaUser.descripcion}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      )}

      <Dialog
        fullScreen={fullScreen}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        style={{ borderRadius: "20px !important" }}
      >
        <DialogTitle id="alert-dialog-title">Creando Empresa</DialogTitle>

        <DialogContent>
          <Grid container spacing={2}>
            <Grid item sm={10} lg={10}>
              <TextField
                required
                label="Title"
                type="text"
                variant="outlined"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item sm={10} lg={10}>
              <TextField
                required
                label="Descripcion"
                type="text"
                variant="outlined"
                value={descripcion}
                onChange={(event) => setDescripcion(event.target.value)}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item sm={10} lg={10}>
              <TextField
                required
                label="Latitude"
                type="number"
                variant="outlined"
                value={latitude}
                onChange={(event) => setLatitude(event.target.value)}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item sm={10} lg={10}>
              <TextField
                required
                label="Longitude"
                type="number"
                variant="outlined"
                value={longitude}
                onChange={(event) => setLongitude(event.target.value)}
                margin="normal"
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {/* <Grid item sm={12}> */}
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenDialog(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleSubmit}
          >
            Enviar
          </Button>
          {/* </Grid> */}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateEmpresa;
