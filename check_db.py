import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Try to load env from both root and Backend folder
load_dotenv()
load_dotenv('Backend/.env')

db_url = os.getenv('DATABASE_URL')
print(f"DATABASE_URL found: {db_url}")

if not db_url:
    print("❌ No DATABASE_URL found in .env")
    sys.exit(1)

try:
    engine = create_engine(db_url)
    with engine.connect() as conn:
        print("✅ Successfully connected to database!")
        
        # Check tables
        result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
        tables = [row[0] for row in result]
        print(f"Tables found: {tables}")
        
        if 'birds' in tables:
            count = conn.execute(text("SELECT count(*) FROM birds")).scalar()
            print(f"Birds count: {count}")
            if count > 0:
                rows = conn.execute(text("SELECT common_name FROM birds LIMIT 5")).fetchall()
                print(f"Sample birds: {[row[0] for row in rows]}")
        
        if 'users' in tables:
            count = conn.execute(text("SELECT count(*) FROM users")).scalar()
            print(f"Users count: {count}")

        if 'bird_sightings' in tables:
            count = conn.execute(text("SELECT count(*) FROM bird_sightings")).scalar()
            print(f"Sightings count: {count}")

except Exception as e:
    print(f"❌ Database error: {e}")
