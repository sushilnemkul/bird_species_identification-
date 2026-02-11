"""
Bird Information Database
Stores details for each bird species in the dataset.
"""

BIRD_INFO = {
    "Himalayan Monal": {
        "description": "National bird of Nepal. Famous for its iridescent rainbow plumage. Found in high-altitude oak and rhododendron forests.",
        "habitat": "High Altitude Oak and Rhododendron Forests",
        "diet": "Tender leaves, shoots, nuts, and insects",
        "scientific_name": "Lophophorus impejanus",
        "wingspan": "29-32 cm",
        "lifespan": "10-12 years",
        "conservation_status": "Near Threatened (Nepal)",
        "fun_fact": "The male has a magnificent crest and can display up to nine different colors on its feathers.",
        "migration_status": "Altitudinal Migrant",
        "breeding_season": "April to August",
        "nepal_hotspots": "Langtang National Park, Sagarmatha National Park"
    },
    "Spiny Babbler": {
        "description": "The only bird species endemic to Nepal. Found only in the mid-hills scrublands.",
        "habitat": "Scrublands and dense secondary forests",
        "diet": "Insects, seeds, and small lizards",
        "scientific_name": "Turdoides nipalensis",
        "wingspan": "20-25 cm",
        "lifespan": "5-10 years",
        "conservation_status": "Vulnerable (National)",
        "fun_fact": "It was thought to be extinct for nearly 100 years until it was rediscovered in 1948.",
        "migration_status": "Resident",
        "breeding_season": "April to June",
        "nepal_hotspots": "Kathmandu Valley (Shivapuri), Phulchowki"
    },
    "Great Hornbill": {
        "description": "Large, impressive forest bird with a massive yellow and black bill. Found in lowland forests.",
        "habitat": "Old-growth broadleaf forests",
        "diet": "Mainly figs, fruit, and small vertebrates",
        "scientific_name": "Buceros bicornis",
        "wingspan": "151-178 cm",
        "lifespan": "35-50 years",
        "conservation_status": "Vulnerable (Global)",
        "fun_fact": "The female seals herself inside a tree cavity for months during nesting, fed by the male through a small slit.",
        "migration_status": "Resident",
        "breeding_season": "February to May",
        "nepal_hotspots": "Chitwan National Park, Bardia National Park"
    },
    "Sarus Crane": {
        "description": "The world's tallest flying bird, symbolized as a token of eternal love.",
        "habitat": "Wetlands and agricultural fields",
        "diet": "Small vertebrates, insects, and grains",
        "scientific_name": "Antigone antigone",
        "wingspan": "220-280 cm",
        "lifespan": "Up to 40 years",
        "conservation_status": "Vulnerable",
        "fun_fact": "They are known for their spectacular dancing displays and loud trumpeting calls.",
        "migration_status": "Resident / Local Migrant",
        "breeding_season": "June to September",
        "nepal_hotspots": "Lumbini, Kapilvastu, Rupandehi"
    },
    "Asian Green Bee-Eater": {
        "description": "The Asian Green Bee-Eater is a striking green bird with a long, thin tail. It catches bees and wasps mid-air.",
        "habitat": "Open country with bushes, shrubs and gardens.",
        "diet": "Mainly bees, wasps and other flying insects.",
        "scientific_name": "Merops orientalis",
        "wingspan": "29-49 cm",
        "lifespan": "12-18 years",
        "conservation_status": "Least Concern",
        "fun_fact": "They remove the sting of bees by rubbing the insect against a branch before eating.",
        "migration_status": "Resident",
        "breeding_season": "March to June",
        "nepal_hotspots": "Chitwan National Park, Terai lowlands"
    },
    "Common Kingfisher": {
        "description": "Vibrant blue and orange bird, a master of aquatic hunting. Indicator of healthy waters.",
        "habitat": "Rivers, canals, lakes, and ponds.",
        "diet": "Mainly fish and aquatic insects.",
        "scientific_name": "Alcedo atthis",
        "wingspan": "Around 25 cm",
        "lifespan": "2-7 years",
        "conservation_status": "Least Concern",
        "fun_fact": "A kingfisher can dive into water at speeds of up to 40 km/h using its third eyelid as an underwater lens.",
        "migration_status": "Resident",
        "breeding_season": "June to October",
        "nepal_hotspots": "Bishnumati River, Taudaha Lake, Kosi Tappu"
    },
    "Common Myna": {
        "description": "Familiar brown bird with a black head and bright yellow eye patches. Highly social and adaptable.",
        "habitat": "Urban areas, farmlands, and gardens.",
        "diet": "Omnivorous; insects, fruits, and seeds.",
        "scientific_name": "Acridotheres tristis",
        "wingspan": "12-14 cm",
        "lifespan": "4-12 years",
        "conservation_status": "Least Concern",
        "fun_fact": "They are known as the 'farmer's friend' because they eat grasshoppers and other crop pests.",
        "migration_status": "Resident",
        "breeding_season": "March to September",
        "nepal_hotspots": "Kathmandu Valley, Pokhara, Terai towns"
    },
    "House Crow": {
        "description": "Highly intelligent grey-necked crow always found near human habitation.",
        "habitat": "Cities, towns, and villages.",
        "diet": "Omnivorous scavenger.",
        "scientific_name": "Corvus splendens",
        "wingspan": "40 cm",
        "lifespan": "7-15 years",
        "conservation_status": "Least Concern",
        "fun_fact": "They can recognize individual human faces and remember past interactions with them.",
        "migration_status": "Resident",
        "breeding_season": "April to July",
        "nepal_hotspots": "Widespread across all urban centers in Nepal"
    },
    "Red-vented Bulbul": {
        "description": "Noisy, common bird with a black crest and a red patch under the tail. Found across most of Nepal.",
        "habitat": "Gardens, scrub, and forest edges.",
        "diet": "Fruits, nectar, and insects.",
        "scientific_name": "Pycnonotus cafer",
        "wingspan": "25-28 cm",
        "lifespan": "8-10 years",
        "conservation_status": "Least Concern",
        "fun_fact": "They are highly social and often found in pairs or small noisy groups.",
        "migration_status": "Resident",
        "breeding_season": "April to September",
        "nepal_hotspots": "Kathmandu, Villages, Terai gardens"
    },
    "White-Breasted Kingfisher": {
        "description": "Bold bird with a bright blue back and white breast. Often hunts far away from water bodies.",
        "habitat": "Agricultural land, garden edges, and wetlands.",
        "diet": "Large insects, rodents, snakes, and frogs.",
        "scientific_name": "Halcyon smyrnensis",
        "wingspan": "11-13 cm",
        "lifespan": "11 years",
        "conservation_status": "Least Concern",
        "fun_fact": "Unlike most kingfishers, they often hunt far away from water for rodents and frogs.",
        "migration_status": "Resident",
        "breeding_season": "January to August",
        "nepal_hotspots": "Koshi Tappu, Pokhara Valley, Terai wetlands"
    },
}

def get_bird_info(bird_name):
    # Try exact match first
    info = BIRD_INFO.get(bird_name)
    if info:
        return info
    
    # Try common alias (e.g., White-throated Kingfisher vs White-Breasted)
    if bird_name == "White-throated Kingfisher":
        return BIRD_INFO.get("White-Breasted Kingfisher")
        
    return {
        "description": "Information not available for this species.",
        "habitat": "Unknown",
        "diet": "Unknown",
        "scientific_name": "Unknown",
        "wingspan": "Unknown",
        "lifespan": "Unknown",
        "conservation_status": "Unknown",
        "fun_fact": "No fun facts recorded yet for this species.",
        "migration_status": "Unknown",
        "breeding_season": "Unknown",
        "nepal_hotspots": "Unknown"
    }
