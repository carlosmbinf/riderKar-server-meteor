import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const Formulario = () => {
//   const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Nombre: ${email}, Correo electrónico: ${password}`);
    Meteor.loginWithPassword(email,password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label='Correo Electrónico'
        type='email'
        variant='outlined'
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        margin='normal'
        fullWidth
      />
      <TextField
        label='Password'
        type='password'
        variant='outlined'
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        margin='normal'
        fullWidth
      />
      <Button variant='contained' color='primary' type='submit'>
        Enviar
      </Button>
    </form>
  );
}

export default Formulario;