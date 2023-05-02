import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const Home = () => <h1>¡Bienvenido a mi sitio web!</h1>;
const About = () => <h1>¡Acerca de mí!</h1>;
const Contact = () => <h1>¡Contáctame!</h1>;

const App = () => (
  <Router>
    <Route exact path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/contact" component={Contact} />
  </Router>
);

export default App;