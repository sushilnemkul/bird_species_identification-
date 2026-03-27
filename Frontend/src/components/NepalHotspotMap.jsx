import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getCoordinatesFromHotspots } from '../utils/geoData';
import L from 'leaflet';

// Import default Leaflet markers so Vite bundles them correctly
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '400px',
  borderRadius: '1rem',
  zIndex: 1, // Prevent overlap issues with other UI elements
};

// Nepal center point approximation
const NEPAL_CENTER = [28.3949, 84.1240];

const NepalHotspotMap = ({ hotspotsString }) => {
  const markers = useMemo(() => getCoordinatesFromHotspots(hotspotsString), [hotspotsString]);

  // Calculate dynamic center or fallback to Nepal
  const center = markers.length > 0 
    ? [markers[0].lat, markers[0].lng] 
    : NEPAL_CENTER;

  // Zoom tighter if there's only 1 point, otherwise zoom out to see country
  const zoom = markers.length === 1 ? 9 : 6;

  return (
    <div style={MAP_CONTAINER_STYLE} className="overflow-hidden">
        <MapContainer 
            center={center} 
            zoom={zoom} 
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((marker, index) => (
                <Marker 
                    key={`${marker.name}-${index}`} 
                    position={[marker.lat, marker.lng]}
                    icon={defaultIcon}
                >
                    <Popup>
                        <div className="p-1 max-w-[200px]">
                            <h4 className="font-bold text-gray-800 text-sm mb-1">{marker.name}</h4>
                            <span className="inline-block px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded-full border border-gray-200">
                                {marker.region} Region
                            </span>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    </div>
  );
};

NepalHotspotMap.propTypes = {
  hotspotsString: PropTypes.string,
  apiKey: PropTypes.string // Still tracking this for prop interface compatibility, but unused.
};

export default NepalHotspotMap;
