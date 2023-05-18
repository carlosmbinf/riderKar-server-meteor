import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
// import { makeStyles } from "@mui/material";
import { AppBar, Chip, Divider, Grid, Paper } from "@mui/material";
import Header from "./Header";
import CreateEmpresa from "../Empresa/CreateEmpresa";
import { Route, Routes, useParams  } from "react-router-dom";
import Formulario from "../login/Login";
import EmpresasTable from "../Empresa/EmpresasTable";
import { makeStyles } from "tss-react/mui";
import CreateProductos from "../Productos/CreateProductos";
import ProductosTable from "../Productos/ProductosTable";
import CarouselAllProductos from "../Productos/CarouselAllProductos";
import { TiendasCollection } from "/imports/collection/collections";
import CarouselByTiendas from "../Productos/CarouselByTiendas";

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

  const tiendasIds = useTracker(() => {
    Meteor.subscribe("tiendas");
    const tiendas = TiendasCollection.find().fetch();
    const tiendasIds = [
      
        ...tiendas.map((tienda) => {
          return { id: tienda._id, title: tienda.title,descripcion:tienda.descripcion  }
        })
    ];
    return tiendasIds;
  });
  
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
              {Meteor.user().profile.role.includes("EMPRESA") && (
                <Grid item xs={12}>
                  <CreateProductos />
                </Grid>
              )}
              {tiendasIds.map((tienda) => (
                <>
                  <Divider hidden={true}>
                    <Chip label={`${tienda.title}`} color="primary" />
                  </Divider>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    paddingTop={1}
                  >
                    <Chip label={`${tienda.descripcion}`} color="info" />
                  </Grid>

                  <CarouselByTiendas tiendaId={tienda.id} />
                </>
              ))}
              {/* <Divider>
                <Chip label={`All Products`} color="primary" />
              </Divider>
              <CarouselByTiendas /> */}
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
                  <CarouselByTiendas />
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