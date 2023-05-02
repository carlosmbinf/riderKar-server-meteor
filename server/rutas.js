import { Meteor } from "meteor/meteor";
import { WebApp } from "meteor/webapp";
import bodyParser from "body-parser";

import router from "router";
const endpoint = router();

if (Meteor.isServer) {

endpoint.get("/getuser", (req, res) => {
    // console.log(req)
    // console.log(req.query.idPeli)
    // res.setHeader('Content-Type', 'text/plain; charset=utf-8')

    //   res.end(req.query.idPeli);

    let user = Meteor.users.findOne({});
    // res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Content-Type', 'application/json')

    res.end(user ? JSON.stringify(user) : "");

});

  WebApp.connectHandlers.use(bodyParser.urlencoded({ extended: true }));
  WebApp.connectHandlers.use(endpoint);

}