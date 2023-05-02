import { Meteor } from "meteor/meteor";
import { ColaCadetesPorTiendasCollection, OnlineCollection } from "/imports/collection/collections";


    if (Meteor.isServer) {
        Meteor.startup(() => {
            console.log("Iniciando Server Meteor...");

            /////// mover todas las imagenes para user.picture
            Meteor.users.find({}).map(us => {
              us.services && us.services.facebook && us.services.facebook.picture.data.url &&
                Meteor.users.update(us._id, { $set: { picture: us.services.facebook.picture.data.url } })
        
                us.services && us.services.google && us.services.google.picture &&
                Meteor.users.update(us._id, { $set: { picture: us.services.google.picture } })
            })
        
        
            process.env.ROOT_URL = Meteor.settings.public.ROOT_URL;
            // process.env.MONGO_URL = Meteor.settings.public.MONGO_URL;
        
            console.log("ROOT_URL: " + process.env.ROOT_URL);
            console.log("MONGO_URL: " + process.env.MONGO_URL);
        
            OnlineCollection.remove({});
            ColaCadetesPorTiendasCollection.remove({});
           // OnlineCollection.remove({address: `127.0.0.1`});
        
           const settings = Meteor.settings;
        
           if (settings) {
           
            ServiceConfiguration.configurations.remove({
              service: 'google'
            });
          
            ServiceConfiguration.configurations.insert({
              service: 'google',
              clientId: settings.google.client_id,
              secret: settings.google.client_secret,
              validClientIds: settings.google.validClientIds
            });
          
              ServiceConfiguration.configurations.remove({
                service: "facebook",
              });
          
              ServiceConfiguration.configurations.insert({
                service: "facebook",
                appId: settings.facebook.appId,
                secret: settings.facebook.secret,
              });
        
        
        
          }
            if (Meteor.users.find({ "profile.role": "admin" }).count() == 0) {
              console.log("CREANDO USER ADMIN");
              let profile = {
                firstName: "Carlos",
                lastName: "Medina",
                baneado: false,
                creadoPor: "Server",
                role: ["admin"],
              }
              const user = {
                email: "carlosmbinf@gmail.com",
                password: "lastunas123",
                username:"carlosmbinf",
                profile
              };

              try {
                Accounts.createUser(user);
                console.log("ADD OK");
              } catch (error) {
                console.log("NO SE PUDO CREAR EL USER ADMIN");
              }
            }
            console.log("YA HAY UN USER ADMIN");
            // const youtubedl = require('youtube-dl')
            // const url = 'http://www.youtube.com/watch?v=WKsjaOqDXgg'
            // youtubedl.exec(url, ['-x', '--audio-format', 'mp3'], {}, function(err, output) {
            //   if (err) throw err
            //   // console.log(output.join('\n'))
            // })
          });




          

  Meteor.onConnection(function (connection) {
    OnlineCollection.insert({
      _id: connection.id,
      address: connection.clientAddress,
    });

    connection.onClose(function () {
      OnlineCollection.remove(connection.id);
    });
  });

  Accounts.onLogin(function (info) {
    var connectionId = info.connection.id;
    var user = info.user;
    var userId = user._id;

    OnlineCollection.update(connectionId, {
      $set: {
        userId: userId,
        loginAt: new Date(),
      },
    });
    // Meteor.users.update(userId, {
    //   $set: {
    //     online: true,
    //   },
    // });
  });

  Accounts.onLogout(function (info) {
    let userid = OnlineCollection.findOne(connectionId).userId
    Meteor.call("reiniciarColaCadeteAllTiendas",userid) 

    
    var connectionId = info.connection.id;
    OnlineCollection.update(connectionId, {
      $set: {
        userId: "",
      },
    });
    // Meteor.users.update(info.user._id, {
    //   $set: {
    //     online: false,
    //   },
    // });
  });

  Accounts.onCreateUser(function (options, user) {
    // console.log("options > " + JSON.stringify(options))
    // console.log("user > " + JSON.stringify(user))
    if (user.services.facebook) {
  
      //  user.username = user.services.facebook.name;
      // let usuario =  Meteor.users.findOne({ "services.facebook.name": user.services.facebook.name })
      let usuario = user.services.facebook.email ? Meteor.users.findOne({ "emails.address": user.services.facebook.email }) : Meteor.users.findOne({ "services.facebook.first_name": user.services.facebook.first_name, "services.facebook.last_name": user.services.facebook.last_name })
  
      usuario ?
        (console.log(`Usuario de FACEBOOK ${usuario._id} actualizado`),
          usuario.services.facebook = user.services.facebook,
          user = usuario,
          user.profile = {
            firstName: user.services.facebook.first_name,
            lastName: user.services.facebook.last_name,
            name: user.services.facebook.name,
            role: user.profile.role,
          },
          user.picture = user.services.facebook.picture.data.url,
      Meteor.users.remove(usuario._id)
  
        )
        : (console.log(`Usuario de FACEBOOK ${user._id} Creado`),
          (user.emails = [{ address: user.services.facebook.email }]),
          (user.profile = {
            firstName: user.services.facebook.first_name,
            lastName: user.services.facebook.last_name,
            name: user.services.facebook.name,
            role: ["client"],
          }),
          (user.creadoPor = "Facebook"),
          (user.baneado = true),
          (user.picture = user.services.facebook.picture.data.url)
          );
  
      return user;
  
    } else if (user.services.google) {
      //  user.username = user.services.facebook.name;
  
      let usuario = user.services.google.email && Meteor.users.findOne({ "emails.address": user.services.google.email })
      usuario ?
        (console.log(`Usuario de GOOGLE ${usuario._id} actualizado`),
          usuario.services.google = user.services.google,
          user = usuario,
          user.profile = {
            firstName: user.services.google.given_name,
            lastName: user.services.google.family_name,
            name: user.services.google.name,
            role: user.profile.role,
          },
          user.picture = user.services.google.picture,
          Meteor.users.remove(usuario._id)       
          )
        : (console.log(`Usuario de GOOGLE ${user._id} Creado`),
          (user.emails = [{ address: user.services.google.email }]),
          (user.profile = {
            firstName: user.services.google.given_name,
            lastName: user.services.google.family_name,
            name: user.services.google.name,
            role: ["client"],
          }),
          (user.creadoPor = "Google"),
          (user.baneado = true),
          (user.picture = user.services.google.picture));
      return user;
  
    } else {
      const profile = {
        firstName: options.profile.firstName,
        lastName: options.profile.lastName,
        role: options.profile.role,
      };
  
      // user.username = options.firstName + options.lastName
      user.profile = profile;
      user.creadoPor = options.creadoPor;
      user.baneado = true;
      // console.log(`user: \n${JSON.stringify(user)}\n-----------------------\n`)
      // console.log(`options: \n${JSON.stringify(options)}\n-----------------------\n`)

      return user;
    }
  
  });

  Meteor.users.after.insert(function (userId, doc) {
    // console.log(userId);
    console.log(`Usuario Creado con id => ${doc._id}`);
  });

  
    }