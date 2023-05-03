import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Chip,
  Grid,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { link } from "../Estilos/Estilos";
import {
  listadoHeaderClient,
  listadoHeaderAdmin,
  listadoHeaderEmpresa,
} from "./Header/ListadoHeader";

const drawerWidth = 240;

// const useStyles = makeStyles((theme) => ({
// root: {
//   display: 'flex',
// },
// appBar: {
//   zIndex: theme.zIndex.drawer + 1,
// },
// menuButton: {
//   marginRight: theme.spacing(2),
// },
// title: {
//   flexGrow: 1,
// },
// drawer: {
//   width: drawerWidth,
//   flexShrink: 0,
// },
//   drawerPaper: {
//     width: drawerWidth,
//   },
// drawerContainer: {
//   overflow: 'auto',
// },
// }));

const Header = () => {
  // const classes = useStyles();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    setIsDrawerOpen(open);
  };

  const handleLogout = () => {
    // Code to handle logout goes here
    Meteor.logout();
  };

  const concatenar = (arrayInicial,separador) =>{
    let resultado = arrayInicial.join(separador)
    return resultado
  }
  return (
    <div
      style={{
        display: "flex",
      }}
      // className={classes.root}
    >
      <AppBar
        position="fixed"
        style={{
          zIndex: 1,
        }}
        // className={classes.appBar}
      >
        <Toolbar>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={toggleDrawer(true)}
                    style={{
                      marginRight: 10,
                    }}
                    // className={classes.menuButton}
                  >
                    <MenuIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography
                    variant="h6"
                    noWrap
                    style={{
                      flexGrow: 1,
                      textTransform: "uppercase",
                    }}
                    // className={classes.title}
                  >
                    {Meteor.user().profile &&
                      Meteor.user().profile.role &&
                      concatenar(Meteor.user().profile.role, " - ")}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="logout"
                onClick={handleLogout}
              >
                <ExitToAppIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        style={{
          width: drawerWidth,
          flexShrink: 0,
        }}
        // className={classes.drawer}
        variant="temporary"
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        classes={
          {
            // paper: classes.drawerPaper,
          }
        }
      >
        <List>
          {listadoHeaderClient.length > 0 && (
            <Divider>
              <Chip label="Clientes" />
            </Divider>
          )}
          {listadoHeaderClient.length > 0 &&
            listadoHeaderClient.map((listado) => (
              <Link to={listado.to} style={link}>
                <ListItem button>
                  <ListItemIcon>
                    <MenuIcon />
                  </ListItemIcon>
                  <ListItemText primary={listado.text} />
                </ListItem>
              </Link>
            ))}
          {listadoHeaderEmpresa.length > 0 && (
            <Divider>
              <Chip label="Empresas" />
            </Divider>
          )}
          {listadoHeaderEmpresa.length > 0 &&
            listadoHeaderEmpresa.map((listado) => (
              <Link to={listado.to} style={link}>
                <ListItem button>
                  <ListItemIcon>
                    <MenuIcon />
                  </ListItemIcon>
                  <ListItemText primary={listado.text} />
                </ListItem>
              </Link>
            ))}
          {listadoHeaderAdmin.length > 0 && (
            <Divider>
              <Chip label="Admin" />
            </Divider>
          )}
          {listadoHeaderAdmin.length > 0 &&
            listadoHeaderAdmin.map((listado) => (
              <Link to={listado.to} style={link}>
                <ListItem button>
                  <ListItemIcon>
                    <MenuIcon />
                  </ListItemIcon>
                  <ListItemText primary={listado.text} />
                </ListItem>
              </Link>
            ))}
        </List>

        {/* <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link> */}
      </Drawer>
    </div>
  );
};

export default Header;

// Necesito concatenar los string de un arreglo divididos por este char -
