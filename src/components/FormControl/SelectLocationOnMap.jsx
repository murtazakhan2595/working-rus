import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "src/@/components/ui/dialog";
import { Button } from "components/ui/button";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// Fix Leaflet icon issue in React
const fixLeafletIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

// Component to handle map interactions
const LocationMarker = ({ setPosition, initialPosition }) => {
  const [position, setMarkerPosition] = useState(initialPosition);
  const markerRef = useRef(null);
  const map = useMap();
  console.log()

  useEffect(() => {
    // Set up map click handler
    map.on("click", function (e) {
      const newPos = e.latlng;
      setMarkerPosition(newPos);
      setPosition(newPos);
      map.flyTo(newPos, map.getZoom());
    });

    // Clean up handler on unmount
    return () => {
      map.off("click");
    };
  }, [map, setPosition]);

  useEffect(() => {
    if (
      initialPosition &&
      initialPosition.lat !== 0 &&
      initialPosition.lng !== 0
    ) {
      map.flyTo(initialPosition, 13);
    }
  }, [initialPosition, map]);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        const newPos = marker.getLatLng();
        setMarkerPosition(newPos);
        setPosition(newPos);
      }
    },
  };

  return position ? (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={eventHandlers}
      ref={markerRef}
    />
  ) : null;
};

function SelectLocationOnMap({
  isOpen,
  onClose,
  onSave,
  initialLocation = "",
  initialCoordinates = { lat: 40.7128, lng: -74.006 },
}) {
  // Initialize Leaflet icons
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const [searchInput, setSearchInput] = useState(initialLocation);
  const [suggestions, setSuggestions] = useState([]);
  const [coordinates, setCoordinates] = useState({
    lat: 40.7128,
    lng: -74.006,
  });
  const [selectedLocation, setSelectedLocation] = useState("");
  const [error, setError] = useState("");
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [placeId, setPlaceId] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  const handleSearch = useCallback(async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `/integrations/google-place-autocomplete/autocomplete/json?input=${encodeURIComponent(
          input
        )}&radius=500`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await response.json();
      setSuggestions(data.predictions);
      setError("");
    } catch (err) {
      console.error("Search error:", err);
      setError("Unable to load location suggestions");
      setSuggestions([]);
    }
  }, []);

  const handleLocationSelect = useCallback(
    (prediction) => {
      setSelectedLocation(prediction.description);
      setSearchInput(prediction.description);
      setPlaceId(prediction.place_id);
      setFormattedAddress(prediction.description);
      setSuggestions([]);

      setIsMapLoading(true);
      setTimeout(() => {
        setCoordinates({
          lat: coordinates.lat + (Math.random() - 0.5) * 0.02,
          lng: coordinates.lng + (Math.random() - 0.5) * 0.02,
        });
        setIsMapLoading(false);
      }, 500);
    },
    [coordinates]
  );

  const handleMapClick = useCallback((event) => {
    setIsDragging(false);
    setCoordinates({
      lat: (event.clientY / 400) * 180 - 90,
      lng: (event.clientX / 400) * 360 - 180,
    });
    setShowInfoWindow(true);
  }, []);

  const handleMarkerDragStart = useCallback(() => {
    setIsDragging(true);
    setShowInfoWindow(false);
  }, []);

  const handleMarkerDragEnd = useCallback((event) => {
    setIsDragging(false);
    setCoordinates({
      lat: (event.clientY / 400) * 180 - 90,
      lng: (event.clientX / 400) * 360 - 180,
    });
    setShowInfoWindow(true);
  }, []);

  const resetLocation = useCallback(() => {
    setCoordinates({
      lat: 40.7128,
      lng: -74.006,
    });
    setSelectedLocation("");
    setSearchInput("");
    setPlaceId("");
    setFormattedAddress("");
  }, []);

  const handleSave = useCallback(() => {
    if (!branchName.trim()) {
      setError("Branch name is required");
      return;
    }
    if (!selectedLocation) {
      setError("Location is required");
      return;
    }
    onSave({
      branchName,
      location: selectedLocation,
      coordinates,
      placeId,
      formattedAddress,
    });
  }, [
    branchName,
    selectedLocation,
    coordinates,
    placeId,
    formattedAddress,
    onSave,
  ]);

  return (
    <div className="p-6 ">
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-gray-700">
            Location Search
          </label>
          <button
            onClick={resetLocation}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Reset Location
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            name="location"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              handleSearch(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search for location"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.place_id}
                  onClick={() => handleLocationSelect(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
                >
                  {suggestion.description}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg overflow-hidden shadow-md">
        <div
          className="h-[400px] bg-gray-100 relative cursor-crosshair"
          onClick={handleMapClick}
        >
          {isMapLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <i className="fas fa-spinner fa-spin text-blue-500 text-2xl"></i>
            </div>
          )}
          <div
            className={`absolute transition-all duration-300 ${
              isDragging ? "scale-110" : "scale-100"
            }`}
            style={{
              left: `${((coordinates.lng + 180) / 360) * 100}%`,
              top: `${((coordinates.lat + 90) / 180) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
            onMouseDown={handleMarkerDragStart}
            onMouseUp={handleMarkerDragEnd}
          >
            <i className="fas fa-map-marker-alt text-red-500 text-3xl"></i>
            {showInfoWindow && (
              <div className="absolute left-6 top-0 bg-white p-2 rounded shadow-lg text-sm">
                <p className="font-medium">
                  {formattedAddress || "Selected Location"}
                </p>
                <p className="text-gray-500">
                  {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm text-gray-500">Latitude</label>
          <input
            type="text"
            readOnly
            value={coordinates.lat.toFixed(6)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-gray-500">Longitude</label>
          <input
            type="text"
            readOnly
            value={coordinates.lng.toFixed(6)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

export default SelectLocationOnMap;
