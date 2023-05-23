import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import {
  OnlineCollection,
  MensajesCollection,
  PreciosCollection,
  CarritoCollection,
  LogsCollection,
  TiendasCollection,
  ProductosCollection,
  ImagesCollection,
  PedidosAsignadosCollection,
  ColaCadetesPorTiendasCollection,
  VentasCollection,
} from "../imports/collection/collections";

function replaceUrl(url, newUrl) {
  const regex = /http?:\/\/localhost:3000/;
  return url.replace(regex, newUrl);
}

const cambioDeEstadoPedidos = (status) => {
  switch (status) {
    case "PREPARANDO":
      return "CADETEENLOCAL";
    case "CADETEENLOCAL":
      return "ENCAMINO";
    case "ENCAMINO":
      return "CADETEENDESTINO";
    case "CADETEENDESTINO":
      return "ENTREGADO";
    default:
      return "ENTREGADO";
  }
};

function agregarElemento(arrayInicial, elemento) {
  let array = arrayInicial
  if (!array.includes(elemento)) {
    array.push(elemento);
  }
  return array
}


if (Meteor.isServer) {
  console.log("Cargando Métodos...");

  Meteor.methods({
    agregarCadeteAColaPorTienda: (idTienda, cadeteId) => {
      let existe = ColaCadetesPorTiendasCollection.findOne({
        cadeteId: cadeteId,
        idTienda: idTienda,
      });
      let existeCadeteConPedido = PedidosAsignadosCollection.find({
        userId: cadeteId,
        entregado: false,
      }).count();
      let idColaCadetePorTiendas =
        !existe &&
        existeCadeteConPedido == 0 &&
        ColaCadetesPorTiendasCollection.insert({ cadeteId, idTienda });
      return idColaCadetePorTiendas;
    },
    reiniciarColaCadeteAllTiendas: (idCadete) => {
      ColaCadetesPorTiendasCollection.remove(idCadete);
    },
    asignarVentasACadetes: (ventaId, idCadete) => {
      let venta = VentasCollection.findOne(ventaId);
      let pedidosCadete = PedidosAsignadosCollection.find({
        userId: idCadete,
        entregado: false,
      });
      if (
        pedidosCadete.count() == 0 &&
        venta &&
        venta.status == "PREPARANDO"
        // && venta.recogidaEnLocal == false
      ) {
        let VentaAsignada = {
          idVentas: ventaId,
          userId: idCadete,
        };
        let idPedidoAsignado = PedidosAsignadosCollection.insert(VentaAsignada);

        idPedidoAsignado &&
          VentasCollection.update(ventaId, {
            $set: {
              cadeteid: idCadete,
            },
          });

        let coladelcadete = ColaCadetesPorTiendasCollection.findOne({
          cadeteId: idCadete,
        });
        idPedidoAsignado &&
          ColaCadetesPorTiendasCollection.remove(coladelcadete._id);

        return idPedidoAsignado;
      }
      return null;
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
        let profile = Meteor.users.findOne(empresa.idUser).profile;
        let role = agregarElemento(profile.role, "EMPRESA");
        Meteor.users.update(empresa.idUser, { $set: { "profile.role": role } });
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
    addAlCarrito: async (
      idUser,
      idProducto,
      cantidad,
      recogidaEnLocal,
      comentario
    ) => {
      try {
        let producto = await ProductosCollection.findOne(idProducto);
        let tienda = await TiendasCollection.findOne({
          _id: producto.idTienda,
        });

        const id = await CarritoCollection.insert({
          idUser,
          cantidad,
          idProducto,
          producto,
          idTienda: producto.idTienda,
          tienda,
          comentario,
        });
        return id;
      } catch (error) {
        console.log(error.message);

        return error;
      }
    },
    addVenta: async (idUser, comprasEnCarrito, comentario) => {
      try {
        let cobroEntrega = await Meteor.settings.public.cobroEntrega;
        // let producto = await ProductosCollection.findOne(idProducto);
        // let tienda = await TiendasCollection.findOne({
        //   _id: producto.idTienda,
        // });
        comprasEnCarrito.forEach((carrito) => {
          // console.log(carrito._id, "idCarrito");
          CarritoCollection.remove(carrito._id);
        });
        
        // console.log("comprasEnCarrito", comprasEnCarrito);

        const id = await VentasCollection.insert({
          idUser,
          comprasEnCarrito,
          status: "PREPARANDO",
          cobroEntrega,
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
          (await VentasCollection.update(
            { _id: pedidoAsignado.idVentas },
            { $set: { cadeteid: null } }
          ));
        console.log("Pedido", idPedido, " cancelado correctamente");
      } catch (error) {
        console.log(error.message);

        return error;
      }
    },
    avanzarPedidos: async (idPedido, idCadete) => {
      try {
        let pedidoAsignado = await PedidosAsignadosCollection.findOne({
          _id: idPedido,
          entregado: false,
        });
        let venta =
          pedidoAsignado &&
          (await VentasCollection.findOne(pedidoAsignado.idVentas));
        if (venta) {
          switch (venta.status) {
            case "CADETEENDESTINO":
              // let idColaDeCadetesPorTiendas =
              //   await ColaCadetesPorTiendasCollection.findOne({
              //     cadeteId: idCadete,
              //   });

              await PedidosAsignadosCollection.update(idPedido, {
                $set: { entregado: true },
              });
              // await ColaCadetesPorTiendasCollection.remove(
              //   idColaDeCadetesPorTiendas
              // );

              await VentasCollection.update(
                { _id: pedidoAsignado.idVentas },
                { $set: { status: "ENTREGADO", cadeteid: idCadete } }
              );

              break;

            default:
              await VentasCollection.update(
                { _id: pedidoAsignado.idVentas },
                {
                  $set: {
                    status: cambioDeEstadoPedidos(venta.status),
                    cadeteid: idCadete,
                  },
                }
              );
              break;
          }
        }

        console.log("Pedido", idPedido, " Continuado correctamente");
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
    updateUbicacion: (cordenadas) => {
      Meteor.users.update(Meteor.userId(),{$set:{cordenadas:cordenadas}})
    }
  });
}
