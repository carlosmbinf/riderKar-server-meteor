import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {
  Button,
  CardActionArea,
  CardActions,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

export default function CardProducto({product}) {
  const { _id, img, name, descripcion, precio, count } = product;
  const [urlImg, setUrlImg] = React.useState();
  const [open, setOpen] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [comentario, setComentario] = useState("");
  const [recogidaEnLocal, setRecogidaEnLocal] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleRecogidaEnLocal = (event) => {
    setRecogidaEnLocal(!recogidaEnLocal);
  };
  const handleComentario = (event) => {
    setComentario(event.target.value);
  };

  const handleChangeCantidad = (event) => {
    setCantidad(event.target.value);
  };

  const handleComprar = () => {
    console.log(`Comprar ${cantidad} unidades con id ${_id}`);

    Meteor.call(
      "addAlCarrito",
      Meteor.userId(),
      _id,
      cantidad,
      recogidaEnLocal,
      comentario
    );

    handleClose();
  };
  React.useEffect(() => {
    Meteor.subscribe("images", { "meta.idProducto": _id });
    Meteor.call("findImgbyProduct", _id, (error, result) => {
      setUrlImg(result);
    });
  });
  return (
    <Grid sx={{ minWidth: 400, maxWidth: 400 }}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Comprar</DialogTitle>
        <DialogContent>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            paddingTop={1}
          >
            <Grid item xs={12} lg={12}>
              <TextField
                fullWidth
                required
                label="Cantidad"
                type="number"
                value={cantidad}
                onChange={handleChangeCantidad}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            {/* <Grid item xs={12} lg={12}>
                  <TextField
                    fullWidth
                    multiline
                    label="Comentario"
                    type="text"
                    value={comentario}
                    onChange={handleComentario}
                    inputProps={{
                      maxLength: 85, // máximo 20 caracteres
                      minLength: 0,
                    }}
                  />
                </Grid> */}

            <Grid item xs={12} lg={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={recogidaEnLocal}
                    onChange={handleRecogidaEnLocal}
                  />
                }
                label="Recoger en Local"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleComprar}>Comprar</Button>
        </DialogActions>
      </Dialog>
      <Card
        sx={{ minWidth: 300, maxWidth: 300, margin: 5 }}
        elevation={12}
        style={{ borderRadius: 20 }}
      >
        <CardMedia
          component="img"
          alt="green iguana"
          height="140"
          image={urlImg}
        />
        <CardContent sx={{ maxHeight: 150, minHeight: 150 }}>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {descripcion}
          </Typography>
        </CardContent>
        <CardActions>
          {/* <Button size="small">Share</Button> */}
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <Chip label={`${precio} CUP`}></Chip>
            </Grid>
            <Grid item>
              <IconButton color="secondary" onClick={handleOpen}>
                <ShoppingCartIcon />
              </IconButton>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </Grid>
  );
}
// Necesito un icon button de compras en MUI version 5 que muestre un Dialog donde pueda introducir una cantidad a comprar
