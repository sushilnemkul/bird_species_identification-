import os
import sys
from dotenv import load_dotenv
from flask import Flask

# Add Backend to path
sys.path.append(os.path.abspath('Backend'))

from models import db, Bird

# Load env
load_dotenv(dotenv_path='Backend/.env')

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

birds_data = [
    {
        "commonName": "Himalayan Monal",
        "scientificName": "Lophophorus impejanus",
        "description": "The national bird of Nepal, known for its stunning iridescent plumage. Found in high-altitude oak and rhododendron forests.",
        "rarity": "Rare",
        "habitat": "High Altitude Forest",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Himalayan_Monal_Lal_Durga_Prasad.jpg/640px-Himalayan_Monal_Lal_Durga_Prasad.jpg"
    },
    {
        "commonName": "Spiny Babbler",
        "scientificName": "Turdoides nipalensis",
        "description": "The only bird species found only in Nepal (endemic). It's a shy bird found in scrublands between 800m to 2000m.",
        "rarity": "Endemic",
        "habitat": "Scrubland",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Spiny_Babbler.jpg/640px-Spiny_Babbler.jpg"
    },
    {
        "commonName": "Great Hornbill",
        "scientificName": "Buceros bicornis",
        "description": "A large, impressive bird with a massive yellow and black bill and casque. Found in low-land forests of the Terai.",
        "rarity": "Rare",
        "habitat": "Subtropical Forest",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Great_Hornbill_-_Thailand.jpg/640px-Great_Hornbill_-_Thailand.jpg"
    },
    {
        "commonName": "Cheer Pheasant",
        "scientificName": "Catreus wallichii",
        "description": "A shy, brownish pheasant with a long tail and a red face patch. Found in steep grassy slopes and cliffs.",
        "rarity": "Rare",
        "habitat": "Grassy Slopes",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Cheer_Pheasant_Lophophorus.jpg/640px-Cheer_Pheasant_Lophophorus.jpg"
    },
    {
        "commonName": "Satyr Tragopan",
        "scientificName": "Tragopan satyra",
        "description": "A beautiful forest pheasant. The male is bright red with white spots and horns that it displays during courtship.",
        "rarity": "Rare",
        "habitat": "Moist Forest",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Tragopan_satyra_male_1.jpg/640px-Tragopan_satyra_male_1.jpg"
    },
    {
        "commonName": "Sarus Crane",
        "scientificName": "Antigone antigone",
        "description": "The world's tallest flying bird. Distinctive red head and upper neck. Found in wetlands and agricultural fields of the Terai.",
        "rarity": "Rare",
        "habitat": "Wetlands",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Grus_antigone_L_K_Giri.jpg/640px-Grus_antigone_L_K_Giri.jpg"
    },
    {
        "commonName": "White-throated Kingfisher",
        "scientificName": "Halcyon smyrnensis",
        "description": "A bright blue bird with a chocolate-brown head and a white throat. Often seen perched on wires and branches away from water.",
        "rarity": "Common",
        "habitat": "Open Country",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/White-throated_Kingfisher_Halcyon_smyrnensis.jpg/640px-White-throated_Kingfisher_Halcyon_smyrnensis.jpg"
    },
    {
        "commonName": "Common Myna",
        "scientificName": "Acridotheres tristis",
        "description": "A very familiar urban bird. It's brown with a black head and bright yellow around the eyes and leg.",
        "rarity": "Very Common",
        "habitat": "Urban / Farms",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Common_Myna_%28Acridotheres_tristis%29.jpg/640px-Common_Myna_%28Acridotheres_tristis%29.jpg"
    },
    {
        "commonName": "Blue Whistling Thrush",
        "scientificName": "Myophonus caeruleus",
        "description": "A dark blue bird found near rocky streams. It has a beautiful whistling song, often heard at dawn and dusk.",
        "rarity": "Common",
        "habitat": "Mountain Streams",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Blue_Whistling_Thrush_Myophonus_caeruleus.jpg/640px-Blue_Whistling_Thrush_Myophonus_caeruleus.jpg"
    },
    {
        "commonName": "Himalayan Griffon",
        "scientificName": "Gyps himalayensis",
        "description": "A massive vulture found in the Himalayas. Often seen soaring in large groups over mountains.",
        "rarity": "Common",
        "habitat": "High Mountains",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Himalayan_Griffon_Vulture_Gyps_himalayensis.jpg/640px-Himalayan_Griffon_Vulture_Gyps_himalayensis.jpg"
    },
    {
        "commonName": "Steppe Eagle",
        "scientificName": "Aquila nipalensis",
        "description": "A large bird of prey that migrates through Nepal in large numbers, especially across the Kali Gandaki valley.",
        "rarity": "Common",
        "habitat": "High Pass / Hills",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Steppe_Eagle_Aquila_nipalensis.jpg/640px-Steppe_Eagle_Aquila_nipalensis.jpg"
    },
    {
        "commonName": "Red-vented Bulbul",
        "scientificName": "Pycnonotus cafer",
        "description": "A noisy, common garden bird with a black crest and a red patch under the tail. Found across most of Nepal.",
        "rarity": "Very Common",
        "habitat": "Gardens / Scrub",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Red-vented_Bulbul_Pycnonotus_cafer.jpg/640px-Red-vented_Bulbul_Pycnonotus_cafer.jpg"
    },
    {
        "commonName": "House Crow",
        "scientificName": "Corvus splendens",
        "description": "The ubiquitous urban bird of Nepal, found in almost every town and city. Highly intelligent and adaptable.",
        "rarity": "Very Common",
        "habitat": "Urban",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/House_Crow_%28Corvus_splendens%29.jpg/640px-House_Crow_%28Corvus_splendens%29.jpg"
    },
    {
        "commonName": "Oriental Pied Hornbill",
        "scientificName": "Anthracoceros albirostris",
        "description": "The smallest of the hornbills in Nepal. Black and white bird with a creamy yellow casque. Found in the Terai.",
        "rarity": "Uncommon",
        "habitat": "Lowland Forest",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Oriental_Pied_Hornbill_Anthracoceros_albirostris.jpg/640px-Oriental_Pied_Hornbill_Anthracoceros_albirostris.jpg"
    },
    {
        "commonName": "Spangled Drongo",
        "scientificName": "Dicrurus hottentottus",
        "description": "A black bird with iridescent blue 'spangles' and a distinctive curled outer tail feather. Found in mixed forests.",
        "rarity": "Common",
        "habitat": "Deciduous Forest",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Hair-crested_Drongo_RWD.jpg/640px-Hair-crested_Drongo_RWD.jpg"
    },
    {
        "commonName": "Great Slatey Woodpecker",
        "scientificName": "Mulleripicus pulverulentus",
        "description": "The world's largest woodpecker. It has a slate-grey body and a very long neck. Highly endangered and rare.",
        "rarity": "Rare",
        "habitat": "Old Growth Forest",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Mulleripicus_pulverulentus.jpg/640px-Mulleripicus_pulverulentus.jpg"
    },
    {
        "commonName": "Ibisbill",
        "scientificName": "Ibidorhyncha struthersii",
        "description": "A unique bird with a long down-curved red bill. Found on shingly riverbeds in high altitude mountains.",
        "rarity": "Rare",
        "habitat": "Rocky Rivers",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Ibisbill_Ibidorhyncha_struthersii.jpg/640px-Ibisbill_Ibidorhyncha_struthersii.jpg"
    },
    {
        "commonName": "Blood Pheasant",
        "scientificName": "Ithaginis cruentus",
        "description": "A high-altitude pheasant. Males are grey and green with bright crimson streaks on the breast and tail.",
        "rarity": "Rare",
        "habitat": "Alpine Scub",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Blood_pheasant.jpg/640px-Blood_pheasant.jpg"
    },
    {
        "commonName": "Kalij Pheasant",
        "scientificName": "Lophura leucomelanos",
        "description": "A common forest pheasant. Males are glossy blue-black with a white rump and a red face patch. Found in middle hills.",
        "rarity": "Common",
        "habitat": "Hill Forest",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Kalij_Pheasant_Nepal.jpg/640px-Kalij_Pheasant_Nepal.jpg"
    },
    {
        "commonName": "Rufous-bellied Niltava",
        "scientificName": "Niltava sundara",
        "description": "A beautiful flycatcher. The male has deep blue upperparts and bright rufous underparts. Found in forest edges.",
        "rarity": "Common",
        "habitat": "Subtropical Forest",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Rufous-bellied_Niltava_Niltava_sundara.jpg/640px-Rufous-bellied_Niltava_Niltava_sundara.jpg"
    }
]

with app.app_context():
    db.create_all() # Ensure tables exist in the new database
    for bird_data in birds_data:
        try:
            if not Bird.query.filter_by(common_name=bird_data['commonName']).first():
                bird = Bird(
                    common_name=bird_data['commonName'],
                    scientific_name=bird_data['scientificName'],
                    description=bird_data['description'],
                    habitat=bird_data['habitat'],
                    rarity=bird_data['rarity'],
                    image_url=bird_data['image']
                )
                db.session.add(bird)
        except Exception as e:
            print(f"Error seeding {bird_data['commonName']}: {e}")
    db.session.commit()
    print("Direct seed successful!")
