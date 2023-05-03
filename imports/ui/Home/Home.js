import React, { useState } from "react";
// import { makeStyles } from "@mui/material";
import { AppBar, Grid, Paper } from "@mui/material";
import Header from "./Header";
import CreateEmpresa from "../Empresa/CreateEmpresa";
import { Route, Routes, useParams  } from "react-router-dom";
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
  let { idTienda } = useParams();
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="create-empresa"
          element={
            <Grid style={{ paddingTop: 80 }}>
              <CreateEmpresa />
            </Grid>
          }
        />
        <Route
          path="tiendas"
          element={
            <>
              <Grid container spacing={2} paddingTop={10}>
                <Grid item xs={12}>
                  <CreateEmpresa />
                </Grid>

                {/* {Meteor.user().profile.role.includes("admin") && (
               <Grid item xs={12}>
                <EmpresasTable />
                </Grid>
              )} */}
                <Grid item xs={12}>
                  <EmpresasTable />
                </Grid>
              </Grid>
            </>
          }
        />
        <Route
          path="products"
          element={
            <Grid style={{ paddingTop: 80 }}>
              {Meteor.user().profile.role.includes("admin") && (
               <Grid item xs={12}>
                <CreateProductos />
                </Grid>
              )}
              <CarouselAllProductos />
            </Grid>
          }
        />
        <Route
          path="tiendas/:idTienda/products"
          element={
            <>
              <Grid container spacing={2} paddingTop={10}>
                <Grid item xs={12}>
                  {/* <Paper> */}
                  {/* <CarouselAllProductos  /> */}
                  <CarouselAllProductos idTienda={idTienda} />
                  {/* </Paper> */}
                </Grid>
                {Meteor.user().profile.role.includes("admin") && (
                  <Grid item xs={12}>
                    <ProductosTable />
                  </Grid>
                )}
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
// Como busco en un array si un string existe?