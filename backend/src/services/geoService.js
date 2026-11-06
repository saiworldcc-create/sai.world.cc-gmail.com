/**
 * Geo & Location Service Adapter
 * Provides OpenStreetMap (OSM) / Nominatim geocoding, reverse geocoding, and offline caching
 * Complies with OSM Usage Policy: strictly throttled, custom User-Agent, local memory cache
 */

const https = require('https');

// Built-in offline geographical dictionary for major Sai Logistics hubs and international routes
const OFFLINE_LOCATIONS = {
  'kadapa': { lat: 14.4673, lng: 78.8242, name: 'Kadapa Main Hub (Co-operative Colony), AP, India' },
  'hyderabad': { lat: 17.2403, lng: 78.4294, name: 'RGIA Shamshabad Air Cargo Gateway, Hyderabad, Telangana' },
  'vijayawada': { lat: 16.5062, lng: 80.6480, name: 'Vijayawada Regional Dispatch Facility, AP, India' },
  'tirupati': { lat: 13.6288, lng: 79.4192, name: 'Tirupati Branch Hub, AP, India' },
  'kurnool': { lat: 15.8281, lng: 78.0373, name: 'Kurnool Logistics Center, AP, India' },
  'nellore': { lat: 14.4426, lng: 79.9865, name: 'Nellore Express Depot, AP, India' },
  'bengaluru': { lat: 13.1986, lng: 77.7066, name: 'Bengaluru Cargo Center, Karnataka, India' },
  'chennai': { lat: 12.9941, lng: 80.1709, name: 'Chennai Port Air Hub, Tamil Nadu, India' },
  'mumbai': { lat: 19.0896, lng: 72.8656, name: 'Mumbai International Air Gateway, India' },
  'delhi': { lat: 28.5562, lng: 77.1000, name: 'Indira Gandhi International Airport, Delhi, India' },
  'usa': { lat: 40.6413, lng: -73.7781, name: 'JFK International Airport Gateway, New York, USA' },
  'uk': { lat: 51.4700, lng: -0.4543, name: 'London Heathrow Airport Cargo Terminal, UK' },
  'australia': { lat: -33.9399, lng: 151.1753, name: 'Sydney Kingsford Smith Airport Hub, Australia' },
  'uae': { lat: 25.2532, lng: 55.3657, name: 'Dubai International Cargo Mega Terminal, UAE' },
  'canada': { lat: 43.6777, lng: -79.6248, name: 'Toronto Pearson International Cargo Hub, Canada' },
};

// In-memory geocoding cache to minimize external network requests
const geoCache = new Map();

// Throttle queue for OSM Nominatim (Rate limit: max 1 request per second)
let lastRequestTime = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate great-circle distance between two coordinates in kilometers using Haversine formula
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

class GeoService {
  /**
   * Geocode an address to lat/lng
   */
  async geocode(address) {
    if (!address || typeof address !== 'string') {
      return OFFLINE_LOCATIONS['kadapa'];
    }

    const cleanQuery = address.trim().toLowerCase();

    // 1. Check in-memory cache
    if (geoCache.has(cleanQuery)) {
      return { ...geoCache.get(cleanQuery), cached: true };
    }

    // 2. Check offline regional dictionary
    for (const [key, loc] of Object.entries(OFFLINE_LOCATIONS)) {
      if (cleanQuery.includes(key)) {
        geoCache.set(cleanQuery, loc);
        return { ...loc, source: 'offline_catalog' };
      }
    }

    // 3. Query OpenStreetMap Nominatim with strict rate limiting (1 req/sec)
    try {
      const now = Date.now();
      const elapsed = now - lastRequestTime;
      if (elapsed < 1100) {
        await sleep(1100 - elapsed);
      }
      lastRequestTime = Date.now();

      const encodedQuery = encodeURIComponent(address);
      const url = `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=1`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'SaiInternationalCouriers/2.0 (contact: info@sai-couriers.com)'
        }
      });

      if (response.ok) {
        const results = await response.json();
        if (Array.isArray(results) && results.length > 0) {
          const loc = {
            lat: parseFloat(results[0].lat),
            lng: parseFloat(results[0].lon),
            name: results[0].display_name,
            source: 'osm_nominatim'
          };
          geoCache.set(cleanQuery, loc);
          return loc;
        }
      }
    } catch (err) {
      console.warn('⚠️ GeoService: Nominatim query failed, falling back to Kadapa Hub:', err.message);
    }

    // Safe fallback to central Kadapa HQ
    return { ...OFFLINE_LOCATIONS['kadapa'], source: 'fallback_hq' };
  }

  /**
   * Calculate estimated transit mileage and transit time
   */
  async calculateTransitMetrics(originAddress, destAddress) {
    const origin = await this.geocode(originAddress);
    const dest = await this.geocode(destAddress);

    const distanceKm = calculateDistanceKm(origin.lat, origin.lng, dest.lat, dest.lng);
    
    // Estimate transit speed: road (45 km/h) for < 1000km; air cargo (650 km/h) for > 1000km
    const isAir = distanceKm > 1000;
    const transitHours = isAir 
      ? Math.round((distanceKm / 650) + 24) // includes hub transfer & customs
      : Math.round((distanceKm / 45) + 4);

    return {
      distanceKm,
      isAirCargo: isAir,
      estimatedTransitHours: transitHours,
      estimatedTransitDays: Math.max(1, Math.ceil(transitHours / 24)),
      originCoordinates: { lat: origin.lat, lng: origin.lng },
      destCoordinates: { lat: dest.lat, lng: dest.lng }
    };
  }
}

module.exports = new GeoService();

