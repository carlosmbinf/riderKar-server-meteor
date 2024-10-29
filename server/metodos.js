import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import 'dotenv/config';

import fetch from "node-fetch";
import axios from 'axios';

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
  PaypalCollection,
} from "../imports/collection/collections";

const environment = process.env.ENVIRONMENT || 'sandbox';
const client_id = "AbjQ-Z9p5vQaaShPBQBnsknEEuheNALn1TdvpO2F3xR33pZQPGroW3yG9M6DLIrjw-gQl_vrUm-j7uvQ";
const client_secret = "EAozjCCyTLZ9aN1tVMhIle_a-IjzmzjH5HwdUSxZskqbv1j5mM-dFbkoCiVuDiX6is0OR-icI6pJhk1z";
const endpoint_url = environment === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';

console.log(client_id);


function replaceUrl(url, newUrl) {
  const regex = /http?:\/\/localhost:3000/;
  return url.replace(regex, newUrl);
}

function get_access_token() {
    const auth = `${client_id}:${client_secret}`
    const data = 'grant_type=client_credentials'
    return fetch(endpoint_url + '/v1/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(auth).toString('base64')}`
            },
            body: data
        })
        .then(res => res.json())
        .then(json => {
            console.log(json.access_token);
            return json.access_token;
        })
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
    creandoOrden: async (idUser, value, description) => {
      return get_access_token()
        .then((access_token) => {
          let order_data_json = {
            intent: "CAPTURE".toUpperCase(),
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: value,
                },
                description: description,
              },
            ],
            application_context: {
              brand_name: "RiderKar",
              landing_page: "LOGIN",
              user_action: "PAY_NOW",
              return_url: replaceUrl("http://localhost:3000/capture-order", Meteor.settings.public.ROOT_URL),
              cancel_url: replaceUrl("http://localhost:3000/cancel-order", Meteor.settings.public.ROOT_URL),
            },
          };

          //   {
          //     'intent': "CAPTURE".toUpperCase(),
          //     'purchase_units': [{
          //         'amount': {
          //             'currency_code': 'USD',
          //             'value': '95.00'
          //         },
          //         "description":"pizza"
          //     }],
          //     application_context:{
          //         brand_name:"VidKar",
          //         landing_page:"LOGIN",
          //         user_action:"PAY_NOW",
          //         return_url:"http://localhost:3000/capture-order",
          //         cancel_url:"http://localhost:3000/cancel-order"
          //     }
          // }
          const data = JSON.stringify(order_data_json);

          return fetch(endpoint_url + "/v2/checkout/orders", {
            //https://developer.paypal.com/docs/api/orders/v2/#orders_create
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
            body: data,
          })
            .then((res) => res.json())
            .then(async (json) => {
              console.log(json);
              const { id, status, links } = json;
              let carritos = await CarritoCollection.find({
                idUser: idUser,
              }).map((carrito) => {
                return carrito._id;
              });
              let paypal = {
                userId: idUser,
                idOrder: id,
                status: status,
                link: links && links[1] && links[1].href,
                carritos: carritos,
              };
              let pay = await PaypalCollection.findOne({
                userId: idUser,
                status: { $ne: "COMPLETED" },
              });

              if (!pay) {
                id && status && links && PaypalCollection.insert(paypal);
              } else {
                PaypalCollection.update(pay._id, { $set: paypal });
              }

              return paypal;
            }); //Send minimal data to client
        })
        .catch((err) => {
          console.log(err);
          // res.status(500).send(err)
        });
    },
    obteniendoDatosDeOrdenPaypal: async (id) => {
      return get_access_token()
        .then((access_token) => {
          return fetch(endpoint_url + `/v2/checkout/orders/${id}`, {
            //https://developer.paypal.com/docs/api/orders/v2/#orders_create
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          })
            .then((res) => res.json())
            .then((json) => {
              // console.log(json);
              return json;
            })
            .catch((err) => {
              console.log(err);
              // res.status(500).send(err)
            }); //Send minimal data to client
        })
        .catch((err) => {
          console.log(err);
          // res.status(500).send(err)
        });
    },
    captureOrder: async (id) => {
      // console.log(req)
      // console.log(req.query)
      const response = await axios
        .post(
          // `https://api.sandbox.paypal.com/v2/checkout/orders/${id}`,
          `https://api-m.sandbox.paypal.com/v2/checkout/orders/${id}/capture`,
          {},
          {
            auth: {
              username:
                "AbjQ-Z9p5vQaaShPBQBnsknEEuheNALn1TdvpO2F3xR33pZQPGroW3yG9M6DLIrjw-gQl_vrUm-j7uvQ",
              password:
                "EAozjCCyTLZ9aN1tVMhIle_a-IjzmzjH5HwdUSxZskqbv1j5mM-dFbkoCiVuDiX6is0OR-icI6pJhk1z",
            },
          }
        )
        .catch((error) => console.log(error));
      // console.log(token,PayerID);
      const { data } = response;
      const { status } = data;
      let pay = await PaypalCollection.findOne({ idOrder: id });
      let userId = pay.userId;
      await PaypalCollection.update(pay._id, {
        $set: { status: status, data },
      });
      const compras = await CarritoCollection.find({ idUser: userId }, { sort: { idTienda: 1 } }).fetch();
      const idTiendas = [...new Set(compras.map(compra => compra.idTienda))];



      idTiendas.forEach((idTienda) => {
        const comprasEnCarrito = compras.filter(
          (compra) => compra.idTienda === idTienda
        );
            // console.log(comprasEnCarrito);
            // comprasEnCarrito.map((compra) => {
            //  console.log(compra);
            // })
            Meteor.call("addVenta",userId,comprasEnCarrito,"",pay._id,(error,idResult)=>console.log(`Venta agregada con id: ${idResult}`));
      })


      return data;
    },
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
    addVenta: async (idUser, comprasEnCarrito, comentario, idPaypal) => {
      try {
        let cobroEntrega = await Meteor.settings.public.cobroEntrega;
        
        await comprasEnCarrito.forEach((carrito) => {
          CarritoCollection.remove(carrito._id);
        });
        
        const id = await VentasCollection.insert({
          idUser,
          comprasEnCarrito: comprasEnCarrito,
          status: "PREPARANDO",
          cobroEntrega,
          comentario,
          idPaypal,
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
      Meteor.users.update(Meteor.userId(), {
        $set: { cordenadas: cordenadas },
      });
    },
  });
}
