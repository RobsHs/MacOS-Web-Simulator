import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import L from "leaflet";
import { useAppStore } from "../store/Appstore";
import { playPopSound } from "../utils/soundEffects";
import { 
  Search, MapPin, Pin, Route, Clock, Star, Navigation, 
  Plus, Minus, CloudSun, Compass, Landmark, Tent, ChevronRight, 
  X, Layers, Share2, Copy, Heart, Car, Footprints, Bike, 
  ArrowLeft, Check, Sun, CloudRain, Cloud, Wind, Thermometer, 
  Info, Navigation2, Utensils, Coffee, Fuel, ShoppingBag, Hotel, Trees, Building2, Eye
} from "lucide-react";

// Traffic lights component inside Maps
const TrafficLights = ({ windowId }) => {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const windows = useAppStore((s) => s.windows);
  const win = windows.find((w) => w.id === windowId);
  const maximized = win ? win.maximized : false;

  return (
    <div className="flex items-center gap-2 group shrink-0">
      <div
        className="w-3 h-3 bg-[#ff5f57] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff4136] transition-all duration-150 shadow-sm"
        onClick={() => close(windowId)}
        title="Close"
      >
        <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] transition-all duration-150 shadow-sm"
        onClick={() => minimize(windowId)}
        title="Minimize"
      >
        <svg className="w-1.5 h-1.5 text-[#9a6400] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#28c840] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#1aab29] transition-all duration-150 shadow-sm"
        onClick={() => toggleMaximize(windowId)}
        title={maximized ? "Restore" : "Maximize"}
      >
        <svg className="w-1.5 h-1.5 text-[#006500] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          {maximized ? (
            <>
              <rect x="1.5" y="3.5" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M3.5 3.5V1.5H8.5V6.5H6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </>
          ) : (
            <>
              <path d="M1 1L4 4M1 1V3.5M1 1H3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M9 9L6 6M9 9V6.5M9 9H6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

// Calculate geodesic distance between two points in km/m
function getFormattedDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  if (dist < 1) {
    return `${Math.round(dist * 1000)} m`;
  }
  return `${dist.toFixed(1)} km`;
}

// Explore Categories list
const CATEGORIES = [
  { id: "restaurants", name: "Restaurants", icon: Utensils, query: "restaurant", color: "bg-orange-500" },
  { id: "coffee", name: "Coffee", icon: Coffee, query: "coffee", color: "bg-amber-600" },
  { id: "fuel", name: "Gas Stations", icon: Fuel, query: "fuel", color: "bg-blue-600" },
  { id: "groceries", name: "Groceries", icon: ShoppingBag, query: "supermarket", color: "bg-emerald-600" },
  { id: "hotels", name: "Hotels", icon: Hotel, query: "hotel", color: "bg-purple-600" },
  { id: "parks", name: "Parks", icon: Trees, query: "park", color: "bg-green-600" },
  { id: "hospitals", name: "Hospitals", icon: Building2, query: "hospital", color: "bg-red-500" },
];

export default function Maps({ windowId, isDragging, isResizing, maximized }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  // Map & DOM references
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const trafficLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const userAccuracyCircleRef = useRef(null);
  const pinMarkersRef = useRef([]);
  const routePolylineRef = useRef(null);

  // User & Active Location state
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(true);
  const [activePlace, setActivePlace] = useState(null);

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState("explore"); // "explore" | "directions" | "place"
  const [mapTheme, setMapTheme] = useState("standard"); // "standard" | "satellite" | "transit"
  const [showTraffic, setShowTraffic] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showWeatherDetail, setShowWeatherDetail] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dynamic Scale
  const [scaleInfo, setScaleInfo] = useState({ label: "1 km", midLabel: "500 m", width: 70 });

  // Weather & AQI state
  const [weatherData, setWeatherData] = useState({
    temp: 28,
    condition: "Sunny",
    weatherCode: 0,
    windSpeed: 8,
    humidity: 60,
    aqi: 45,
    aqiLevel: "Good",
    aqiColor: "text-emerald-500",
  });

  // Search & Navigation state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Favorites & Recents (saved to localStorage)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("macos_maps_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recents, setRecents] = useState(() => {
    try {
      const saved = localStorage.getItem("macos_maps_recents");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Directions state
  const [directionMode, setDirectionMode] = useState("driving"); // "driving" | "walking" | "cycling"
  const [directionOrigin, setDirectionOrigin] = useState("My Location");
  const [directionDest, setDirectionDest] = useState("");
  const [routeInfo, setRouteInfo] = useState(null);
  const [isRouting, setIsRouting] = useState(false);

  // Save favorites to storage
  useEffect(() => {
    try {
      localStorage.setItem("macos_maps_favorites", JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Save recents to storage
  useEffect(() => {
    try {
      localStorage.setItem("macos_maps_recents", JSON.stringify(recents));
    } catch (e) {
      console.error(e);
    }
  }, [recents]);

  // -------------------------------------------------------------
  // 1. Initial Device Geolocation Discovery (Zero Template / Zero Eiffel)
  // -------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;
    let gpsResolved = false;

    // Helper: Reverse geocode lat/lon into human readable locality
    const reverseGeocode = async (lat, lon) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
          { headers: { "Accept-Language": "en,id" } }
        );
        if (!res.ok) return null;
        const data = await res.json();
        const addr = data.address || {};
        const road = addr.road || addr.pedestrian || addr.suburb || "";
        const city = addr.city || addr.town || addr.municipality || addr.village || addr.county || "Local Area";
        const state = addr.state || "";
        const country = addr.country || "";
        const displayName = data.display_name || `${city}, ${country}`;

        return {
          displayName,
          locality: road ? `${road}, ${city}` : `${city}, ${state || country}`,
          city,
          country,
          postcode: addr.postcode || "",
        };
      } catch {
        return null;
      }
    };

    // Helper: Update state & weather with detected coordinates
    const handleLocationFound = async (lat, lon, accuracy = 50, isGps = false) => {
      if (!isMounted) return;
      setIsLocating(false);

      const geoDetails = await reverseGeocode(lat, lon);
      const locObj = {
        id: "my-location",
        name: "My Location",
        locality: geoDetails?.locality || "Current Location",
        displayName: geoDetails?.displayName || `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        city: geoDetails?.city || "Local",
        country: geoDetails?.country || "",
        lat,
        lon,
        accuracy,
        isGps,
        category: "Current Location",
      };

      setUserLocation(locObj);
      if (!activePlace) {
        setActivePlace(locObj);
      }

      // Center map if available
      if (mapRef.current) {
        mapRef.current.setView([lat, lon], 15);
      }

      // Fetch live weather & AQI for current coordinates
      loadWeatherAndAQI(lat, lon);
    };

    // 1. Try high-accuracy device GPS
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          gpsResolved = true;
          handleLocationFound(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy || 25, true);
        },
        (err) => {
          console.warn("Geolocation permission or hardware timeout:", err.message);
        },
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 60000 }
      );
    }

    // 2. Fast IP-based geolocation fallback in parallel (prevents blank/stuck states)
    const runIpFallback = async () => {
      try {
        const ipRes = await fetch("https://ipapi.co/json/");
        if (ipRes.ok) {
          const data = await ipRes.json();
          if (data && data.latitude && data.longitude && !gpsResolved) {
            handleLocationFound(parseFloat(data.latitude), parseFloat(data.longitude), 1500, false);
            return;
          }
        }
      } catch {
        // secondary backup
        try {
          const freeRes = await fetch("https://freeipapi.com/api/json");
          if (freeRes.ok) {
            const data = await freeRes.json();
            if (data && data.latitude && data.longitude && !gpsResolved) {
              handleLocationFound(parseFloat(data.latitude), parseFloat(data.longitude), 2000, false);
              return;
            }
          }
        } catch {
          // Absolute fail-safe: Jakarta center if everything is completely blocked
          if (!gpsResolved) {
            handleLocationFound(-6.2088, 106.8456, 5000, false);
          }
        }
      }
    };

    const timer = setTimeout(() => {
      if (!gpsResolved) {
        runIpFallback();
      }
    }, 1200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // -------------------------------------------------------------
  // 2. Fetch Live Weather & Air Quality (Open-Meteo free API)
  // -------------------------------------------------------------
  const loadWeatherAndAQI = async (lat, lon) => {
    try {
      const [wRes, aRes] = await Promise.all([
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`
        ),
        fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`
        ).catch(() => null),
      ]);

      let temp = 28;
      let weatherCode = 0;
      let windSpeed = 8;
      let humidity = 62;
      let aqi = 42;

      if (wRes && wRes.ok) {
        const wData = await wRes.json();
        if (wData.current_weather) {
          temp = Math.round(wData.current_weather.temperature);
          weatherCode = wData.current_weather.weathercode;
          windSpeed = Math.round(wData.current_weather.windspeed);
        }
        if (wData.hourly?.relativehumidity_2m) {
          humidity = wData.hourly.relativehumidity_2m[0] || 62;
        }
      }

      if (aRes && aRes.ok) {
        const aData = await aRes.json();
        if (aData.current?.us_aqi !== undefined) {
          aqi = Math.round(aData.current.us_aqi);
        }
      }

      // Condition text and AQI level
      let condition = "Clear";
      if (weatherCode === 1 || weatherCode === 2) condition = "Partly Cloudy";
      else if (weatherCode === 3) condition = "Overcast";
      else if (weatherCode >= 45 && weatherCode <= 48) condition = "Foggy";
      else if (weatherCode >= 51 && weatherCode <= 67) condition = "Rainy";
      else if (weatherCode >= 80 && weatherCode <= 82) condition = "Rain Showers";
      else if (weatherCode >= 95) condition = "Thunderstorm";

      let aqiLevel = "Good";
      let aqiColor = "text-emerald-500";
      if (aqi > 50 && aqi <= 100) {
        aqiLevel = "Moderate";
        aqiColor = "text-amber-500";
      } else if (aqi > 100 && aqi <= 150) {
        aqiLevel = "Unhealthy for Sensitive";
        aqiColor = "text-orange-500";
      } else if (aqi > 150) {
        aqiLevel = "Unhealthy";
        aqiColor = "text-red-500";
      }

      setWeatherData({
        temp,
        condition,
        weatherCode,
        windSpeed,
        humidity,
        aqi,
        aqiLevel,
        aqiColor,
      });
    } catch (e) {
      console.warn("Weather fetch error:", e);
    }
  };

  // -------------------------------------------------------------
  // 3. Initialize Interactive Leaflet Map
  // -------------------------------------------------------------
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const initialLat = userLocation ? userLocation.lat : -6.2088;
    const initialLon = userLocation ? userLocation.lon : 106.8456;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLon],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      fadeAnimation: true,
      zoomAnimation: true,
      wheelPxPerZoomLevel: 100,
    });

    mapRef.current = map;

    // Create Base Tile Layer
    updateTileLayer(mapTheme, isDarkMode);

    // Update dynamic scale on zoom or move
    const handleMove = () => {
      calculateScale(map);
    };

    map.on("zoomend", handleMove);
    map.on("moveend", handleMove);
    calculateScale(map);

    // Click map to drop pin & select place
    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      playPopSound();
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          { headers: { "Accept-Language": "en,id" } }
        );
        const data = await res.json();
        const addr = data.address || {};
        const road = addr.road || addr.pedestrian || addr.suburb || "";
        const city = addr.city || addr.town || addr.county || "Selected Area";

        const droppedPlace = {
          id: `pin-${Date.now()}`,
          name: road || city || "Dropped Pin",
          locality: road ? `${road}, ${city}` : city,
          displayName: data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          city,
          country: addr.country || "",
          lat,
          lon: lng,
          category: "Dropped Pin",
        };

        setActivePlace(droppedPlace);
        setSidebarTab("place");
        setIsSidebarOpen(true);
        addPinMarker(droppedPlace, true);
      } catch {
        const droppedPlace = {
          id: `pin-${Date.now()}`,
          name: "Dropped Pin",
          locality: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          displayName: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          lat,
          lon: lng,
          category: "Dropped Pin",
        };
        setActivePlace(droppedPlace);
        setSidebarTab("place");
        setIsSidebarOpen(true);
        addPinMarker(droppedPlace, true);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update scale calculation
  const calculateScale = (map) => {
    if (!map) return;
    const center = map.getCenter();
    const zoom = map.getZoom();
    const metersPerPixel = (156543.03392 * Math.cos((center.lat * Math.PI) / 180)) / Math.pow(2, zoom);
    const targetPixels = 75;
    const rawMeters = metersPerPixel * targetPixels;

    const roundDistances = [
      10, 25, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000,
    ];
    let chosen = roundDistances[0];
    for (const d of roundDistances) {
      if (d <= rawMeters) chosen = d;
    }
    const actualPixels = Math.max(35, Math.min(110, chosen / metersPerPixel));
    const label = chosen >= 1000 ? `${chosen / 1000} km` : `${chosen} m`;
    const midLabel = chosen >= 1000 ? `${(chosen / 2000).toFixed(chosen % 2000 === 0 ? 0 : 1)}` : `${Math.round(chosen / 2)}`;

    setScaleInfo({ label, midLabel, width: actualPixels });
  };

  // Invalidate map size on window resize / drag / maximize / sidebar toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize({ animate: false });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [isSidebarOpen, maximized, isResizing]);

  // -------------------------------------------------------------
  // 4. Map Tile Layer Management (Explore / Satellite / Transit / Dark)
  // -------------------------------------------------------------
  const updateTileLayer = (theme, dark) => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Remove existing tile layer
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    let url = "";
    let subdomains = "abcd";
    let maxZoom = 20;

    if (theme === "satellite") {
      url = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      subdomains = "";
      maxZoom = 19;
    } else if (theme === "transit") {
      url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      subdomains = "abc";
      maxZoom = 19;
    } else {
      // Standard / Explore
      if (dark) {
        url = "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png";
      } else {
        url = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
      }
    }

    const newLayer = L.tileLayer(url, {
      subdomains,
      maxZoom,
      detectRetina: true,
      crossOrigin: true,
    });

    newLayer.addTo(map);
    tileLayerRef.current = newLayer;
  };

  useEffect(() => {
    updateTileLayer(mapTheme, isDarkMode);
  }, [mapTheme, isDarkMode]);

  // Traffic Overlay Layer
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (showTraffic) {
      if (!trafficLayerRef.current) {
        // TomTom or OpenStreetMap GPS flow tile simulation
        trafficLayerRef.current = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          { opacity: 0.35, maxZoom: 19 }
        );
        trafficLayerRef.current.addTo(map);
      }
    } else {
      if (trafficLayerRef.current) {
        map.removeLayer(trafficLayerRef.current);
        trafficLayerRef.current = null;
      }
    }
  }, [showTraffic]);

  // -------------------------------------------------------------
  // 5. User Location Puck & Markers (Apple Maps Blue Puck & Red Pin)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    const map = mapRef.current;

    const { lat, lon, accuracy } = userLocation;

    // Create or update animated blue puck
    if (!userMarkerRef.current) {
      const userPuckIcon = L.divIcon({
        className: "apple-user-location-marker",
        html: `
          <div class="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2">
            <span class="absolute w-8 h-8 rounded-full bg-[#007AFF]/25 apple-pulse-ring"></span>
            <span class="relative w-4 h-4 rounded-full bg-[#007AFF] border-[2.5px] border-white shadow-[0_2px_8px_rgba(0,122,255,0.7)] flex items-center justify-center">
              <span class="w-1 h-1 rounded-full bg-white"></span>
            </span>
          </div>
        `,
        iconSize: [0, 0],
      });

      const marker = L.marker([lat, lon], {
        icon: userPuckIcon,
        zIndexOffset: 1000,
      }).addTo(map);

      marker.on("click", () => {
        playPopSound();
        setActivePlace(userLocation);
        setSidebarTab("place");
        setIsSidebarOpen(true);
      });

      userMarkerRef.current = marker;
    } else {
      userMarkerRef.current.setLatLng([lat, lon]);
    }

    // Accuracy Circle
    if (!userAccuracyCircleRef.current) {
      userAccuracyCircleRef.current = L.circle([lat, lon], {
        radius: Math.min(accuracy || 30, 200),
        color: "#007AFF",
        weight: 1,
        fillColor: "#007AFF",
        fillOpacity: 0.08,
      }).addTo(map);
    } else {
      userAccuracyCircleRef.current.setLatLng([lat, lon]);
      userAccuracyCircleRef.current.setRadius(Math.min(accuracy || 30, 200));
    }
  }, [userLocation]);

  // Add / replace Pin Marker for active place or search result
  const addPinMarker = useCallback((place, clearOthers = true) => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (clearOthers) {
      pinMarkersRef.current.forEach((m) => map.removeLayer(m));
      pinMarkersRef.current = [];
    }

    const pinIcon = L.divIcon({
      className: "apple-place-pin-marker",
      html: `
        <div class="relative flex flex-col items-center group -translate-x-1/2 -translate-y-full cursor-pointer">
          <div class="w-8 h-8 rounded-full bg-[#FF3B30] border-2 border-white shadow-[0_4px_14px_rgba(255,59,48,0.55)] flex items-center justify-center text-white transition-all transform hover:scale-115">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div class="w-1.5 h-1.5 bg-[#FF3B30] -mt-0.5 rounded-b-full"></div>
          <div class="w-4 h-1 bg-black/30 rounded-full blur-[1px] mt-0.5"></div>
        </div>
      `,
      iconSize: [0, 0],
    });

    const marker = L.marker([place.lat, place.lon], { icon: pinIcon }).addTo(map);
    marker.on("click", () => {
      playPopSound();
      setActivePlace(place);
      setSidebarTab("place");
      setIsSidebarOpen(true);
    });

    pinMarkersRef.current.push(marker);
  }, []);

  // -------------------------------------------------------------
  // 6. Center on User Location
  // -------------------------------------------------------------
  const centerOnMyLocation = () => {
    playPopSound();
    if (userLocation && mapRef.current) {
      mapRef.current.flyTo([userLocation.lat, userLocation.lon], 16, {
        animate: true,
        duration: 1.2,
      });
      setActivePlace(userLocation);
      setSidebarTab("place");
    } else if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const { latitude: lat, longitude: lon, accuracy } = pos.coords;
          setUserLocation((prev) => ({
            ...prev,
            lat,
            lon,
            accuracy,
            isGps: true,
          }));
          if (mapRef.current) {
            mapRef.current.flyTo([lat, lon], 16, { duration: 1.2 });
          }
        },
        () => setIsLocating(false),
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  };

  // -------------------------------------------------------------
  // 7. Search Locations (Nominatim OpenStreetMap)
  // -------------------------------------------------------------
  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSuggestions(false);

    try {
      // Prioritize local search near user location if available
      let viewboxParam = "";
      if (userLocation) {
        const delta = 1.0;
        viewboxParam = `&viewbox=${userLocation.lon - delta},${userLocation.lat + delta},${userLocation.lon + delta},${userLocation.lat - delta}`;
      }

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5${viewboxParam}`,
        { headers: { "Accept-Language": "en,id" } }
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const first = data[0];
        const place = {
          id: `search-${Date.now()}`,
          name: first.name || searchQuery,
          displayName: first.display_name,
          locality: first.display_name.split(",").slice(0, 2).join(", "),
          category: first.type?.toUpperCase() || "Search Result",
          lat: parseFloat(first.lat),
          lon: parseFloat(first.lon),
        };

        selectPlace(place);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Quick Category Search (e.g. Restaurants, Coffee)
  const handleCategorySearch = async (category) => {
    playPopSound();
    setIsSearching(true);
    setSearchQuery(category.name);

    const center = mapRef.current ? mapRef.current.getCenter() : { lat: userLocation?.lat || -6.2088, lng: userLocation?.lon || 106.8456 };

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(category.query)}&limit=6&viewbox=${center.lng - 0.08},${center.lat + 0.08},${center.lng + 0.08},${center.lat - 0.08}&bounded=1`,
        { headers: { "Accept-Language": "en,id" } }
      );
      const data = await res.json();

      if (data && data.length > 0) {
        // Clear previous markers
        pinMarkersRef.current.forEach((m) => mapRef.current?.removeLayer(m));
        pinMarkersRef.current = [];

        const places = data.map((item, idx) => ({
          id: `cat-${idx}-${Date.now()}`,
          name: item.name || `${category.name} #${idx + 1}`,
          locality: item.display_name.split(",").slice(0, 2).join(", "),
          displayName: item.display_name,
          category: category.name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        }));

        setSearchResults(places);
        selectPlace(places[0], false);

        // Place markers for all category items
        places.forEach((p) => addPinMarker(p, false));

        // Fit bounds to show all category results
        const group = L.featureGroup(pinMarkersRef.current);
        mapRef.current?.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 16 });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  // Select place helper
  const selectPlace = (place, clearOtherMarkers = true) => {
    setActivePlace(place);
    setSidebarTab("place");
    setIsSidebarOpen(true);

    if (mapRef.current) {
      mapRef.current.flyTo([place.lat, place.lon], 16, { duration: 1.2 });
    }

    if (clearOtherMarkers) {
      addPinMarker(place, true);
    }

    // Add to recents
    setRecents((prev) => {
      const filtered = prev.filter((p) => p.name !== place.name);
      return [{ ...place, timestamp: Date.now() }, ...filtered].slice(0, 10);
    });
  };

  // -------------------------------------------------------------
  // 8. OSRM Routing Engine (Drive, Walk, Cycle)
  // -------------------------------------------------------------
  const calculateRoute = async (destination, mode = directionMode) => {
    if (!userLocation || !destination) return;
    setIsRouting(true);
    setSidebarTab("directions");

    const startLat = userLocation.lat;
    const startLon = userLocation.lon;
    const endLat = destination.lat;
    const endLon = destination.lon;

    const osrmMode = mode === "walking" ? "walking" : mode === "cycling" ? "bicycle" : "driving";

    try {
      const url = `https://router.project-osrm.org/route/v1/${osrmMode}/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson&steps=true`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.code === "Ok" && data.routes?.length > 0) {
        const route = data.routes[0];
        const distKm = (route.distance / 1000).toFixed(1);
        const durationMin = Math.round(route.duration / 60);

        setRouteInfo({
          distance: `${distKm} km`,
          duration: durationMin < 60 ? `${durationMin} min` : `${Math.floor(durationMin / 60)} hr ${durationMin % 60} min`,
          steps: route.legs?.[0]?.steps?.map((s) => ({
            instruction: s.maneuver?.instruction || `${s.maneuver?.type || "Proceed"} onto ${s.name || "road"}`,
            distance: s.distance < 1000 ? `${Math.round(s.distance)} m` : `${(s.distance / 1000).toFixed(1)} km`,
          })) || [],
        });

        // Draw Route Line on Leaflet
        if (mapRef.current) {
          const map = mapRef.current;
          if (routePolylineRef.current) {
            map.removeLayer(routePolylineRef.current);
          }

          const coordinates = route.geometry.coordinates.map((c) => [c[1], c[0]]);
          const polyline = L.polyline(coordinates, {
            color: "#007AFF",
            weight: 6,
            opacity: 0.95,
            lineJoin: "round",
            lineCap: "round",
          }).addTo(map);

          routePolylineRef.current = polyline;

          // Fit route in view with comfortable padding for sidebar
          map.fitBounds(polyline.getBounds(), {
            paddingTopLeft: [isSidebarOpen ? 280 : 50, 50],
            paddingBottomRight: [50, 50],
            maxZoom: 16,
          });
        }
      }
    } catch (e) {
      console.error("Routing error:", e);
    } finally {
      setIsRouting(false);
    }
  };

  const clearRoute = () => {
    playPopSound();
    if (routePolylineRef.current && mapRef.current) {
      mapRef.current.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }
    setRouteInfo(null);
    setSidebarTab("place");
  };

  // Toggle Favorite Place
  const toggleFavorite = (place) => {
    playPopSound();
    setFavorites((prev) => {
      const exists = prev.some((p) => p.name === place.name);
      if (exists) {
        return prev.filter((p) => p.name !== place.name);
      } else {
        return [...prev, place];
      }
    });
  };

  const isCurrentFavorite = useMemo(() => {
    return activePlace && favorites.some((p) => p.name === activePlace.name);
  }, [activePlace, favorites]);

  // Copy coordinates
  const handleCopyCoordinates = () => {
    if (!activePlace) return;
    navigator.clipboard.writeText(`${activePlace.lat.toFixed(6)}, ${activePlace.lon.toFixed(6)}`);
    setCopied(true);
    playPopSound();
    setTimeout(() => setCopied(false), 2000);
  };

  // Zoom controls
  const handleZoomIn = () => {
    playPopSound();
    mapRef.current?.zoomIn(1, { animate: true });
  };

  const handleZoomOut = () => {
    playPopSound();
    mapRef.current?.zoomOut(1, { animate: true });
  };

  // -------------------------------------------------------------
  // Render
  // -------------------------------------------------------------
  return (
    <div
      className={`maps-container w-full h-full select-none text-[13px] rounded-xl overflow-hidden font-sans relative ${
        isDarkMode ? "bg-[#1C1C1E] text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* 1. Main Interactive Leaflet Map Container */}
      <div
        className={`absolute inset-0 w-full h-full z-0 overflow-hidden apple-map-viewport transition-transform duration-500 ease-out ${
          isDarkMode ? "dark-map" : ""
        }`}
        style={{
          transform: is3D ? "perspective(1000px) rotateX(25deg) scale(1.04)" : "none",
          transformOrigin: "center 85%",
        }}
      >
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* 2. Floating Top-Left Traffic Lights & Sidebar Toggle Capsule (When Sidebar is Closed) */}
      {!isSidebarOpen && (
        <div
          className={`absolute left-5 top-5 z-20 flex items-center gap-3 px-3 py-2 rounded-2xl border shadow-lg backdrop-blur-2xl transition-all duration-200 ${
            isDarkMode
              ? "bg-[#1E1E1E]/80 border-white/10 text-white"
              : "bg-white/80 border-black/5 text-gray-800"
          }`}
        >
          <TrafficLights windowId={windowId} />
          <div className="w-px h-3.5 bg-black/10 dark:bg-white/10" />
          <button
            onClick={() => {
              playPopSound();
              setIsSidebarOpen(true);
            }}
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition text-gray-600 dark:text-gray-300"
            title="Open Sidebar"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* 3. Floating Apple Maps Sidebar */}
      {isSidebarOpen && (
        <aside
          className={`absolute left-4 top-4 bottom-4 w-[285px] z-20 flex flex-col rounded-3xl border shadow-[0_16px_44px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition-all duration-300 overflow-hidden ${
            isDarkMode
              ? "border-white/10 bg-[#1E1E1E]/85 text-white"
              : "border-black/5 bg-[#F5F5F7]/85 text-gray-900"
          }`}
        >
          {/* Sidebar Header (Traffic lights + Sidebar collapse button) */}
          <div className="window-drag-handle px-4 pt-3.5 pb-2.5 shrink-0 flex items-center justify-between cursor-grab active:cursor-grabbing">
            <TrafficLights windowId={windowId} />
            <button
              onClick={() => {
                playPopSound();
                setIsSidebarOpen(false);
              }}
              className={`p-1.5 rounded-lg transition ${
                isDarkMode ? "hover:bg-white/10 text-gray-300" : "hover:bg-black/5 text-gray-600"
              }`}
              title="Hide Sidebar"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="currentColor">
                <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                <line x1="5.5" y1="1.5" x2="5.5" y2="14.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>

          {/* Search Bar Input */}
          <div className="px-3.5 pb-2.5 shrink-0">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div
                className={`flex items-center rounded-xl px-2.5 py-1.5 border transition-all duration-200 ${
                  isDarkMode
                    ? "bg-black/30 border-white/10 text-gray-200 focus-within:border-blue-500/60 focus-within:bg-black/40"
                    : "bg-white/80 border-black/8 text-gray-800 focus-within:bg-white focus-within:border-blue-500/50 shadow-xs"
                }`}
              >
                <Search size={14} className="text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search Maps or Address"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-[12.5px] outline-none placeholder-gray-400 text-inherit font-normal"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Dynamic Sidebar Content */}
          <div className="flex-1 overflow-y-auto px-3.5 space-y-4 scrollbar-thin" style={{ scrollbarWidth: "none" }}>
            {/* VIEW A: Place Detail Sheet */}
            {sidebarTab === "place" && activePlace && (
              <div className="space-y-3.5 pb-4 animate-in fade-in duration-200">
                {/* Back button */}
                <button
                  onClick={() => setSidebarTab("explore")}
                  className="flex items-center gap-1.5 text-xs text-[#007AFF] hover:underline font-medium"
                >
                  <ArrowLeft size={13} />
                  <span>Back to Explore</span>
                </button>

                {/* Place Hero Card */}
                <div
                  className={`p-3.5 rounded-2xl border ${
                    isDarkMode ? "bg-white/[0.04] border-white/10" : "bg-white border-black/5 shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-semibold text-base leading-tight">{activePlace.name}</h2>
                      <p className="text-[11.5px] text-gray-500 dark:text-gray-400 mt-0.5">
                        {activePlace.locality || activePlace.category}
                      </p>
                    </div>
                    {userLocation && (
                      <span className="text-[11px] font-semibold text-[#007AFF] bg-[#007AFF]/10 px-2 py-0.5 rounded-full shrink-0">
                        {getFormattedDistance(userLocation.lat, userLocation.lon, activePlace.lat, activePlace.lon) || "Near"}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons: Directions, Favorite, Copy */}
                  <div className="grid grid-cols-3 gap-2 mt-3.5">
                    <button
                      onClick={() => calculateRoute(activePlace)}
                      className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl bg-[#007AFF] hover:bg-[#0062cc] text-white font-medium text-[11px] transition shadow-xs"
                    >
                      <Route size={14} />
                      <span>Directions</span>
                    </button>
                    <button
                      onClick={() => toggleFavorite(activePlace)}
                      className={`flex flex-col items-center justify-center gap-1 py-2 rounded-xl border text-[11px] font-medium transition ${
                        isCurrentFavorite
                          ? "bg-red-500/10 text-red-500 border-red-500/20"
                          : isDarkMode
                          ? "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                          : "bg-black/[0.03] border-black/5 hover:bg-black/[0.06] text-gray-700"
                      }`}
                    >
                      <Heart size={14} className={isCurrentFavorite ? "fill-red-500" : ""} />
                      <span>{isCurrentFavorite ? "Saved" : "Save"}</span>
                    </button>
                    <button
                      onClick={handleCopyCoordinates}
                      className={`flex flex-col items-center justify-center gap-1 py-2 rounded-xl border text-[11px] font-medium transition ${
                        copied
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : isDarkMode
                          ? "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                          : "bg-black/[0.03] border-black/5 hover:bg-black/[0.06] text-gray-700"
                      }`}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copied ? "Copied" : "Coords"}</span>
                    </button>
                  </div>
                </div>

                {/* Full Address Details */}
                <div
                  className={`p-3 rounded-xl border text-xs space-y-2 ${
                    isDarkMode ? "bg-white/[0.02] border-white/5 text-gray-300" : "bg-black/[0.02] border-black/5 text-gray-700"
                  }`}
                >
                  <div>
                    <span className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider block">Address</span>
                    <p className="mt-0.5 leading-snug">{activePlace.displayName || activePlace.locality}</p>
                  </div>
                  <div className="pt-1.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                    <span>Coordinates</span>
                    <span className="font-mono">
                      {activePlace.lat.toFixed(4)}, {activePlace.lon.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW B: Turn-by-Turn Directions View */}
            {sidebarTab === "directions" && (
              <div className="space-y-3 pb-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSidebarTab("place")}
                    className="flex items-center gap-1.5 text-xs text-[#007AFF] hover:underline font-medium"
                  >
                    <ArrowLeft size={13} />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={clearRoute}
                    className="text-xs text-red-500 hover:underline font-medium"
                  >
                    End Route
                  </button>
                </div>

                {/* Mode Selector (Drive, Walk, Cycle) */}
                <div className="flex p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <button
                    onClick={() => {
                      setDirectionMode("driving");
                      if (activePlace) calculateRoute(activePlace, "driving");
                    }}
                    className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition ${
                      directionMode === "driving"
                        ? "bg-white dark:bg-[#2C2C2E] shadow-xs text-blue-500"
                        : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                    }`}
                  >
                    <Car size={13} />
                    <span>Drive</span>
                  </button>
                  <button
                    onClick={() => {
                      setDirectionMode("walking");
                      if (activePlace) calculateRoute(activePlace, "walking");
                    }}
                    className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition ${
                      directionMode === "walking"
                        ? "bg-white dark:bg-[#2C2C2E] shadow-xs text-blue-500"
                        : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                    }`}
                  >
                    <Footprints size={13} />
                    <span>Walk</span>
                  </button>
                  <button
                    onClick={() => {
                      setDirectionMode("cycling");
                      if (activePlace) calculateRoute(activePlace, "cycling");
                    }}
                    className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition ${
                      directionMode === "cycling"
                        ? "bg-white dark:bg-[#2C2C2E] shadow-xs text-blue-500"
                        : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                    }`}
                  >
                    <Bike size={13} />
                    <span>Bike</span>
                  </button>
                </div>

                {/* Route Summary Badge */}
                {isRouting ? (
                  <div className="py-6 flex flex-col items-center justify-center text-gray-400 gap-2">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs">Calculating optimal route...</span>
                  </div>
                ) : routeInfo ? (
                  <div
                    className={`p-3.5 rounded-2xl border ${
                      isDarkMode ? "bg-white/[0.04] border-white/10" : "bg-white border-black/5 shadow-xs"
                    }`}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-bold text-emerald-500 leading-none">{routeInfo.duration}</span>
                      <span className="text-xs font-medium text-gray-400">{routeInfo.distance}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                      Via fastest route · Moderate traffic
                    </p>

                    {/* Step-by-Step Instructions */}
                    <div className="mt-3.5 pt-3 border-t border-black/5 dark:border-white/5 space-y-2.5 max-h-56 overflow-y-auto scrollbar-thin pr-1">
                      {routeInfo.steps.map((st, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <span className="w-4 h-4 rounded-full bg-blue-500/10 text-[#007AFF] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[11.5px] leading-snug">{st.instruction}</p>
                            <span className="text-[10px] text-gray-400">{st.distance}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* VIEW C: Default Explore View */}
            {sidebarTab === "explore" && (
              <>
                {/* 1. Current Location Banner */}
                {userLocation && (
                  <div
                    onClick={centerOnMyLocation}
                    className={`p-3 rounded-2xl border cursor-pointer transition hover:scale-[1.01] ${
                      isDarkMode
                        ? "bg-white/[0.04] border-white/10 hover:bg-white/[0.07]"
                        : "bg-white border-black/5 hover:bg-gray-50 shadow-xs"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#007AFF] text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Navigation size={14} className="fill-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-semibold text-xs leading-none">My Location</h3>
                          {userLocation.isGps && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="GPS Active" />
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 dark:text-gray-400 truncate mt-0.5">
                          {userLocation.locality}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Find Nearby Categories */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">
                    Find Nearby
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CATEGORIES.slice(0, 6).map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCategorySearch(cat)}
                          className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-left border transition ${
                            isDarkMode
                              ? "bg-white/[0.03] border-white/5 hover:bg-white/[0.08]"
                              : "bg-white border-black/5 hover:bg-gray-50 shadow-2xs"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md ${cat.color} text-white flex items-center justify-center shrink-0`}>
                            <Icon size={11} />
                          </div>
                          <span className="text-[11.5px] font-medium truncate">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Favorites Section */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Favorites
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {favorites.length === 0 ? (
                      <p className="text-[11px] text-gray-400 px-1 py-1 italic">
                        Click "Save" on any location to pin it here.
                      </p>
                    ) : (
                      favorites.map((fav) => (
                        <div
                          key={fav.name}
                          onClick={() => selectPlace(fav)}
                          className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition"
                        >
                          <div className="w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                            <Heart size={12} className="fill-red-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-xs truncate">{fav.name}</h4>
                            <p className="text-[10.5px] text-gray-400 truncate">{fav.locality}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 4. Recents Section */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Recents
                    </span>
                    {recents.length > 0 && (
                      <button
                        onClick={() => {
                          playPopSound();
                          setRecents([]);
                        }}
                        className="text-[10.5px] text-[#007AFF] hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    {recents.length === 0 ? (
                      <p className="text-[11px] text-gray-400 px-1 py-1 italic">No recent searches yet.</p>
                    ) : (
                      recents.slice(0, 6).map((rec) => (
                        <div
                          key={rec.id || rec.name}
                          onClick={() => selectPlace(rec)}
                          className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition"
                        >
                          <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                            <Clock size={12} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-xs truncate">{rec.name}</h4>
                            <p className="text-[10.5px] text-gray-400 truncate">{rec.locality || rec.displayName}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Legal / Attribution Footer */}
          <div className="px-4 py-2.5 shrink-0 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10.5px] text-gray-400 mt-auto">
            <span>macOS Maps · RobsHs</span>
            <span className="hover:underline cursor-pointer">Terms ›</span>
          </div>
        </aside>
      )}

      {/* 4. Top Center: Dynamic Calibrated Apple Scale Widget */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-end justify-center pointer-events-none select-none">
        <div
          className={`flex flex-col items-center px-2 py-1 rounded-full backdrop-blur-md border ${
            isDarkMode ? "bg-black/35 border-white/10 text-white" : "bg-white/45 border-black/5 text-gray-800"
          }`}
        >
          <div className="flex justify-between w-full text-[9px] font-semibold tracking-wide leading-none px-0.5">
            <span>0</span>
            <span>{scaleInfo.midLabel}</span>
            <span>{scaleInfo.label}</span>
          </div>
          <svg width={scaleInfo.width} height="5" viewBox={`0 0 ${scaleInfo.width} 5`} fill="none" className="mt-0.5">
            <line x1="0" y1="2.5" x2={scaleInfo.width} y2="2.5" stroke="currentColor" strokeWidth="1.2" />
            <line x1="0.6" y1="0" x2="0.6" y2="5" stroke="currentColor" strokeWidth="1.2" />
            <line x1={scaleInfo.width / 2} y1="0" x2={scaleInfo.width / 2} y2="5" stroke="currentColor" strokeWidth="1.2" />
            <line x1={scaleInfo.width - 0.6} y1="0" x2={scaleInfo.width - 0.6} y2="5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>
      </div>

      {/* 5. Top Right: Floating Maps Utility Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 pointer-events-auto items-center">
        {/* Re-center / GPS Tracker Button */}
        <button
          onClick={centerOnMyLocation}
          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md border transition ${
            isLocating
              ? "animate-pulse bg-blue-500 text-white"
              : isDarkMode
              ? "bg-[#2C2C2E]/90 border-white/10 text-blue-400 hover:bg-[#3A3A3C]"
              : "bg-white/90 border-black/5 text-blue-500 hover:bg-white"
          }`}
          title="Center on My Location"
        >
          <Navigation size={13} className="fill-current rotate-[25deg]" />
        </button>

        {/* Map Layers Switcher Button & Popover */}
        <div className="relative">
          <button
            onClick={() => {
              playPopSound();
              setShowLayerMenu(!showLayerMenu);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md border transition ${
              showLayerMenu
                ? "bg-[#007AFF] text-white"
                : isDarkMode
                ? "bg-[#2C2C2E]/90 border-white/10 text-gray-300 hover:bg-[#3A3A3C]"
                : "bg-white/90 border-black/5 text-gray-700 hover:bg-white"
            }`}
            title="Map Views"
          >
            <Layers size={14} />
          </button>

          {/* Layer Menu Popover */}
          {showLayerMenu && (
            <div
              className={`absolute right-10 top-0 w-44 rounded-2xl border shadow-xl backdrop-blur-2xl p-1.5 z-30 space-y-1 ${
                isDarkMode ? "bg-[#2C2C2E]/95 border-white/10 text-white" : "bg-white/95 border-black/10 text-gray-800"
              }`}
            >
              <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Map Style</div>
              <button
                onClick={() => {
                  setMapTheme("standard");
                  setShowLayerMenu(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  mapTheme === "standard"
                    ? "bg-[#007AFF] text-white"
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <span>Explore</span>
                {mapTheme === "standard" && <Check size={13} />}
              </button>
              <button
                onClick={() => {
                  setMapTheme("satellite");
                  setShowLayerMenu(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  mapTheme === "satellite"
                    ? "bg-[#007AFF] text-white"
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <span>Satellite</span>
                {mapTheme === "satellite" && <Check size={13} />}
              </button>
              <button
                onClick={() => {
                  setMapTheme("transit");
                  setShowLayerMenu(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  mapTheme === "transit"
                    ? "bg-[#007AFF] text-white"
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <span>Transit</span>
                {mapTheme === "transit" && <Check size={13} />}
              </button>

              <div className="pt-1 mt-1 border-t border-black/5 dark:border-white/5">
                <button
                  onClick={() => setShowTraffic(!showTraffic)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    showTraffic ? "text-emerald-500 font-semibold" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <span>Traffic Overlay</span>
                  {showTraffic && <Check size={13} />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2D / 3D Perspective Toggle */}
        <button
          onClick={() => {
            playPopSound();
            setIs3D(!is3D);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md border font-bold text-[10.5px] transition ${
            is3D
              ? "bg-[#007AFF] text-white"
              : isDarkMode
              ? "bg-[#2C2C2E]/90 border-white/10 text-gray-300 hover:bg-[#3A3A3C]"
              : "bg-white/90 border-black/5 text-gray-700 hover:bg-white"
          }`}
          title="Toggle 3D View"
        >
          {is3D ? "2D" : "3D"}
        </button>

        {/* Zoom In (+) / Zoom Out (-) Capsule */}
        <div
          className={`flex flex-col rounded-full overflow-hidden shadow-md border ${
            isDarkMode ? "bg-[#2C2C2E]/90 border-white/10" : "bg-white/90 border-black/5"
          }`}
        >
          <button
            onClick={handleZoomIn}
            className={`w-8 h-8 flex items-center justify-center border-b transition ${
              isDarkMode
                ? "border-white/5 hover:bg-white/10 text-gray-200"
                : "border-black/5 hover:bg-black/5 text-gray-700"
            }`}
            title="Zoom In"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={handleZoomOut}
            className={`w-8 h-8 flex items-center justify-center transition ${
              isDarkMode ? "hover:bg-white/10 text-gray-200" : "hover:bg-black/5 text-gray-700"
            }`}
            title="Zoom Out"
          >
            <Minus size={14} />
          </button>
        </div>

        {/* Compass Dial Widget */}
        <button
          onClick={() => {
            playPopSound();
            if (mapRef.current) {
              const currentCenter = mapRef.current.getCenter();
              mapRef.current.setView(currentCenter, mapRef.current.getZoom());
            }
          }}
          className={`relative w-8 h-8 rounded-full flex items-center justify-center shadow-md border transition ${
            isDarkMode ? "bg-[#2C2C2E]/90 border-white/10" : "bg-white/90 border-black/5"
          }`}
          title="Reset Bearing"
        >
          <span className="absolute top-0.5 text-[7.5px] font-bold text-red-500">N</span>
          <div className="w-0.5 h-3.5 bg-red-500 rounded-full rotate-45 transform origin-center" />
        </button>
      </div>

      {/* 6. Bottom Right: Live Weather & Air Quality (AQI) Widget */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end">
        <button
          onClick={() => {
            playPopSound();
            setShowWeatherDetail(!showWeatherDetail);
          }}
          className={`px-3 py-1.5 rounded-2xl flex items-center gap-2 border shadow-lg backdrop-blur-xl transition hover:scale-105 ${
            isDarkMode
              ? "bg-[#2C2C2E]/85 border-white/10 text-white"
              : "bg-white/85 border-black/5 text-gray-800"
          }`}
          title="Click for weather details"
        >
          <CloudSun size={15} className="text-amber-500" />
          <span className="font-bold text-[12.5px] leading-none">{weatherData.temp}°</span>
          <div className="w-px h-3 bg-black/10 dark:bg-white/10" />
          <span className={`text-[10px] font-bold tracking-wide uppercase ${weatherData.aqiColor}`}>
            AQI {weatherData.aqi}
          </span>
        </button>

        {/* Weather Popover Card */}
        {showWeatherDetail && (
          <div
            className={`mt-2 p-3 w-48 rounded-2xl border shadow-xl backdrop-blur-2xl text-xs space-y-2 animate-in fade-in duration-200 ${
              isDarkMode ? "bg-[#2C2C2E]/95 border-white/10 text-white" : "bg-white/95 border-black/10 text-gray-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{weatherData.condition}</span>
              <span className="font-bold text-sm">{weatherData.temp}°C</span>
            </div>
            <div className="space-y-1 text-[11px] text-gray-400">
              <div className="flex justify-between">
                <span>Air Quality</span>
                <span className={`font-semibold ${weatherData.aqiColor}`}>{weatherData.aqiLevel}</span>
              </div>
              <div className="flex justify-between">
                <span>Humidity</span>
                <span className="text-inherit">{weatherData.humidity}%</span>
              </div>
              <div className="flex justify-between">
                <span>Wind Speed</span>
                <span className="text-inherit">{weatherData.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
