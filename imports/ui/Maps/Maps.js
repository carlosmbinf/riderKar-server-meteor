import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import CustomMarker from './CustomMarker';
import Marker from './CustomMarker';

function Mapa() {
  const [clienteUbicacion, setClienteUbicacion] = useState(null);
  const [seleccionUbicacion, setSeleccionUbicacion] = useState(null);

  const handleMapClick = (event) => {
    const latitud = event.lat;
    const longitud = event.lng;
    setSeleccionUbicacion({ latitud, longitud });
    console.log(latitud, longitud);
  };

  const handleMarkerClick = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitud = position.coords.latitude;
      const longitud = position.coords.longitude;
      setClienteUbicacion({ latitud, longitud });
    }, (error) => {
      console.error('Error al obtener la ubicación del cliente:', error);
    });
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <GoogleMapReact
        onClick={handleMapClick}
        defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
        defaultZoom={12}
      >
        {seleccionUbicacion && (
          <CustomMarker
            lat={seleccionUbicacion.latitud}
            lng={seleccionUbicacion.longitud}
            text="Ubicación seleccionada"
          />
        )}

        {clienteUbicacion && (
          <Marker
          lat={37.7749}
          lng={-122.4194}
          text="Marcador personalizado"
        />
        )}
      </GoogleMapReact>
    </div>
  );
}

export default Mapa;