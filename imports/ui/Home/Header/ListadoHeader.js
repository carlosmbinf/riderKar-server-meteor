import React from "react";
import MenuIcon from "@mui/icons-material/Menu";

const listadoHeaderClient = [
];

const listadoHeaderEmpresa = [
  {
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
  },
  {
    to: "tiendas",
    text: "Tiendas",
    icon: MenuIcon,
  }
];

export { listadoHeaderClient, listadoHeaderEmpresa, listadoHeaderAdmin };
