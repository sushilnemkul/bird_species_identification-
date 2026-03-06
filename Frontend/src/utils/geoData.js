// A manual mapping between the text returned by the backend `bird.hotspots`
// and precise geographic data for Nepal visualizations.

export const REGIONS = {
    MOUNTAIN: "Mountain",
    HILLY: "Hilly",
    TERAI: "Terai",
    URBAN: "Urban/Widespread",
};

// Represents known hotspots in Nepal from bird_info.py
export const NEPAL_HOTSPOTS_DB = {
    "Langtang National Park": { lat: 28.2166, lng: 85.5500, region: REGIONS.MOUNTAIN },
    "Sagarmatha National Park": { lat: 27.9333, lng: 86.7333, region: REGIONS.MOUNTAIN },
    "Kathmandu Valley (Shivapuri)": { lat: 27.8000, lng: 85.3833, region: REGIONS.HILLY },
    "Phulchowki": { lat: 27.5667, lng: 85.4000, region: REGIONS.HILLY },
    "Kathmandu Valley": { lat: 27.7172, lng: 85.3240, region: REGIONS.HILLY },
    "Kathmandu": { lat: 27.7172, lng: 85.3240, region: REGIONS.HILLY },
    "Chitwan National Park": { lat: 27.5341, lng: 84.4525, region: REGIONS.TERAI },
    "Bardia National Park": { lat: 28.4600, lng: 81.3361, region: REGIONS.TERAI },
    "Lumbini": { lat: 27.4812, lng: 83.2763, region: REGIONS.TERAI },
    "Kapilvastu": { lat: 27.5925, lng: 83.0537, region: REGIONS.TERAI },
    "Rupandehi": { lat: 27.5333, lng: 83.4333, region: REGIONS.TERAI },
    "Terai lowlands": { lat: 27.0000, lng: 85.0000, region: REGIONS.TERAI },
    "Bishnumati River": { lat: 27.7297, lng: 85.2913, region: REGIONS.HILLY },
    "Taudaha Lake": { lat: 27.6483, lng: 85.2825, region: REGIONS.HILLY },
    "Kosi Tappu": { lat: 26.6333, lng: 86.9667, region: REGIONS.TERAI },
    "Koshi Tappu": { lat: 26.6333, lng: 86.9667, region: REGIONS.TERAI },
    "Pokhara": { lat: 28.2096, lng: 83.9856, region: REGIONS.HILLY },
    "Pokhara Valley": { lat: 28.2096, lng: 83.9856, region: REGIONS.HILLY },
    "Terai towns": { lat: 26.8000, lng: 85.5000, region: REGIONS.TERAI },
    "Villages": { lat: 28.0000, lng: 84.0000, region: REGIONS.URBAN },
    "Terai gardens": { lat: 26.5000, lng: 86.0000, region: REGIONS.TERAI },
    "Terai wetlands": { lat: 26.5500, lng: 87.0000, region: REGIONS.TERAI },
    "Widespread across all urban centers in Nepal": { lat: 28.3949, lng: 84.1240, region: REGIONS.URBAN }
};

/**
 * Given a comma separated string of hotspots from the API, return data formatted for Recharts Pie Chart
 */
export const getRegionsFromHotspots = (hotspotsString) => {
    if (!hotspotsString || hotspotsString === "Unknown") return [];

    const locs = hotspotsString.split(',').map(s => s.trim());
    const regionCounts = {};

    locs.forEach(loc => {
        // Find if any key in DB matches exactly or partially.
        let matchedRegion = REGIONS.URBAN; // Default fallback
        for (const [key, value] of Object.entries(NEPAL_HOTSPOTS_DB)) {
            if (loc.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(loc.toLowerCase())) {
                matchedRegion = value.region;
                break;
            }
        }
        regionCounts[matchedRegion] = (regionCounts[matchedRegion] || 0) + 1;
    });

    // Format for Recharts { name, value }
    const chartData = Object.keys(regionCounts).map(region => ({
        name: region,
        value: regionCounts[region]
    }));

    return chartData;
}

/**
 * Given a comma separated string of hotspots from the API, return lat/lng markers for react-google-maps/api
 */
export const getCoordinatesFromHotspots = (hotspotsString) => {
    if (!hotspotsString || hotspotsString === "Unknown") return [];

    const locs = hotspotsString.split(',').map(s => s.trim());
    const markers = [];

    locs.forEach(loc => {
        // Find if any key in DB matches.
        for (const [key, value] of Object.entries(NEPAL_HOTSPOTS_DB)) {
            if (loc.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(loc.toLowerCase())) {
                markers.push({
                    name: key, // Use the proper DB name for label
                    lat: value.lat,
                    lng: value.lng,
                    region: value.region
                });
                break;
            }
        }
    });

    return markers;
}
