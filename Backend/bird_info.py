"""
Bird Information Database
Stores details for each bird species in the dataset.
"""

BIRD_INFO = {
    "Common Kingfisher": {
        "description": "The Common Kingfisher (Alcedo atthis) is a small kingfisher with seven subspecies recognized within its wide distribution across Eurasia and North Africa. It is resident in much of its range, but migrates from areas where rivers freeze in winter.",
        "habitat": "Rivers, canals, lakes, and ponds.",
        "diet": "Mainly fish, but also aquatic insects and crustaceans.",
        "scientific_name": "Alcedo atthis"
    },
    "Common Myna": {
        "description": "The Common Myna (Acridotheres tristis), sometimes spelled Mynah, is a member of the family Sturnidae (starlings) native to Asia. An omnivorous open woodland bird with a strong territorial instinct, the Common Myna has adapted extremely well to urban environments.",
        "habitat": "Urban areas, farmlands, and open country.",
        "diet": "Insects, crustaceans, arachnids, reptiles, small mammals, seeds, grain and fruits and discarded waste from human habitation.",
        "scientific_name": "Acridotheres tristis"
    },
    "House Crow": {
        "description": "The House Crow (Corvus splendens), also known as the Indian, Greynecked, Ceylon or Colombo crow, is a common bird of the crow family that is of Asian origin but now found in many parts of the world.",
        "habitat": "Closely associated with human habitation, cities, and towns.",
        "diet": "Omnivorous; eats refuse, small reptiles, insects, invertebrates, eggs, nestlings, grain and fruits.",
        "scientific_name": "Corvus splendens"
    },
    "Common Tailorbird": {
        "description": "The Common Tailorbird (Orthotomus sutorius) is a songbird found across tropical Asia. It is famous for its nest made of leaves 'sewn' together and is a common resident in urban gardens.",
        "habitat": "Deciduous forests, scrublands, mangroves, open woodlands, and gardens.",
        "diet": "Insects (beetles, bugs) and nectar from flowers.",
        "scientific_name": "Orthotomus sutorius"
    },
    "Coppersmith Barbet": {
        "description": "The Coppersmith Barbet (Psilopogon haemacephalus), also called the crimson-breasted barbet, is a bird with a distinct metronomic call that sounds like a coppersmith striking metal.",
        "habitat": "Gardens, groves, and sparse woodlands.",
        "diet": "Frugivorous (figs, berries, drupes) and occasionally insects.",
        "scientific_name": "Psilopogon haemacephalus"
    },
    "White-Breasted Kingfisher": {
        "description": "The White-Breasted Kingfisher (Halcyon smyrnensis) is a tree kingfisher widely distributed in Asia. It has a bright blue back, chestnut head and belly, and a white throat and breast.",
        "habitat": "Open country with trees, wires, or other perches; often found away from water.",
        "diet": "Large crustaceans, insects, earthworms, rodents, snakes, frogs, and fish.",
        "scientific_name": "Halcyon smyrnensis"
    },
    "Asian Green Bee-Eater": {
        "description": "The Asian Green Bee-Eater (Merops orientalis) is a near passerine bird in the bee-eater family. It is resident but prone to seasonal movements and is found widely distributed across sub-Saharan Africa from Senegal and the Gambia to Ethiopia, the Nile valley, western Arabia and Asia through India to Vietnam.",
        "habitat": "Open country with bushes, shrubs and small trees, farmlands and gardens.",
        "diet": "Mainly bees, wasps and other flying insects.",
        "scientific_name": "Merops orientalis"
    },
    "Hoopoe": {
        "description": "The Hoopoe (Upupa epops) is a colourful bird found across Afro-Eurasia, notable for its distinctive 'crown' of feathers. It is the only extant member of the family Upupidae.",
        "habitat": "Open woodlands, orchards, and cultivated land.",
        "diet": "Insects, small reptiles, and frogs.",
        "scientific_name": "Upupa epops"
    },
    "Jungle Babbler": {
        "description": "The Jungle Babbler (Turdoides striata) is a member of the family Leiothrichidae found in the Indian subcontinent. They are gregarious birds that forage in small groups of six to ten birds, a habit that has given them the popular name of 'Seven Sisters'.",
        "habitat": "Forests, scrublands, and gardens.",
        "diet": "Insects, spiders, small lizards, and berries.",
        "scientific_name": "Turdoides striata"
    },
    "Rufous Treepie": {
        "description": "The Rufous Treepie (Dendrocitta vagabunda) is a member of the crow family, Corvidae. It is native to the Indian Subcontinent and adjoining parts of Southeast Asia. It is long-tailed and has loud musical calls.",
        "habitat": "Open forest, gardens, and urban areas.",
        "diet": "Omnivorous; fruits, seeds, insects, small reptiles, and birds' eggs.",
        "scientific_name": "Dendrocitta vagabunda"
    }
}

def get_bird_info(bird_name):
    return BIRD_INFO.get(bird_name, {
        "description": "Information not available for this species.",
        "habitat": "Unknown",
        "diet": "Unknown",
        "scientific_name": "Unknown"
    })
