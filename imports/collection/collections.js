import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import { Meteor } from "meteor/meteor";

SimpleSchema.extendOptions(["autoform"]);

export const OnlineCollection = new Mongo.Collection("online");
export const MensajesCollection = new Mongo.Collection("mensajes");
export const LogsCollection = new Mongo.Collection("Logs");
export const PreciosCollection = new Mongo.Collection("precios");
export const VentasCollection = new Mongo.Collection("ventas");
export const VersionsCollection = new Mongo.Collection("versions");
export const TiendasCollection = new Mongo.Collection("tiendas");
export const ProductosCollection = new Mongo.Collection("productos");
export const PedidosAsignadosCollection = new Mongo.Collection("pedidosAsignados");
export const ColaCadetesPorTiendasCollection = new Mongo.Collection("colacadetesxtiendas");

import { FilesCollection } from "meteor/ostrio:files";

export const ImagesCollection = new FilesCollection({
  collectionName: "Images",
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }
    return "Please upload image, with size equal or less than 10MB";
  },
});
if (Meteor.isClient) {
  Meteor.subscribe("files.images.all");
}

if (Meteor.isServer) {
  Meteor.publish("files.images.all", function () {
    return ImagesCollection.find().cursor;
  });
}

//////////////SCHEMAS////////////////////
export const SchemaProductosCollection = new SimpleSchema({
  idTienda: {
    type: String,
    optional: false,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
    optional: false,
  },
  name: {
    type: String,
    defaultValue: "",
    optional: false,
  },
  descripcion: {
    type: String,
    defaultValue: "",
    optional: false,
  },
  count: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  productoDeElaboracion: {
    type: Boolean,
    defaultValue: false,
    optional: false,
  },
  precio: {
    type: Number,
    defaultValue: 1,
    optional: false,
  },
  comentario: {
    type: String,
    optional: true,
  },
});

ProductosCollection.attachSchema(SchemaProductosCollection);

export const SchemaColaCadetesPorTiendasCollection = new SimpleSchema({
  idTienda: {
    type: String,
    optional: false,
  },
  cadeteId: {
    type: String,
    defaultValue: "",
    optional: false,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
    optional: false,
  }
  
});

ColaCadetesPorTiendasCollection.attachSchema(SchemaColaCadetesPorTiendasCollection);


export const SchemaPedidosAsignadosCollection = new SimpleSchema({
  idVentas: {
    type: String,
    optional: false,
  },
  userId: {
    type: String,
    defaultValue: "",
    optional: false,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
    optional: false,
  },
  entregado: {
    type: Boolean,
    defaultValue: false,
    optional: true,
  },
  
});

PedidosAsignadosCollection.attachSchema(SchemaPedidosAsignadosCollection);

export const SchemaTiendasCollection = new SimpleSchema({
  coordenadas: {
    type: Object,
    optional: false,
  },
  "coordenadas.latitude": {
    type: Number,
    optional: false,
  },
  "coordenadas.longitude": {
    type: Number,
    optional: false,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
    optional: false,
  },
  title: {
    type: String,
    defaultValue: "",
    optional: false,
  },
  descripcion: {
    type: String,
    defaultValue: "",
    optional: false,
  },
  pinColor: {
    type: String,
    defaultValue: "green",
    optional: true,
  },
  comentario: {
    type: String,
    optional: true,
  },
  idUser: {
    type: String,
    optional: false,
  },
});

TiendasCollection.attachSchema(SchemaTiendasCollection);

export const SchemaVentasCollection = new SimpleSchema({
  idUser: {
    type: String,
    optional: false,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
    optional: false,
  },
  cantidad: {
    type: Number,
    defaultValue: 1,
    optional: false,
  },
  status: {
    type: String,
    defaultValue: "PREPARANDO" || "CADETEENLOCAL" || "ENCAMINO" || "CADETEENDESTINO" || "ENTREGADO",
    optional: false,
  },
  idProducto: {
    type: String,
    optional: true,
  },
  producto: {
    type: SchemaProductosCollection,
    // defaultValue: {},
    optional: false,
  },
  idTienda: {
    type: String,
    optional: true,
  },
  tienda:{
    type: SchemaTiendasCollection,
    // defaultValue: {},
    optional: false,
  },
  comentario: {
    type: String,
    optional: true,
  },
  recogidaEnLocal:{
    type: Boolean,
    // defaultValue: false,
    optional: false,
  },
  cobroEntrega:{
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  cadeteid:{
    type: String,
    defaultValue: null,
    optional: true
  }
});

VentasCollection.attachSchema(SchemaVentasCollection);

export const SchemaPreciosCollection = new SimpleSchema({
  userId: {
    type: String,
    optional: false,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
    optional: false,
  },
  precio: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  type: {
    type: String,
    optional: false,
  },
  megas: {
    type: Number,
    defaultValue: 0,
    optional: true,
  },
  heredaDe: {
    type: String,
    optional: true,
    defaultValue: null,
  },
  comentario: {
    type: String,
    optional: true,
  },
  detalles: {
    type: String,
    optional: true,
  },
});

PreciosCollection.attachSchema(SchemaPreciosCollection);

export const SchemaLogsCollection = new SimpleSchema({
  type: {
    type: String,
  },
  userAdmin: {
    type: String,
  },
  userAfectado: {
    type: String,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
  },
});

LogsCollection.attachSchema(SchemaLogsCollection);

export const SchemaOnlineCollection = new SimpleSchema({
  address: {
    type: String,
  },
  connectionId: {
    type: String,
    optional: true,
  },
  userId: {
    type: String,
    optional: true,
  },
  loginAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
    optional: true,
  },
  hostname: {
    type: String,
    optional: true,
  },
});

OnlineCollection.attachSchema(SchemaOnlineCollection);

export const SchemaMensajesCollection = new SimpleSchema({
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  mensaje: {
    type: String,
    optional: true,
  },
  leido: {
    type: Boolean,
    defaultValue: false,
    optional: true,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    },
  },
  type: {
    type: String,
    defaultValue: "text",
    optional: true,
  },
});

MensajesCollection.attachSchema(SchemaMensajesCollection);

////////////////////PERMISOS//////////////
ProductosCollection.allow({
  insert(doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update() {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});
LogsCollection.allow({
  insert(doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update() {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});

OnlineCollection.allow({
  insert(doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update() {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return true;
  },
});

Meteor.users.allow({
  insert(doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});
VentasCollection.allow({
  insert(doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});
MensajesCollection.allow({
  insert(doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return true;
  },
});

PreciosCollection.allow({
  insert(userId, doc) {
    // The user must be logged in and the document must be owned by the user.
    return true;
  },

  update(userId, doc, fields, modifier) {
    // Can only change your own documents.
    return true;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return Meteor.users.findOne({ _id: userId }).profile.role == "admin";
  },
});

///////////////METODOS/////////////////
Meteor.methods({
  async exportDataTo(urlMongoDB) {
    var mi = require("mongoimport");

    try {
      await mi({
        fields: MensajesCollection.find().fetch(), // {array} data to import
        db: "meteor", // {string} name of db
        collection: "mensajes", // {string|function} name of collection, or use a function to
        //  return a name, accept one param - [fields] the fields to import
        host: urlMongoDB,
        callback: (err, db) => {
          err && console.error(err);
        },
      });
    } catch (error) {
      console.log(error);
    }

    try {
      await mi({
        fields: LogsCollection.find().fetch(), // {array} data to import
        db: "meteor", // {string} name of db
        collection: "Logs", // {string|function} name of collection, or use a function to
        //  return a name, accept one param - [fields] the fields to import
        host: urlMongoDB,
        callback: (err, db) => {
          err && console.error(err);
        },
      });
    } catch (error) {
      console.log(error);
    }

    try {
      await mi({
        fields: PreciosCollection.find().fetch(), // {array} data to import
        db: "meteor", // {string} name of db
        collection: "precios", // {string|function} name of collection, or use a function to
        //  return a name, accept one param - [fields] the fields to import
        host: urlMongoDB,
        callback: (err, db) => {
          err && console.error(err);
        },
      });
    } catch (error) {
      console.log(error);
    }

    try {
      await mi({
        fields: VentasCollection.find().fetch(), // {array} data to import
        db: "meteor", // {string} name of db
        collection: "ventas", // {string|function} name of collection, or use a function to
        //  return a name, accept one param - [fields] the fields to import
        host: urlMongoDB,
        callback: (err, db) => {
          err && console.error(err);
        },
      });
    } catch (error) {
      console.log(error);
    }

    try {
      await mi({
        fields: Meteor.users.find().fetch(), // {array} data to import
        db: "meteor", // {string} name of db
        collection: "users", // {string|function} name of collection, or use a function to
        //  return a name, accept one param - [fields] the fields to import
        host: urlMongoDB,
        callback: (err, db) => {
          err && console.error(err);
        },
      });
    } catch (error) {
      console.log(error);
    }
  },
});
