import { Meteor } from "meteor/meteor";
import {
  OnlineCollection,
  TiendasCollection,
  PedidosAsignadosCollection,
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
          await TiendasCollection.find({}).forEach((tienda, index) => {
            OnlineCollection.rawCollection().distinct(
              "userId",
              {
                address: {
                  $ne: "127.0.0.1",
                },
              },
              function (err, userIds) {

                userIds.forEach(async (cadeteId) => {
                  ///////aqui solo da los usuarios conectados una sola ves, si el campo userId se repite, solo va a dar una sola conexion

                  let cadete = await Meteor.users.findOne(cadeteId);
                  let coordenadasCadete =
                    cadete && cadete.cordenadas && cadete.cordenadas;

                  if (coordenadasCadete) {
                    await Meteor.call(
                      "calcularDistancia",
                      coordenadasCadete.latitude,
                      coordenadasCadete.longitude,
                      tienda.coordenadas.latitude,
                      tienda.coordenadas.longitude,
                      (error, distancia) => {
                        if (distancia <= Meteor.settings.public.KMDEUSUARIOSCERCA) {
                          Meteor.call("agregarCadeteAColaPorTienda", tienda._id, cadeteId)
                         //OBTENIENDO UNA VENTA QUE NO ESTE ASIGNADA
                        let venta = VentasCollection.findOne({
                          "producto.idTienda": tienda._id,
                          cadeteid:  null,
                          status: "PREPARANDO"
                        });


                         // INSERTAR CODIGO DE USUARIOS CERCA A LA TIENDA
                         venta && Meteor.call(
                           "asignarVentasACadetes",
                           venta._id,
                           cadete._id,
                           (error, idVentAsignada)=>{
                            error
                              ? console.log(error)
                              : console.log(
                                  "venta asignada al cadete:",
                                  cadete.username,
                                  "con ID:",
                                  idVentAsignada
                                );
                            
                            ;
                            

                           }
                         );
                          console.log(
                            "usuario",
                            cadete.username,
                            "esta a",
                            distancia,
                            "KM",
                            "de la tienda",
                            tienda.title
                          );
                        }
                      }
                    );
                  }
                });
               


              }
            );
          });
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
