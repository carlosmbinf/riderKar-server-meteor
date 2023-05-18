import { Meteor } from "meteor/meteor";
import {
  OnlineCollection,
  TiendasCollection,
  PedidosAsignadosCollection,
  CarritoCollection,
  VentasCollection,
} from "../imports/collection/collections";

var cron = require("node-cron");

if (Meteor.isServer) {
  console.log("Cargando Tareas...");

  try {
    cron
      .schedule(
        // "1-59 * * * *",
        "*/5 * * * * *",
        async () => {
          // await console.log("buscando riders cerca");
         let tiendas =  TiendasCollection.find({}).fetch()
         let userIds =  ["JGn9Zy4aSsA6K8hjp"]
        //  await OnlineCollection.rawCollection().distinct(
        //   "userId",
        //   {
        //     address: {
        //       $ne: "127.0.0.1",
        //     },
        //   })

          for (let index = 0; index < tiendas.length; index++) {
            console.log("Tienda",index);
          
            // for (let index2 = 0; index2 < userIds.length; index2++) {
            //   let cadete = await Meteor.users.findOne(userIds[index2]);
            //   let coordenadasCadete =
            //     cadete && cadete.cordenadas && cadete.cordenadas;

            //     console.log("Prueba",index);
              
            // }
            for (let index2 = 0; index2 < userIds.length; index2++) {
                  ///////aqui solo da los usuarios conectados una sola ves, si el campo userId se repite, solo va a dar una sola conexion

                  let cadete = await Meteor.users.findOne(userIds[index2]);
                  let coordenadasCadete =
                    cadete && cadete.cordenadas && cadete.cordenadas;


                  if (coordenadasCadete) {
                   let distancia = await Meteor.call(
                      "calcularDistancia",
                      coordenadasCadete.latitude,
                      coordenadasCadete.longitude,
                      tiendas[index].coordenadas.latitude,
                      tiendas[index].coordenadas.longitude)
                        if (
                          distancia <= Meteor.settings.public.KMDEUSUARIOSCERCA
                        ) {
                           Meteor.call(
                            "agregarCadeteAColaPorTienda",
                            tiendas[index]._id,
                            userIds[index2]
                          );
                          //OBTENIENDO UNA VENTA QUE NO ESTE ASIGNADA
                          let venta = await  VentasCollection.findOne({
                            "comprasEnCarrito.producto.idTienda": tiendas[index]._id,
                            cadeteid: null,
                            status: "PREPARANDO",
                          });

                          // console.log(venta._id,"Con ID", tienda._id);

                          // INSERTAR CODIGO DE USUARIOS CERCA A LA TIENDA
                          let idVentAsignada = 
                          venta && await Meteor.call(
                              "asignarVentasACadetes",
                              venta._id,
                              cadete._id
                           )
                           idVentAsignada &&   console.log(
                                    "venta asignada al cadete:",
                                    cadete.username,
                                    "con ID:",
                                    idVentAsignada
                                  );
                              
                          console.log(
                            "usuario",
                            cadete.username,
                            "esta a",
                            distancia,
                            "KM",
                            "de la tienda",
                            tiendas[index].title
                          );
                        }
                      
                  }
                  console.log("Prueba",index);

                };
              
          };
          // await console.log("busqueda terminada");
        },
        {
          scheduled: true,
          timezone: "America/Havana",
        }
      )
      .start();
  } catch (error) {
    console.log(error);
  }
}
