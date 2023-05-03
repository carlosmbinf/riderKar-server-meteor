import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Input,
  IconButton,
  FormControlLabel,
  Switch,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  useTheme,
  useMediaQuery,
  Paper,
  Card,
  Stack,
} from "@mui/material";
import {
  ImagesCollection,
  ProductosCollection,
  TiendasCollection,
} from "/imports/collection/collections";
import { useTracker } from "meteor/react-meteor-data";
import FileUpload from "react-mui-fileuploader";
import ImageUpload from "../Files/ImageUpload";
import { PhotoCamera } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { Image } from "primereact/image";
import CircularStatic from "../Progress/CircularStatic";

import AddCircleIcon from '@mui/icons-material/AddCircle';

const CreateProductos = () => {
  //   const [nombre, setNombre] = useState('');
  const [name, setName] = useState();
  const [descripcion, setDescripcion] = useState();
  const [count, setCount] = useState();
  const [comentario, setComentario] = useState();
  const [precio, setPrecio] = useState();
  const [stateUpload, setStateUpload] = useState(0);
  const [productoDeElaboracion, setProductoDeElaboracion] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const [file, setFile] = useState(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(`Nombre: ${email}, Correo electrónico: ${password}`);

    if(tiendaUser) {

      const producto = {
        idTienda: tiendaUser._id,
        name,
        descripcion,
        count,
        comentario,
        precio,
      };
  
      let id = Meteor.call("addProducto", producto, (error, result) => {
        console.log("id", result);
        console.log("File submitted:", file);

        let upload = ImagesCollection.insert(
          {
            file: file,
            chunkSize: "dynamic",
            meta: {
              idProducto: result,
            },
          },
          false
        );

        upload.on("start", function (error, fileObj) {
          console.log("Cargando file");
        });
        upload.on("progress", function (progress, fileObj) {
          console.log("Upload Percentage: " + progress);
          // Update our progress bar
          setStateUpload(progress);
        });

        upload.on("end", function (error, fileObj) {
          if (error) {
            console.log(`Error during upload: ${error}`);
          } else {
            setFile(null);
            setStateUpload(0);
            setComentario("");
            setCount(0);
            setDescripcion("");
            setName("");
            setPrecio(0);
            console.log(fileObj);
            // alert(`File "${fileObj.name}" successfully uploaded`);
          }
          console.log("File upload terminado");
        });
        upload.start();
      });
    }
  };

  const handleFileInputChange = (event) => {
    setFile(event.target.files[0]);
    console.log(event.target.files[0]);
  };

  
  return (
    <>
      {/* <IconButton size="large" color="primary" aria-label="add to shopping cart">
        
      </IconButton> */}
      {tiendaUser && (
        <Button
          startIcon={<AddCircleIcon />}
          size="large"
          variant="contained"
          color="primary"
          // style={{color:"primary"}}
          onClick={() => setOpenDialog(true)}
        >
          Agregar Producto
        </Button>
      )}

      <Dialog open={openDialog} fullScreen={fullScreen}>
        <DialogTitle>Agregar Producto</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                label="Nombre"
                type="text"
                variant="outlined"
                value={name}
                onChange={(event) => setName(event.target.value)}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Descripcion"
                type="text"
                variant="outlined"
                value={descripcion}
                onChange={(event) => setDescripcion(event.target.value)}
                margin="normal"
                fullWidth
                inputProps={{
                  maxLength: 85, // máximo 20 caracteres
                  minLength: 50,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Precio"
                type="number"
                variant="outlined"
                value={precio}
                onChange={(event) => setPrecio(event.target.value)}
                margin="normal"
                fullWidth
              />
            </Grid>
            <Grid item sm={12} padding={5}>
              <Paper></Paper>
              <FormControlLabel
                control={
                  <Switch
                    checked={productoDeElaboracion}
                    onChange={(event) =>
                      setProductoDeElaboracion(event.target.checked)
                    }
                    name="antoine"
                  />
                }
                label="Producto de Elaboracion"
              />
              {!productoDeElaboracion && (
                <TextField
                  required
                  label="Cantidad disponible"
                  type="number"
                  variant="outlined"
                  value={count}
                  onChange={(event) => setCount(event.target.value)}
                  margin="normal"
                  fullWidth
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Comentario"
                type="text"
                variant="outlined"
                value={comentario}
                onChange={(event) => setComentario(event.target.value)}
                margin="normal"
                fullWidth
              />
            </Grid>

            <Grid item sm={12}>
              <FormControl sx={{ mb: 2 }} required>
                {/* <InputLabel htmlFor="image-upload">
                Selecciona una imagen
              </InputLabel>
              <Input
                accept="image/*"
                id="image-upload"
                multiple={false}
                type="file"
                onChange={handleFileInputChange}
              /> */}
                <Button
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                  startIcon={<PhotoCamera />}
                >
                  Cargar Imagen
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleFileInputChange}
                  />
                </Button>
                {file && (
                  <Image
                    src={URL.createObjectURL(file)}
                    zoomSrc={URL.createObjectURL(file)}
                    alt="Image"
                    height="auto"
                    width="150px"
                    preview

                    // style={{zIndex:1}}
                  />
                )}
              </FormControl>

              {/* <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!file}
              >
                Enviar imagen
              </Button> */}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={() => setOpenDialog(false)}
          >
            Cancelar
          </Button>
          {stateUpload > 0 && stateUpload < 100 ? (
            <CircularStatic value={stateUpload} />
          ) : (
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!file}
              onClick={handleSubmit}
            >
              Agregar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateProductos;
