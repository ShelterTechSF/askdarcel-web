import React from 'react';
import GoogleMap from 'google-map-react';



const AnyReactComponent = ({ text }) => <div>{text}</div>;

const MapTest = ({hit}) => {
return (
    <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMap
          bootstrapURLKeys={{ key: CONFIG.GOOGLE_API_KEY }}
          defaultCenter={{lat: 37.7749, lng: -122.4194}}
          defaultZoom={11}
        >
          <AnyReactComponent
            lat={59.955413}
            lng={30.337844}
            text={'Kreyser Avrora'}
          />
        </GoogleMap>
      </div>
  );
}

export default MapTest;