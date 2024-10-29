import { Meteor } from "meteor/meteor";
import {
    OnlineCollection,
    MensajesCollection,
    PreciosCollection,
    CarritoCollection,
    VersionsCollection,
    LogsCollection,
    TiendasCollection,
    ProductosCollection,
    ColaCadetesPorTiendasCollection,
    PedidosAsignadosCollection,
    ImagesCollection,
    VentasCollection,
    PaypalCollection
  } from "../imports/collection/collections";

if (Meteor.isServer) {
    console.log("Cargando Publicaciones...");


    Meteor.publish("logs", function (selector,option) {
        return LogsCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("logsId", function (id) {
        return LogsCollection.find({ userAfectado: id });
      });
   
      Meteor.publish("user", function (selector,option) {
        return Meteor.users.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("userID", function (id) {
        return Meteor.users.find({ _id: id });
      });
      Meteor.publish("userRole", function (role) {
        return Meteor.users.find({ "profile.role": role });
      });
      Meteor.publish("conexionesUser", function (id) {
        return OnlineCollection.find({ userId: id });
      });
      Meteor.publish("conexiones", function (selector,option) {
        return OnlineCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("mensajes", function (selector,option) {
        return MensajesCollection.find(selector?selector:{},option?option:{});
      });
      
      Meteor.publish("precios", function (selector,option) {
        return PreciosCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("ventas", function (selector,option) {
        return VentasCollection.find(selector?selector:{},option?option:{});
      });
    
      Meteor.publish("versions", function (selector,option) {
        return VersionsCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("tiendas", function (selector,option) {
        return TiendasCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("productos", function (selector,option) {
        return ProductosCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("colacadetesxtiendas", function (selector,option) {
        return ColaCadetesPorTiendasCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("pedidosAsignados", function (selector,option) {
        return PedidosAsignadosCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("images", function (selector,option) {
        return ImagesCollection.find(selector?selector:{},option?option:{}).cursor;
      });
      Meteor.publish("carrito", function (selector,option) {
        return CarritoCollection.find(selector?selector:{},option?option:{});
      });
      Meteor.publish("paypal", function (selector,option) {
        return PaypalCollection.find(selector?selector:{},option?option:{});
      });
      
}