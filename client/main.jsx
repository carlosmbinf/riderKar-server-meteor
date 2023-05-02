import React from "react";
import { createRoot } from "react-dom/client";
import { Meteor } from "meteor/meteor";
import { MyProtectedPage } from "/imports/ui/Home/MyHomeProtected";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Formulario from "/imports/ui/login/Login";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="*" element={<MyProtectedPage />}/>
  )
);

Meteor.startup(() => {
  const container = document.getElementById("react-target");
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
});
