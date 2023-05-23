import React from "react";
import { makeStyles, withStyles } from "tss-react/mui";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import {
  Paper,
  Box,
  Grid,
  Icon,
  Divider,
  Zoom,
  IconButton,
  Chip,
} from "@mui/material";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { useTracker } from "meteor/react-meteor-data";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import { Link, useParams } from "react-router-dom";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import {
  locale,
  addLocale,
  updateLocaleOption,
  updateLocaleOptions,
  localeOption,
  localeOptions,
} from "primereact/api";

import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "../css/Table.css";
import { Dropdown } from "primereact/dropdown";
//icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import PermContactCalendarRoundedIcon from "@mui/icons-material/PermContactCalendarRounded";
import MailIcon from "@mui/icons-material/Mail";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";

//Collections

// import { useHistory } from "react-router-dom";
import dateFormat from "dateformat";
import {
  ProductosCollection,
  TiendasCollection,
} from "/imports/collection/collections";

const StyledBadge = withStyles(Badge, (theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const SmallAvatar = withStyles(Avatar, (theme) => ({
  root: {
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}));

const useStyles = makeStyles()((theme) => {
  return {
    [theme.breakpoints.down("sm")]: {},
    [theme.breakpoints.down("md")]: {},
    [theme.breakpoints.up("md")]: {
      columnSmoll: {},
    },
    clasificado: {
      background: theme.palette.secondary.main,
      padding: 10,
      borderRadius: 25,
    },
    noclasificado: {
      background: theme.palette.primary.main,
      padding: 10,
      borderRadius: 25,
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-start",
    },
    margin: {
      margin: theme.spacing(2),
    },
    avatar: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
  };
});

export default function ProductosTable(props) {
  const { classes } = useStyles();
  const [open, setOpen] = React.useState(true);
  const [selectedOnline, setSelectedOnline] = React.useState(null);
  const [selectedRole, setSelectedRole] = React.useState(null);
  const [selectedLimites, setSelectedLimites] = React.useState(null);
  const [selectedConProxy, setSelectedConProxy] = React.useState(null);
  const dt = React.useRef(null);
  let { tiendaId } = useParams();
  const idTienda = props.tiendaId || tiendaId;
  // const history = useHistory();

  // var userOnline = useTracker(() => {

  //   return OnlineCollection.find({"userId" : Meteor.userId()}).fetch();
  // });
  locale("es");
  addLocale("es", {
    firstDayOfWeek: 1,
    dayNames: [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ],
    dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
    dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
    monthNames: [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ],
    monthNamesShort: [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ],
    today: "Hoy",
    clear: "Limpiar",
    //...
  });

  const productos = useTracker(() => {
    // Meteor.subscribe("users");
    let a = [];

    Meteor.subscribe("productos", idTienda ? { idTienda: idTienda } : {}) &&
      ProductosCollection.find(idTienda ? { idTienda: idTienda } : {}).map(
        (data) =>
          data &&
          a.push({
            id: data._id,
            idTienda: data.idTienda,
            createdAt: data.createdAt && data.createdAt.toString(),
            name: data.name && data.name,
            descripcion: data.descripcion && data.descripcion,
            count: data.count && data.count,
            comentario: data.comentario,
          })
      );

    return a;
  });

  const paginatorLeft = (
    <Button type="button" icon="pi pi-refresh" className="p-button-text" />
  );
  const paginatorRight = (
    <Button type="button" icon="pi pi-cloud" className="p-button-text" />
  );
  const iDBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">ID</span>
        {rowData.id}
      </React.Fragment>
    );
  };
  const iDTiendaBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">ID Tienda</span>
        {rowData.idTienda}
      </React.Fragment>
    );
  };
  const createdAtBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Creado:</span>
        {rowData.createdAt}
      </React.Fragment>
    );
  };
  const nameBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Nombre:</span>
        <Chip color="primary" label={rowData.name} />
      </React.Fragment>
    );
  };
  const descripcionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Descripcion:</span>
        <Chip color="primary" label={rowData.descripcion} />
      </React.Fragment>
    );
  };

  const countBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Cantidad Disponible</span>
        <Chip color="primary" label={rowData.count} />
      </React.Fragment>
    );
  };

  const typeBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Type</span>
        <Chip
          color="primary"
          style={{ textTransform: "uppercase" }}
          label={rowData.type}
        />
      </React.Fragment>
    );
  };
  const comentarioBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Comentarios</span>
        {rowData.comentario}
      </React.Fragment>
    );
  };

  const eliminarProducto = (id) => {
    Meteor.call("removeProducto",id)
  };
  
  const eliminarBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title"></span>
        <Tooltip title={`Eliminar ${rowData.precio} CUP`}>
          <IconButton
            // disabled
            aria-label="delete"
            color="primary"
            onClick={() => {
              eliminarProducto(rowData.id);
            }}
          >
            <DeleteIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  };
  const urlBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title"></span>
        <Tooltip title={"Ver Detalles"}>
          <IconButton
            aria-label="delete"
            color="primary"
            onClick={() => {
              // history.push("/precio/" + rowData.id);
            }}
          >
            <ListAltIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  };

  return (
    <>
      <div className={classes.drawerHeader}></div>

      <Zoom in={true}>
        {/* <div style={{ width: "100%", padding: 10 }}> */}
        <div className="datatable-responsive-demo">
          <div className="card">
            <DataTable
              ref={dt}
              className="p-shadow-5 p-datatable-responsive-demo"
              value={productos}
              paginator
              paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando: {first} - {last} de {totalRecords}"
              rows={5}
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              paginatorLeft={paginatorLeft}
              paginatorRight={paginatorRight}
              // reorderableColumns={true}
              // resizableColumns={true}
            >
              <Column
                field="id"
                body={iDBodyTemplate}
                wrap="nowrap"
                header="ID"
                filter
                filterPlaceholder="ID"
                filterMatchMode="contains"
              />
              <Column
                field="idTienda"
                body={iDTiendaBodyTemplate}
                wrap="nowrap"
                header="ID"
                filter
                filterPlaceholder="ID Tienda"
                filterMatchMode="contains"
              />

              <Column
                field="creadoPor"
                header="Creado Por"
                body={nameBodyTemplate}
                filter
                filterPlaceholder="Creado Por:"
                filterMatchMode="contains"
              />
              <Column
                field="heredaDe"
                header="Hereda de"
                body={descripcionBodyTemplate}
                filter
                filterPlaceholder="Hereda De:"
                filterMatchMode="contains"
              />
              <Column
                field="createdAt"
                header="Fecha de Creado"
                body={createdAtBodyTemplate}
                filter
                filterPlaceholder="Fecha"
                filterMatchMode="contains"
              />
              <Column
                field="count"
                header="Cantidad Disponible"
                body={countBodyTemplate}
                filter
                filterPlaceholder="Cantidad Disponible:"
                // filterMatchMode="contains"
              />
              {/* <Column
                field="longitude"
                header="Longitude"
                body={longitudeBodyTemplate}
                filter
                filterPlaceholder="Longitude:"
                // filterMatchMode="contains"
              /> */}
              <Column
                field="comentario"
                header="Comentario"
                body={comentarioBodyTemplate}
                filter
                filterPlaceholder="Comentario:"
                filterMatchMode="contains"
              />
              <Column field="url" header="Detalles" body={urlBodyTemplate} />
              <Column
                field="eliminar"
                // header="Eliminar"
                body={eliminarBodyTemplate}
              />
            </DataTable>
          </div>
        </div>
        {/* </div> */}
      </Zoom>
    </>
  );
}
