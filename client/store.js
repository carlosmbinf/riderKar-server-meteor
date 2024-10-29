import { createStore } from 'redux';

// Definir el estado inicial
const initialState = {
  coordinate: null,
  idPaypal: null,
  precioTotalRedux: null
};

// Definir el reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_COORDINATE':
      return {
        ...state,
        coordinate: action.payload,
      };
      case 'UPDATE_IDPAYPAL':
      return {
        ...state,
        idPaypal: action.payload,
      };
      case 'UPDATE_PRECIOTOTAL':
      return {
        ...state,
        precioTotal: action.payload,
      };
      
    default:
      return state;
  }
};

// Crear el store
const store = createStore(reducer);

export default store;