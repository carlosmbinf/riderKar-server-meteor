import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import {
  OnlineCollection,
  MensajesCollection,
  PreciosCollection,
  VentasCollection,
  LogsCollection,
  TiendasCollection,
  ProductosCollection,
  ImagesCollection,
  PedidosAsignadosCollection,
  ColaCadetesPorTiendasCollection,
} from "../imports/collection/collections";

function replaceUrl(url, newUrl) {
  const regex = /http?:\/\/localhost:3000/;
  return url.replace(regex, newUrl);
}

if (Meteor.isServer) {
  console.log("Cargando Métodos...");

  Meteor.methods({
    agregarCadeteAColaPorTienda: (idTienda, cadeteId) => {
      let existe = ColaCadetesPorTiendasCollection.findOne({
        cadeteId,
        idTienda,
      });
      let idColaCadetePorTiendas =
        !existe &&
        ColaCadetesPorTiendasCollection.insert({ cadeteId, idTienda });
      return idColaCadetePorTiendas;
    },
    reiniciarColaCadeteAllTiendas: (idCadete) => {
      ColaCadetesPorTiendasCollection.remove(idCadete);
    },
    asignarVentasACadetes: (ventaId, idCadete) => {
      VentasCollection.update(ventaId, {
        $set: {
          cadeteid: idCadete,
        },
      });

      let VentaAsignada = {
        idVentas: ventaId,
        userId: idCadete,
      };
      PedidosAsignadosCollection.insert(VentaAsignada);

      return PedidosAsignadosCollection;
    },
    calcularDistancia: (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radio de la Tierra en km
      const dLat = ((lat2 - lat1) * Math.PI) / 180; // Diferencia en latitud en radianes
      const dLon = ((lon2 - lon1) * Math.PI) / 180; // Diferencia en longitud en radianes
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distancia = R * c; // Distancia en km
      // console.log("distancia", distancia);
      return distancia;
    },
    getusers: function (filter) {
      return Meteor.users
        .find(filter ? filter : {}, { sort: { vpnip: 1 } })
        .fetch();
    },

    addUser: function (user) {
      try {
        let id = Accounts.createUser(user);
        return id;
      } catch (error) {
        return error;
      }
    },

    addEmpresa: (empresa) => {
      try {
        let id = TiendasCollection.insert(empresa);
        return id;
      } catch (error) {
        return error;
      }
    },
    addProducto: async (producto) => {
      console.log(producto);
      try {
        const id = await ProductosCollection.insert(producto);
        return id;
      } catch (error) {
        console.log(error.message);

        return error;
      }
    },
    addVenta: async (
      idUser,
      idProducto,
      cantidad,
      recogidaEnLocal,
      comentario
    ) => {
      try {

        let cobroEntrega = await Meteor.settings.public.cobroEntrega;
        let producto = await ProductosCollection.findOne(idProducto);
        let tienda = await TiendasCollection.findOne({
          _id: producto.idTienda,
        });
        console.log(producto);
        console.log("cobroEntrega", cobroEntrega);

        const id = await VentasCollection.insert({
          idUser,
          idProducto,
          producto,
          idTienda:producto.idTienda,
          tienda,
          status: "PREPARANDO",
          cantidad,
          cobroEntrega,
          recogidaEnLocal,
          comentario,
        });
        return id;
      } catch (error) {
        console.log(error.message);

        return error;
      }
    },
    cancelarPedidos: async (idPedido, idCadete) => {
      try {
        let pedidoAsignado = await PedidosAsignadosCollection.findOne(idPedido);
        let idColaDeCadetesPorTiendas =
          await ColaCadetesPorTiendasCollection.findOne({ cadeteId: idCadete });
        await PedidosAsignadosCollection.remove(idPedido);
        await ColaCadetesPorTiendasCollection.remove(idColaDeCadetesPorTiendas);
        pedidoAsignado &&
          await VentasCollection.update(
            { _id: pedidoAsignado.idVentas },
            { $set: { cadeteid: null } }
          );
          console.log("Pedido", idPedido, " cancelado correctamente");
      } catch (error) {
        console.log(error.message);

        return error;
      }
    },
    addImg(img) {
      try {
        console.log(img);
        // Images.insert({
        //   file: e.currentTarget.files[0],
        //   streams: 'dynamic',
        //   chunkSize: 'dynamic',
        //   meta: {'owner': char}
        // }, false);

        // let id = ProductosCollection.insert(producto);
        // return id ? "Empresa agregada correctamente!!!" : "";
      } catch (error) {
        return error;
      }
    },
    findImgbyProduct(idProducto) {
      try {
        const link = ImagesCollection.findOne({
          "meta.idProducto": idProducto,
        }).link();
        const linkOficial = replaceUrl(link, Meteor.settings.public.ROOT_URL);
        return linkOficial;
      } catch (error) {
        return error;
      }
    },

    sendMensaje: function (user, text, subject) {
      MensajesCollection.insert({
        from: user.bloqueadoDesbloqueadoPor
          ? user.bloqueadoDesbloqueadoPor
          : Meteor.users.findOne({
              username: Array(Meteor.settings.public.administradores)[0][0],
            })._id,
        to: user._id,
        mensaje: text.text,
      });
      // console.log(text);
    },
    removeProducto: (id) => {
      try {
        const link = ProductosCollection.remove(id);

        return link;
      } catch (error) {
        return error;
      }
    },
    removeTienda: (id) => {
      try {
        ProductosCollection.find({ idTienda: id }).forEach((producto) => {
          ProductosCollection.remove(producto._id);
        });
        const link = TiendasCollection.remove(id);

        return link;
      } catch (error) {
        return error;
      }
    },
  });
}
