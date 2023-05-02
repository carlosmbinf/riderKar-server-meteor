import React from "react";
import MenuIcon from "@mui/icons-material/Menu";

const listadoHeaderClient = [
];

const listadoHeaderEmpresa = [
  {
    to: "add-products",
    text: "Agregar Productos",
    icon: MenuIcon,
  },{
    to: "products",
    text: "Productos",
    icon: MenuIcon,
  },
];
const listadoHeaderAdmin = [
  {
    to: "create-empresa",
    text: "Crear Empresa",
    icon: MenuIcon,
  }
];

export { listadoHeaderClient, listadoHeaderEmpresa, listadoHeaderAdmin };
