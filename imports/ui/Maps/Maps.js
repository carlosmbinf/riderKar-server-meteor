import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { CarritoCollection } from "/imports/collection/collections";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

import { connect } from 'react-redux';


// Acción para modificar la coordenada
const updateCoordinate = (coordinate) => ({
  type: 'UPDATE_COORDINATE',
  payload: coordinate,
});


const containerStyle = {
  width: "100%",
  minHeight: "400px",
};


const markers = [
  {
    id: 1,
    position: { lat: -34.7749, lng: -56.3194 },
  },
  {
    id: 2,
    position: { lat: 37.7596, lng: -122.427 },
  },
  {
    id: 3,
    position: { lat: 37.7749, lng: -122.4294 },
  },
];

function Mapa({ coordinate, updateCoordinate }) {
  const [center, setCenter] = useState(coordinate?coordinate:{ lat: -34.7749, lng: -56.3194 })
  const [posicion,setPosicion] = useState()
  const [ready,setReady] = useState(false)
  
 

  const handleMarkerClick = (marker) => {
    console.log("Marker clicked:", marker);
    // Handle your marker click logic here
  };

  useEffect(()=>{
    setReady(false)
    coordinate && setReady(true)
  },[coordinate])

  const  compras  = useTracker(() => {
    Meteor.subscribe("carrito", { idUser: Meteor.userId() });

    const compras = CarritoCollection.find({ idUser: Meteor.userId() }, { sort: { idTienda: 1 } }).fetch();

    return  compras ;
  });


  const cambiarCoordenadas =  (coordenadas) =>{
    setCenter(coordenadas)

    updateCoordinate(coordenadas)

    setPosicion(coordenadas);

    //sacar _id de la compra y actualizar la coordenada
    let listId = compras ? compras.map(compra=>compra._id) : [];

    compras && listId.forEach(id=>{
      CarritoCollection.update(id, {
        $set: {
          coordenadas: { latitude: coordenadas.lat, longitude: coordenadas.lng },
        },
      });
    });
    
    console.log("Coordenadas",coordinate);
  // await  compras.forEach(compra=>{
  //     CarritoCollection.update(compra._id, {
  //       $set: { coordenadas: coordenadas },
  //     });
  //   })
  }


  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      clickableIcons={false}
      center={center}
      zoom={17}
      onClick={({ latLng }) => cambiarCoordenadas(latLng.toJSON())}
      onLoad={(map) => map && console.log(map)}
    >
      {ready && (
        <Marker
          position={coordinate}
          title="Hola"
          visible={true}
          draggable={true}
          onDragEnd={({latLng}) => cambiarCoordenadas(latLng.toJSON())}
          onClick={() => handleMarkerClick(posicion)}
        />
      )}
    </GoogleMap>
  );
}


// Función para mapear el estado de Redux a las props del componente
const mapStateToProps = (state) => ({
  coordinate: state.coordinate, // Asumiendo que la coordenada está almacenada en el estado global como 'coordinate'
});

// Conectar el componente Map a Redux y agregar la acción para modificar la coordenada
const ConnectedMap = connect(mapStateToProps, { updateCoordinate })(Mapa);

export default ConnectedMap;
