import { useState, useCallback, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "src/@/components/ui/dialog";
import { Button } from "components/ui/button";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
  const [coordinates, setCoordinates] = useState(
    initialCoordinates.lat !== 0
      ? initialCoordinates
      : { lat: 40.7128, lng: -74.006 }
  );
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [error, setError] = useState("");
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [formattedAddress, setFormattedAddress] = useState(initialLocation);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    if (initialLocation) {
      setSearchInput(initialLocation);
      setSelectedLocation(initialLocation);
      setFormattedAddress(initialLocation);
    }
  }, [initialLocation]);

  // Function to handle search input and get location suggestions
  const handleSearch = useCallback(async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    try {
      setIsGettingLocation(true);

      // Use the OpenStreetMap Nominatim API as a fallback
      // In production, replace with your preferred geocoding API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          input
        )}&limit=5&accept-language=en`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "HRMS Application", // Important: Nominatim requires a user agent
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch suggestions: ${response.status}`);
      }

      const data = await response.json();

      // Transform the response to match our expected format
      const formattedSuggestions = data.map((item) => ({
        place_id: item.place_id,
        description: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      }));

      setSuggestions(formattedSuggestions);
      setError("");
    } catch (err) {
      console.error("Search error:", err);
      setError(
        "Unable to load location suggestions. Please try again or select a location on the map."
      );
      setSuggestions([]);
    } finally {
      setIsGettingLocation(false);
    }
  }, []);

  // Function to handle selection of a location from search results
  const handleLocationSelect = useCallback(
    async (prediction) => {
      setSelectedLocation(prediction.description);
      setSearchInput(prediction.description);
      setFormattedAddress(prediction.description);
      setSuggestions([]);

      setIsMapLoading(true);

      // If the prediction already has coordinates (from Nominatim), use them
      if (prediction.lat && prediction.lon) {
        setCoordinates({
          lat: prediction.lat,
          lng: prediction.lon,
        });
        setIsMapLoading(false);
        return;
      }

      // Otherwise, try to get coordinates from the place_id
      try {
        // In production, replace with your geocoding service
        const response = await fetch(
          `https://nominatim.openstreetmap.org/details?format=json&place_id=${prediction.place_id}`,
          {
            headers: {
              Accept: "application/json",
              "User-Agent": "HRMS Application",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to get location details: ${response.status}`);
        }

        const data = await response.json();
        if (data.geometry && data.geometry.coordinates) {
          // Nominatim returns [lon, lat] while we use {lat, lng}
          setCoordinates({
            lat: parseFloat(data.geometry.coordinates[1]),
            lng: parseFloat(data.geometry.coordinates[0]),
          });
        }
      } catch (err) {
        console.error("Error getting location details:", err);
        // Fallback to default coordinates with slight variation
        setCoordinates({
          lat: coordinates.lat + (Math.random() - 0.5) * 0.02,
          lng: coordinates.lng + (Math.random() - 0.5) * 0.02,
        });
      } finally {
        setIsMapLoading(false);
      }
    },
    [coordinates]
  );

  // Function to handle direct coordinate setting from map clicks
  const handleSetCoordinates = async (pos) => {
    setCoordinates(pos);

    // Get address from coordinates (reverse geocoding)
    try {
      setIsGettingLocation(true);

      // In production, replace with your reverse geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "HRMS Application",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Reverse geocoding failed: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.display_name) {
        setFormattedAddress(data.display_name);
        setSearchInput(data.display_name);
        setSelectedLocation(data.display_name);
      } else {
        // Fallback if no address is found
        const fallbackAddress = `Location at ${pos.lat.toFixed(
          4
        )}, ${pos.lng.toFixed(4)}`;
        setFormattedAddress(fallbackAddress);
        setSearchInput(fallbackAddress);
        setSelectedLocation(fallbackAddress);
      }
    } catch (err) {
      console.error("Error in reverse geocoding:", err);
      // Fallback if the service fails
      const fallbackAddress = `Location at ${pos.lat.toFixed(
        4
      )}, ${pos.lng.toFixed(4)}`;
      setFormattedAddress(fallbackAddress);
      setSearchInput(fallbackAddress);
      setSelectedLocation(fallbackAddress);
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Function to reset the location selection
  const resetLocation = useCallback(() => {
    setCoordinates({
      lat: 40.7128,
      lng: -74.006,
    });
    setSelectedLocation("");
    setSearchInput("");
    setFormattedAddress("");
  }, []);

  // Function to handle the save action
  const handleSave = useCallback(() => {
    if (!selectedLocation) {
      setError("Please select a location");
      return;
    }

    onSave({
      location: selectedLocation,
      coordinates,
      formattedAddress,
    });

    onClose();
  }, [selectedLocation, coordinates, formattedAddress, onSave, onClose]);

  // Function to get user's current location
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const currentPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCoordinates(currentPos);

          // Get address from the coordinates
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentPos.lat}&lon=${currentPos.lng}&zoom=18&addressdetails=1`,
              {
                headers: {
                  Accept: "application/json",
                  "User-Agent": "HRMS Application",
                },
              }
            );

            if (!response.ok) {
              throw new Error(`Reverse geocoding failed: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.display_name) {
              setFormattedAddress(data.display_name);
              setSearchInput(data.display_name);
              setSelectedLocation(data.display_name);
            }
          } catch (err) {
            console.error("Error getting address for current location:", err);
            const fallbackAddress = `Your location at ${currentPos.lat.toFixed(
              4
            )}, ${currentPos.lng.toFixed(4)}`;
            setFormattedAddress(fallbackAddress);
            setSearchInput(fallbackAddress);
            setSelectedLocation(fallbackAddress);
          } finally {
            setIsGettingLocation(false);
          }
        },
        (error) => {
          setIsGettingLocation(false);
          setError(
            "Unable to get your current location. Please ensure location access is enabled."
          );
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="py-2 flex-shrink-0">
          <DialogTitle>Select Branch Location</DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-muted-foreground">
                Location Search
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={getCurrentLocation}
                  className="text-sm text-blue-600 hover:text-blue-800"
                  disabled={isGettingLocation}
                >
                  {isGettingLocation
                    ? "Getting Location..."
                    : "Use Current Location"}
                </button>
                <button
                  onClick={resetLocation}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Reset
                </button>
              </div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-neutral-1000"
                placeholder="Search for location or click on map"
              />
              {isGettingLocation && (
                <div className="absolute right-3 top-2">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
              {suggestions.length > 0 && (
                <div className="absolute z-[9999999999] w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
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

          <div
            className="border rounded-lg overflow-hidden shadow-md"
            style={{ height: "300px" }}
          >
            {isMapLoading && (
              <div className="absolute inset-0 z-10 bg-white bg-opacity-70 flex items-center justify-center">
                <svg
                  className="animate-spin h-8 w-8 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}
            <MapContainer
              center={coordinates}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker
                setPosition={handleSetCoordinates}
                initialPosition={coordinates}
              />
            </MapContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-neutral-1000">Latitude</label>
              <input
                type="text"
                readOnly
                value={coordinates.lat.toFixed(6)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-neutral-1000">Longitude</label>
              <input
                type="text"
                readOnly
                value={coordinates.lng.toFixed(6)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-neutral-1000">Selected Address</label>
            <input
              type="text"
              readOnly
              value={formattedAddress}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2 sticky bottom-0 bg-white pb-2 mt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose} className="px-4">
              Cancel
            </Button>
            <Button variant="default" onClick={handleSave} className="px-4">
              Save Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SelectLocationOnMap;
