import React from 'react';

const Marker = ({ text }) => (
  <div
    style={{
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
      top: '50%',
      left: '50%',
      background: 'white',
      padding: '5px',
      borderRadius: '50%',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
      fontWeight: 'bold',
    }}
  >
    {text}
  </div>
);

export default Marker;