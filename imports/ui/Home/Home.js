import React, { useState } from "react";
// import { makeStyles } from "@mui/material";
import { AppBar, Grid, Paper } from "@mui/material";
import Header from "./Header";
import CreateEmpresa from "../Empresa/CreateEmpresa";
import { Route, Routes } from "react-router-dom";
import Formulario from "../login/Login";
import EmpresasTable from "../Empresa/EmpresasTable";
import { makeStyles } from "tss-react/mui";
import CreateProductos from "../Productos/CreateProductos";
import ProductosTable from "../Productos/ProductosTable";
import CarouselAllProductos from "../Productos/CarouselAllProductos";

const drawerWidth = 240;

const useStyles = makeStyles()((theme) => ({
  root: {
    // display: "flex",
    backgroundColor: "blue",
    margin: 0,
    padding: 0,
  },
}));

const Home = () => {
  const { classes } = useStyles();
  return (
    <>
      <Header />
      <Routes>
        <Route path="create-empresa" element={<CreateEmpresa />} />
        <Route
          path="list-empresas"
          element={
            <>
              <CreateEmpresa />
              <EmpresasTable />
            </>
          }
        />
        <Route
          path="add-products"
          element={
            <>
              <CreateProductos />
              <ProductosTable />
              <CarouselAllProductos idTienda="KP8ZiKYJptGmHjaSS" />
            </>
          }
        />
        <Route
          path="products"
          element={
            <>
              <Grid
                container
                spacing={2}
              >
                <Grid item xs={12}>
                  <Paper>
                    <ProductosTable />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <CarouselAllProductos idTienda="KP8ZiKYJptGmHjaSS" />
                </Grid>
              </Grid>
            </>
          }
        />
      </Routes>
    </>
  );
};

export default Home;

// necesito un metodo que me elimine de una URL el https://localhost:3000 y lo cambie por otro
