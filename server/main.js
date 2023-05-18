import { Meteor } from 'meteor/meteor';
import "./publicaciones"

import "./rutas"
import "./metodos"
import "./startup"
import "./tareas"
import { ImagesCollection } from '/imports/collection/collections';


if (Meteor.isServer) {
Meteor.startup(() => {

    const archivosWithoutData = ImagesCollection.find({});
    if (archivosWithoutData.count() > 0) {
      archivosWithoutData.forEach((archivo) => {
        if (!ImagesCollection.findOne({_id: archivo._id}).link()) {
          console.log(`"${archivo.name}" no encontrado en el servidor`);
          ImagesCollection.remove({_id: archivo._id});
        }
      });
    }


    if (Meteor.isClient) {
        Meteor.subscribe("files.images.all");
      }
      
      if (Meteor.isServer) {
        Meteor.publish("files.images.all", function () {
          return ImagesCollection.find().cursor;
        });
      }
});
}