import React, { useState } from "react";
import { Button, TextField, FormControl, InputLabel, Input } from "@mui/material";
import {ImagesCollection} from '/imports/collection/collections';

const ImageUpload = (props) => {

  const {empresaId, productoId} = props
  const [file, setFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("File submitted:", file);
    Meteor.call("addImg",{file})


    
    let upload = ImagesCollection.insert({
      file: file,
      chunkSize: 'dynamic',
      meta:{
        empresaId,
        productoId
      }

    }, false);

    
    upload.on('start', function (error, fileObj) {
      console.log("Cargando file");
    });
    upload.on('progress', function (progress, fileObj) {
      console.log('Upload Percentage: ' + progress)
      // Update our progress bar
      self.setState({
        progress: progress
      });
    });
    upload.on('end', function (error, fileObj) {
      if (error) {
        alert(`Error during upload: ${error}`);
      } else {
        console.log(fileObj);
        fileObj.idProducto = "aaaaaaaaaaaa"
        alert(`File "${fileObj.name}" successfully uploaded`);
      }
      console.log("File upload terminado");
    });

    upload.start();

  };

  const handleFileInputChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <form target="#" onSubmit={handleSubmit}>
      <FormControl sx={{ mb: 2 }}>
        <InputLabel htmlFor="image-upload">Selecciona una imagen</InputLabel>
        <Input
          accept="image/*"
          id="image-upload"
          multiple={false}
          type="file"
          onChange={handleFileInputChange}
        />
      </FormControl>
      <Button variant="contained" color="primary" type="submit" disabled={!file}>
        Enviar imagen
      </Button>
    </form>
  );
};

export default ImageUpload;