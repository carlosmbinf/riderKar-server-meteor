import { Meteor } from "meteor/meteor";
import { WebApp } from "meteor/webapp";
import bodyParser from "body-parser";


import router from "router";
const endpoint = router();




import express from 'express';

const app = express();




if (Meteor.isServer) {


  app.get("/getuser", (req, res) => {
    // console.log(req)
    // console.log(req.query.idPeli)
    // res.setHeader('Content-Type', 'text/plain; charset=utf-8')

    //   res.end(req.query.idPeli);

    let user = Meteor.users.findOne({});
    // res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Content-Type', 'application/json')

    router().
    res.end(user ? JSON.stringify(user) : "");

});

app.get("/capture-order", async (req, res) => {
  // console.log(req)
  const { token, PayerID } = req.query;
  // console.log(req.query)
  Meteor.call("captureOrder", token, function (error, success) {
    if (error) {
      console.log("error", error);
    }
    if (success) {
      console.log(success);
      // res.end("ORDEN CAPTURADA");
      res.redirect("/products");
    }
  });
});

  WebApp.connectHandlers.use(bodyParser.urlencoded({ extended: true }));
  WebApp.connectHandlers.use(app);

}