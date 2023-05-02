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
} from "@mui/material";
import {
  ImagesCollection,
  ProductosCollection,
} from "/imports/collection/collections";
import { useTracker } from "meteor/react-meteor-data";
import FileUpload from "react-mui-fileuploader";
import ImageUpload from "../Files/ImageUpload";
import { PhotoCamera } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { Image } from "primereact/image";
import CircularStatic from "../Progress/CircularStatic";

const CreateProductos = () => {
  //   const [nombre, setNombre] = useState('');
  const [name, setName] = useState();
  const [descripcion, setDescripcion] = useState();
  const [count, setCount] = useState();
  const [comentario, setComentario] = useState();
  const [precio, setPrecio] = useState();
  const [stateUpload, setStateUpload] = useState(0);
  const [productoDeElaboracion, setProductoDeElaboracion] = useState(false);
  
  const [file, setFile] = useState(null);

  const listTiendas = useTracker(() => {
    // Meteor.subscribe("productos");
    let a = [];

    Meteor.subscribe("tiendas") &&
      ProductosCollection.find(
        {},
        {
          // sort: {userId:1, type: 1, precio: 1 }
        }
      ).map(
        (data) =>
          data &&
          a.push({
            id: data._id,
            title: data.title && data.title,
          })
      );

    return a;
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(`Nombre: ${email}, Correo electrónico: ${password}`);

    const producto = {
      idTienda: "KP8ZiKYJptGmHjaSS",
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
  };

  const handleFileInputChange = (event) => {
    setFile(event.target.files[0]);
    console.log(event.target.files[0]);
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ paddingTop: 60 }}>
        <Grid container spacing={2} padding={5} boxShadow={3}>
          <Grid item sm={6} lg={4}>
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
          <Grid item sm={6} lg={4}>
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
                minLength: 50
              }}
            />
          </Grid>
          <Grid item sm={6} lg={4}>
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
          <Grid item sm={6} lg={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={productoDeElaboracion}
                  onChange={(event)=> setProductoDeElaboracion(event.target.checked)}
                  name="antoine"
                />
              }
              label="Antoine Llorca"
            />
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
          </Grid>
          <Grid item sm={6} lg={4}>
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
          <Grid item sm={12}>
            {stateUpload > 0 && stateUpload < 100 ? (
              <CircularStatic value={stateUpload} />
            ) : (
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!file}
              >
                Enviar
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default CreateProductos;
