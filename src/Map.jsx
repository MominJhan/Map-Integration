import { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import { FaLocationDot } from "react-icons/fa6";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define a custom icon using react-icons
const Icon = (icon) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">${icon}</svg>`;
  return new L.DivIcon({
    className: 'custom-icon',
    html: svg,
    iconSize: [24, 14],
    iconAnchor: [19, 14],
  });
};

const FaLocationDotIcon = Icon('<path d="M12 2C8.13 2 5 5.13 5 9c0 3.22 6 11 7 11s7-7.78 7-11c0-3.87-3.13-7-7-7zm0 12c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>');

const initialPosition = [51.505, -0.09]; // Initial center point

const Map = () => {
  const [centerPosition, setCenterPosition] = useState(initialPosition);
  const [markers, setMarkers] = useState([]);
  const [circles, setCircles] = useState([]);
  const [circleRadius, setCircleRadius] = useState(500);

  // Map click event to add custom markers
  const handleMapClick = (e) => {
    const newMarker = {
      position: e.latlng,
      id: Date.now(),
    };
    setMarkers((prev) => [...prev, newMarker]);
  };

  // Handle input change for circle radius
  const handleRadiusChange = (e) => {
    setCircleRadius(Number(e.target.value));
  };

  // Add a new circle on button click
  const addCircle = () => {
    const newCircle = {
      center: centerPosition,
      radius: circleRadius,
      id: Date.now(),
    };
    setCircles((prev) => [...prev, newCircle]);
  };

  // Draggable Marker Component
  function DraggableMarker() {
    const [position, setPosition] = useState(centerPosition);
    const markerRef = useRef(null);

    const eventHandlers = {
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
          setCenterPosition(marker.getLatLng()); // Update center position
        }
      },
    };

    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        icon={FaLocationDotIcon}
        ref={markerRef}
      />
    );
  }

  return (
    <div>
      {/* Input for Circle Radius */}
      <div style={{ marginBottom: '10px' }}>
        <label>Circle Radius (meters): </label>
        <input
          type="number"
          value={circleRadius}
          onChange={handleRadiusChange}
          style={{ marginRight: '10px' }}
        />
        <button onClick={addCircle}>Add Circle</button>
      </div>
      <MapContainer
        center={initialPosition}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
        onClick={handleMapClick}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Draggable Center Marker */}
        <DraggableMarker />
        {/* Display Circles */}
        {circles.map((circle) => (
          <Circle
            key={circle.id}
            center={circle.center}
            radius={circle.radius}
            pathOptions={{ color: 'blue' }}
          />
        ))}
        {/* Display Custom Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={FaLocationDot}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
