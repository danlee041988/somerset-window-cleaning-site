/**
 * Google Maps Integration for Somerset Window Cleaning
 * Handles address validation, service area mapping, and geocoding
 */

// Google Maps API configuration
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GeocodeResult {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    location_type: string;
    viewport: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
  };
  address_components: AddressComponent[];
  place_id: string;
  types: string[];
}

export interface AddressValidationResult {
  isValid: boolean;
  formattedAddress?: string;
  coordinates?: { lat: number; lng: number };
  postcode?: string;
  locality?: string;
  administrativeArea?: string;
  inServiceArea: boolean;
  distanceFromBase?: number;
  estimatedTravelTime?: number;
  confidence: 'high' | 'medium' | 'low';
  suggestions?: string[];
}

export interface ServiceArea {
  name: string;
  center: { lat: number; lng: number };
  radius: number; // in kilometers
  postcodes: string[];
  priority: 'primary' | 'secondary' | 'extended';
}

// Somerset Window Cleaning service areas
export const SERVICE_AREAS: ServiceArea[] = [
  {
    name: 'Wells & Street',
    center: { lat: 51.2091, lng: -2.6479 }, // Wells center
    radius: 8,
    postcodes: ['BA5', 'BA16'],
    priority: 'primary'
  },
  {
    name: 'Glastonbury',
    center: { lat: 51.1489, lng: -2.7143 },
    radius: 6,
    postcodes: ['BA6'],
    priority: 'primary'
  },
  {
    name: 'Burnham-on-Sea',
    center: { lat: 51.2387, lng: -2.9991 },
    radius: 8,
    postcodes: ['TA8', 'TA9'],
    priority: 'secondary'
  },
  {
    name: 'Bridgwater',
    center: { lat: 51.1279, lng: -2.9944 },
    radius: 10,
    postcodes: ['TA6', 'TA7'],
    priority: 'secondary'
  },
  {
    name: 'Weston-super-Mare',
    center: { lat: 51.3458, lng: -2.9777 },
    radius: 12,
    postcodes: ['BS22', 'BS23', 'BS24'],
    priority: 'extended'
  },
  {
    name: 'Taunton',
    center: { lat: 51.0184, lng: -3.1067 },
    radius: 15,
    postcodes: ['TA1', 'TA2', 'TA3'],
    priority: 'extended'
  }
];

// Business base location (Wells Enterprise Centre)
export const BUSINESS_BASE = {
  lat: 51.2091,
  lng: -2.6479,
  address: '15 Rockhaven Business Centre, Gravenchon Way, Walton, Street BA16 0RW'
};

/**
 * Validate and geocode an address using Google Maps API
 */
export async function validateAddress(address: string): Promise<AddressValidationResult> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key not configured');
    return {
      isValid: false,
      inServiceArea: false,
      confidence: 'low'
    };
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}&region=uk&components=country:GB`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return {
        isValid: false,
        inServiceArea: false,
        confidence: 'low',
        suggestions: data.status === 'ZERO_RESULTS' ? ['Check spelling and try again'] : []
      };
    }

    const result = data.results[0] as GeocodeResult;
    const coordinates = {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng
    };

    // Extract postcode and location details
    const postcodeComponent = result.address_components.find(
      component => component.types.includes('postal_code')
    );
    const localityComponent = result.address_components.find(
      component => component.types.includes('locality') || component.types.includes('postal_town')
    );
    const adminAreaComponent = result.address_components.find(
      component => component.types.includes('administrative_area_level_1')
    );

    const postcode = postcodeComponent?.long_name;
    const locality = localityComponent?.long_name;
    const administrativeArea = adminAreaComponent?.long_name;

    // Check service area coverage
    const serviceAreaCheck = checkServiceAreaCoverage(coordinates, postcode);
    
    // Calculate distance and travel time from business base
    const distanceFromBase = calculateDistance(BUSINESS_BASE, coordinates);
    const estimatedTravelTime = calculateTravelTime(distanceFromBase);

    // Determine confidence level
    let confidence: 'high' | 'medium' | 'low' = 'high';
    if (result.geometry.location_type === 'APPROXIMATE') confidence = 'medium';
    if (result.geometry.location_type === 'GEOMETRIC_CENTER') confidence = 'low';

    return {
      isValid: true,
      formattedAddress: result.formatted_address,
      coordinates,
      postcode,
      locality,
      administrativeArea,
      inServiceArea: serviceAreaCheck.inArea,
      distanceFromBase,
      estimatedTravelTime,
      confidence
    };

  } catch (error) {
    console.error('Address validation error:', error);
    return {
      isValid: false,
      inServiceArea: false,
      confidence: 'low'
    };
  }
}

/**
 * Check if coordinates are within service area
 */
function checkServiceAreaCoverage(
  coordinates: { lat: number; lng: number }, 
  postcode?: string
): { inArea: boolean; area?: ServiceArea; priority?: string } {
  
  // First check by postcode (more accurate)
  if (postcode) {
    const postcodePrefix = postcode.split(' ')[0]; // Get first part (e.g., "BA5" from "BA5 2PD")
    
    for (const area of SERVICE_AREAS) {
      if (area.postcodes.some(pc => postcodePrefix.startsWith(pc))) {
        return {
          inArea: true,
          area,
          priority: area.priority
        };
      }
    }
  }

  // Fallback to distance-based check
  for (const area of SERVICE_AREAS) {
    const distance = calculateDistance(area.center, coordinates);
    if (distance <= area.radius) {
      return {
        inArea: true,
        area,
        priority: area.priority
      };
    }
  }

  return { inArea: false };
}

/**
 * Calculate distance between two points (Haversine formula)
 */
function calculateDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Estimate travel time based on distance
 */
function calculateTravelTime(distanceKm: number): number {
  // Rough estimate: 40km/h average speed (includes traffic, stops)
  const avgSpeedKmh = 40;
  const travelTimeHours = distanceKm / avgSpeedKmh;
  return Math.round(travelTimeHours * 60); // Return minutes
}

/**
 * Get service area information for display
 */
export function getServiceAreaInfo(priority: string): {
  message: string;
  callToAction: string;
  pricing: string;
} {
  switch (priority) {
    case 'primary':
      return {
        message: 'Great! You\'re in our primary service area.',
        callToAction: 'We offer regular weekly, fortnightly, or monthly services.',
        pricing: 'Standard pricing applies'
      };
    case 'secondary':
      return {
        message: 'You\'re in our secondary service area.',
        callToAction: 'We visit this area regularly and can arrange service.',
        pricing: 'Standard pricing applies'
      };
    case 'extended':
      return {
        message: 'You\'re in our extended service area.',
        callToAction: 'We can arrange service, though visits may be less frequent.',
        pricing: 'May include small travel surcharge'
      };
    default:
      return {
        message: 'This location is outside our current service area.',
        callToAction: 'Please contact us to discuss special arrangements.',
        pricing: 'Custom quote required'
      };
  }
}

/**
 * Generate service area map data for frontend display
 */
export function generateServiceAreaMapData() {
  return {
    center: BUSINESS_BASE,
    businessLocation: BUSINESS_BASE,
    serviceAreas: SERVICE_AREAS.map(area => ({
      ...area,
      color: area.priority === 'primary' ? '#E11D2A' : 
             area.priority === 'secondary' ? '#FF6B6B' : '#FFA07A'
    }))
  };
}

/**
 * Autocomplete address suggestions using Google Places API
 */
export async function getAddressSuggestions(input: string): Promise<string[]> {
  if (!GOOGLE_MAPS_API_KEY || input.length < 3) {
    return [];
  }

  try {
    const encodedInput = encodeURIComponent(input);
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodedInput}&key=${GOOGLE_MAPS_API_KEY}&components=country:gb&types=address`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.predictions) {
      return data.predictions.map((prediction: any) => prediction.description);
    }

    return [];
  } catch (error) {
    console.error('Address autocomplete error:', error);
    return [];
  }
}