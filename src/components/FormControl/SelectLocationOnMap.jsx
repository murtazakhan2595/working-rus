import { useState, useCallback, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "src/@/components/ui/dialog";
import { Button } from "components/ui/button";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { Loader2, MapPin } from "lucide-react";
import { TextInput } from "components/FormControl";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet icon issue in React - Enhanced
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

// Create custom marker icon as fallback
const createCustomMarker = () => {
  return L.divIcon({
    html: `
      <div style="
        background-color: #ff4444;
        width: 20px;
        height: 20px;
        border-radius: 50% 50% 50% 0;
        border: 2px solid #fff;
        transform: rotate(-45deg);
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20],
    className: "custom-marker",
  });
};

// 🆕 NEW: Google Maps Link Parser with Multiple Fallbacks
const parseGoogleMapsLink = async (url) => {
  try {
    let workingUrl = url.trim();

    // Check if it's a shortened URL that needs expansion
    const isShortened =
      workingUrl.includes("maps.app.goo.gl") ||
      workingUrl.includes("goo.gl/maps") ||
      workingUrl.includes("g.co/maps");

    if (isShortened) {
      // Try multiple expansion methods
      const expansionMethods = [
        // Method 1: AllOrigins proxy
        async () => {
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
            workingUrl
          )}`;
          const response = await fetch(proxyUrl);
          if (response.ok) {
            const data = await response.json();
            return data.contents;
          }
          throw new Error("AllOrigins failed");
        },

        // Method 2: Different CORS proxy
        async () => {
          const proxyUrl = `https://cors-anywhere.herokuapp.com/${workingUrl}`;
          const response = await fetch(proxyUrl);
          if (response.ok) {
            return await response.text();
          }
          throw new Error("CORS Anywhere failed");
        },

        // Method 3: ThingProxy
        async () => {
          const proxyUrl = `https://thingproxy.freeboard.io/fetch/${workingUrl}`;
          const response = await fetch(proxyUrl);
          if (response.ok) {
            return await response.text();
          }
          throw new Error("ThingProxy failed");
        },
      ];

      // Try each expansion method
      for (const method of expansionMethods) {
        try {
          console.log("Trying URL expansion method...");
          const html = await method();

          // Extract coordinates from HTML response
          const coordsInHtml = html.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
          if (coordsInHtml) {
            console.log(
              "Found coordinates in HTML:",
              coordsInHtml[1],
              coordsInHtml[2]
            );
            return {
              lat: parseFloat(coordsInHtml[1]),
              lng: parseFloat(coordsInHtml[2]),
            };
          }

          // Extract canonical URL
          const canonicalMatch = html.match(
            /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i
          );
          if (canonicalMatch) {
            workingUrl = canonicalMatch[1];
            console.log("Found canonical URL:", workingUrl);
            break; // Break to parse the canonical URL
          }

          // Try to find coordinates in various meta tags
          const metaPatterns = [
            /<meta[^>]+property="og:url"[^>]+content="([^"]*@(-?\d+\.?\d*),(-?\d+\.?\d*)[^"]*)"[^>]*>/i,
            /<meta[^>]+name="twitter:url"[^>]+content="([^"]*@(-?\d+\.?\d*),(-?\d+\.?\d*)[^"]*)"[^>]*>/i,
          ];

          for (const pattern of metaPatterns) {
            const metaMatch = html.match(pattern);
            if (metaMatch && metaMatch[2] && metaMatch[3]) {
              console.log(
                "Found coordinates in meta tags:",
                metaMatch[2],
                metaMatch[3]
              );
              return {
                lat: parseFloat(metaMatch[2]),
                lng: parseFloat(metaMatch[3]),
              };
            }
          }
        } catch (methodError) {
          console.log("Expansion method failed:", methodError.message);
          continue; // Try next method
        }
      }
    }

    // Parse different Google Maps URL formats
    let coordinates = null;

    // Format 1: @lat,lng,zoom (most common)
    const atPattern = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const atMatch = workingUrl.match(atPattern);
    if (atMatch) {
      coordinates = {
        lat: parseFloat(atMatch[1]),
        lng: parseFloat(atMatch[2]),
      };
    }

    // Format 2: ll=lat,lng
    if (!coordinates) {
      const llPattern = /ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
      const llMatch = workingUrl.match(llPattern);
      if (llMatch) {
        coordinates = {
          lat: parseFloat(llMatch[1]),
          lng: parseFloat(llMatch[2]),
        };
      }
    }

    // Format 3: q=lat,lng
    if (!coordinates) {
      const qPattern = /q=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
      const qMatch = workingUrl.match(qPattern);
      if (qMatch) {
        coordinates = {
          lat: parseFloat(qMatch[1]),
          lng: parseFloat(qMatch[2]),
        };
      }
    }

    return coordinates;
  } catch (error) {
    console.error("Error parsing Google Maps link:", error);
    throw new Error(
      "Unable to parse the Google Maps link. The link might be invalid or temporarily inaccessible."
    );
  }
};

// Component to handle map interactions
const LocationMarker = ({ setPosition, initialPosition }) => {
  const [position, setMarkerPosition] = useState(initialPosition);
  const markerRef = useRef(null);
  const map = useMap();

  useEffect(() => {
    map.on("click", function (e) {
      const newPos = e.latlng;
      setMarkerPosition(newPos);
      setPosition(newPos);
      map.flyTo(newPos, map.getZoom());
    });

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
      console.log("LocationMarker: Updating position to:", initialPosition);
      // Update marker position when initialPosition changes
      setMarkerPosition(initialPosition);
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
      icon={createCustomMarker()} // Use custom icon to ensure visibility
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
  useEffect(() => {
    fixLeafletIcon();
    console.log("Map initialized with coordinates:", coordinates);
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

  // 🆕 NEW: Link input state
  const [linkInput, setLinkInput] = useState("");
  const [isParsingLink, setIsParsingLink] = useState(false);

  useEffect(() => {
    if (initialLocation) {
      setSearchInput(initialLocation);
      setSelectedLocation(initialLocation);
      setFormattedAddress(initialLocation);
    }
  }, [initialLocation]);

  // 🆕 NEW: Handle Google Maps link parsing
  const handleLinkPaste = async () => {
    if (!linkInput.trim()) {
      setError("Please paste a Google Maps link");
      return;
    }

    // Check if it's a Google Maps link
    if (
      !linkInput.includes("google.com/maps") &&
      !linkInput.includes("maps.app.goo.gl") &&
      !linkInput.includes("goo.gl/maps")
    ) {
      setError("Please paste a valid Google Maps link");
      return;
    }

    setIsParsingLink(true);
    setError("");

    try {
      const coords = await parseGoogleMapsLink(linkInput);

      if (!coords) {
        throw new Error("Could not extract coordinates from the link");
      }

      // Use existing coordinate setting logic
      await handleSetCoordinates(coords);
      setLinkInput(""); // Clear the input after successful parsing
    } catch (err) {
      console.error("Link parsing error:", err);
      setError(`Failed to parse the Google Maps link: ${
        err.message || "Unknown error"
      }. 
      
      💡 Try this: 
      1. Open the link in Google Maps 
      2. Copy the full URL (not shortened) from the address bar
      3. Paste that URL instead`);
    } finally {
      setIsParsingLink(false);
    }
  };

  // Function to handle search input and get location suggestions
  const handleSearch = useCallback(async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    try {
      setIsGettingLocation(true);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          input
        )}&limit=5&accept-language=en`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "HRMS Application",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch suggestions: ${response.status}`);
      }

      const data = await response.json();

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

      if (prediction.lat && prediction.lon) {
        setCoordinates({
          lat: prediction.lat,
          lng: prediction.lon,
        });
        setIsMapLoading(false);
        return;
      }

      try {
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
          setCoordinates({
            lat: parseFloat(data.geometry.coordinates[1]),
            lng: parseFloat(data.geometry.coordinates[0]),
          });
        }
      } catch (err) {
        console.error("Error getting location details:", err);
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
    console.log("Setting coordinates to:", pos);
    setCoordinates(pos);

    try {
      setIsGettingLocation(true);

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
        const fallbackAddress = `Location at ${pos.lat.toFixed(
          4
        )}, ${pos.lng.toFixed(4)}`;
        setFormattedAddress(fallbackAddress);
        setSearchInput(fallbackAddress);
        setSelectedLocation(fallbackAddress);
      }
    } catch (err) {
      console.error("Error in reverse geocoding:", err);
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
    setLinkInput(""); // 🆕 NEW: Clear link input too
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
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-3 w-3" />
                      Use Current Location
                    </>
                  )}
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
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
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

          {/* 🆕 NEW: Google Maps Link Input Section - Using TextInput component */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <TextInput
                  name="googleMapsLink"
                  value={linkInput}
                  onChange={(name, value) => setLinkInput(value)}
                  label="Google Maps Link"
                  placeholder="Paste Google Maps link (e.g., https://maps.app.goo.gl/...)"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleLinkPaste}
                  disabled={isParsingLink || !linkInput.trim()}
                  className="px-4 py-2 whitespace-nowrap h-[37.6px]"
                >
                  {isParsingLink ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Parsing...
                    </>
                  ) : (
                    "Add Location"
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div
            className="border rounded-lg overflow-hidden shadow-md"
            style={{ height: "300px" }}
          >
            {isMapLoading && (
              <div className="absolute inset-0 z-10 bg-white bg-opacity-70 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
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
            <TextInput
              name="latitude"
              value={coordinates.lat.toFixed(6)}
              label="Latitude"
              disabled={true}
              onChange={() => {}} // Read-only
            />
            <TextInput
              name="longitude"
              value={coordinates.lng.toFixed(6)}
              label="Longitude"
              disabled={true}
              onChange={() => {}} // Read-only
            />
          </div>

          <TextInput
            name="selectedAddress"
            value={formattedAddress}
            label="Selected Address"
            disabled={true}
            onChange={() => {}} // Read-only
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 mb-2">
                    Link Parsing Failed
                  </h3>
                  <div className="text-sm text-red-700 space-y-2">
                    <p>{error.split("💡")[0].trim()}</p>
                    {error.includes("💡") && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-3">
                        <p className="font-medium text-blue-800 mb-2">
                          💡 Solution:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-blue-700 text-sm">
                          <li>Open the link in Google Maps</li>
                          <li>
                            Copy the full URL (not shortened) from the address
                            bar
                          </li>
                          <li>Paste that URL instead</li>
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
