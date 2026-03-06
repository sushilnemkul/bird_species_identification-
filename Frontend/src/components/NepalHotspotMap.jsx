import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { getCoordinatesFromHotspots, REGIONS } from '../utils/geoData';

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '400px',
  borderRadius: '1rem',
};

// Nepal center point approximation
const NEPAL_CENTER = {
  lat: 28.3949,
  lng: 84.1240
};

const REGION_COLORS = {
    [REGIONS.MOUNTAIN]: "blue",
    [REGIONS.HILLY]: "green",
    [REGIONS.TERAI]: "orange",
    [REGIONS.URBAN]: "purple"
};

const NepalHotspotMap = ({ hotspotsString, apiKey }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  const [activeMarker, setActiveMarker] = useState(null);
  
  const markers = useMemo(() => getCoordinatesFromHotspots(hotspotsString), [hotspotsString]);

  if (loadError) {
    return (
        <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-2xl text-red-500 p-8 text-center">
            Failed to load Google Maps. Please check your API key configuration.
        </div>
    );
  }

  if (!isLoaded) {
    return (
        <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-2xl animate-pulse">
            <span className="text-gray-400 font-medium">Loading map...</span>
        </div>
    );
  }

  // Calculate dynamic center or fallback to Nepal
  const center = markers.length > 0 
    ? { lat: markers[0].lat, lng: markers[0].lng } 
    : NEPAL_CENTER;

  // Zoom tighter if there's only 1 point, otherwise zoom out to see country
  const zoom = markers.length === 1 ? 9 : 6;

  // Render a custom URL for the marker pin based on region color
  const getMarkerIcon = (region) => {
      const color = REGION_COLORS[region] || "red";
      return `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`;
  };

  return (
    <GoogleMap
      mapContainerStyle={MAP_CONTAINER_STYLE}
      center={center}
      zoom={zoom}
      options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
      }}
    >
      {markers.map((marker, index) => (
        <Marker
          key={`${marker.name}-${index}`}
          position={{ lat: marker.lat, lng: marker.lng }}
          icon={getMarkerIcon(marker.region)}
          onClick={() => setActiveMarker(marker)}
        />
      ))}

      {activeMarker && (
        <InfoWindow
          position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
          onCloseClick={() => setActiveMarker(null)}
        >
          <div className="p-2 max-w-[200px]">
            <h4 className="font-bold text-gray-800 text-sm mb-1">{activeMarker.name}</h4>
            <span className="inline-block px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded-full border border-gray-200">
                {activeMarker.region} Region
            </span>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

NepalHotspotMap.propTypes = {
  hotspotsString: PropTypes.string,
  apiKey: PropTypes.string.isRequired
};

export default NepalHotspotMap;
