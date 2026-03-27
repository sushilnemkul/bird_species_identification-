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
        let matchedRegion = REGIONS.URBAN; // Default fallback
        let matched = false;

        // Exact or substring match in DB
        for (const [key, value] of Object.entries(NEPAL_HOTSPOTS_DB)) {
            if (loc.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(loc.toLowerCase())) {
                matchedRegion = value.region;
                matched = true;
                break;
            }
        }

        // Smarter Fallback for custom entries (e.g. from admin panel)
        if (!matched) {
            const l = loc.toLowerCase();
            if (l.includes("shivapuri") || l.includes("kathmandu") || l.includes("pokhara") || l.includes("hilly")) {
                matchedRegion = REGIONS.HILLY;
            } else if (l.includes("terai") || l.includes("chitwan") || l.includes("lumbini") || l.includes("koshi") || l.includes("kosi") || l.includes("bardia")) {
                matchedRegion = REGIONS.TERAI;
            } else if (l.includes("sagarmatha") || l.includes("langtang") || l.includes("mountain") || l.includes("himalaya")) {
                matchedRegion = REGIONS.MOUNTAIN;
            }
        }

        regionCounts[matchedRegion] = (regionCounts[matchedRegion] || 0) + 1;
    });

    return Object.keys(regionCounts).map(region => ({
        name: region,
        value: regionCounts[region]
    }));
}

/**
 * Given a comma separated string of hotspots from the API, return lat/lng markers for react-leaflet
 */
export const getCoordinatesFromHotspots = (hotspotsString) => {
    if (!hotspotsString || hotspotsString === "Unknown") return [];

    const locs = hotspotsString.split(',').map(s => s.trim());
    const markers = [];

    locs.forEach(loc => {
        let matched = false;
        // Exact or substring match in DB
        for (const [key, value] of Object.entries(NEPAL_HOTSPOTS_DB)) {
            if (loc.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(loc.toLowerCase())) {
                markers.push({
                    name: loc, // Provide the actual string so it looks natural in UI
                    lat: value.lat,
                    lng: value.lng,
                    region: value.region
                });
                matched = true;
                break;
            }
        }

        // Smarter Fallback for custom hotspot strings not hardcoded in DB
        if (!matched) {
            const l = loc.toLowerCase();
            if (l.includes("shivapuri")) {
                markers.push({ name: loc, lat: 27.8000, lng: 85.3833, region: REGIONS.HILLY });
            } else if (l.includes("terai") || l.includes("lowlands")) {
                markers.push({ name: loc, lat: 27.0000, lng: 85.0000, region: REGIONS.TERAI });
            } else if (l.includes("kathmandu") || l.includes("valley")) {
                markers.push({ name: loc, lat: 27.7172, lng: 85.3240, region: REGIONS.HILLY });
            } else if (l.includes("chitwan") || l.includes("national park")) { // Fallback national park usually Chitwan/Bardia
                markers.push({ name: loc, lat: 27.5341, lng: 84.4525, region: REGIONS.TERAI });
            } else if (l.includes("sagarmatha") || l.includes("mountain")) {
                markers.push({ name: loc, lat: 27.9333, lng: 86.7333, region: REGIONS.MOUNTAIN });
            } else if (l.includes("pokhara")) {
                markers.push({ name: loc, lat: 28.2096, lng: 83.9856, region: REGIONS.HILLY });
            } else if (l.includes("koshi") || l.includes("kosi")) {
                markers.push({ name: loc, lat: 26.6333, lng: 86.9667, region: REGIONS.TERAI });
            } else if (l.includes("bardia")) {
                markers.push({ name: loc, lat: 28.4600, lng: 81.3361, region: REGIONS.TERAI });
            }
        }
    });

    return markers;
}
