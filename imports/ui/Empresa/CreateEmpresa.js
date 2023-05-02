import React, { useState } from "react";
import { TextField, Button, Grid } from "@mui/material";

const CreateEmpresa = () => {
  //   const [nombre, setNombre] = useState('');
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [title, setTitle] = useState();
  const [descripcion, setDescripcion] = useState();

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
    };

    Meteor.call("addEmpresa", tienda);
  };

  return (
    <form onSubmit={handleSubmit} style={{ paddingTop: 60 }}>
      <Grid container spacing={2} padding={5}>
      <Grid item sm={6} lg={4}>
          <TextField
            label="Title"
            type="text"
            variant="outlined"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            margin="normal"
            fullWidth
          />
        </Grid>
        <Grid item sm={6} lg={4}>
          <TextField
            label="Descripcion"
            type="text"
            variant="outlined"
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            margin="normal"
            fullWidth
          />
        </Grid>
        <Grid item sm={6} lg={4}>
          <TextField
            label="Latitude"
            type="number"
            variant="outlined"
            value={latitude}
            onChange={(event) => setLatitude(event.target.value)}
            margin="normal"
            fullWidth
          />
        </Grid>
        <Grid item sm={6} lg={4}>
          <TextField
            label="Longitude"
            type="number"
            variant="outlined"
            value={longitude}
            onChange={(event) => setLongitude(event.target.value)}
            margin="normal"
            fullWidth
          />
        </Grid>
        
        <Grid item sm={12}>
          <Button variant="contained" color="primary" type="submit">
            Enviar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateEmpresa;
