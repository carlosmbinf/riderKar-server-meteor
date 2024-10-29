// Acción para modificar la coordenada
const updateCoordinate = (coordinate) => ({
    type: 'UPDATE_COORDINATE',
    payload: coordinate,
  });
  const updateIdPaypal = (idPaypal) => ({
    type: 'UPDATE_IDPAYPAL',
    payload: idPaypal,
  });
  const updatePrecioTotal = (precioTotal) => ({
    type: 'UPDATE_PRECIOTOTAL',
    payload: precioTotal,
  });
  
  export { updateCoordinate, updateIdPaypal, updatePrecioTotal };