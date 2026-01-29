import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='Backend/.env')

def create_bird_species_db():
    # Connection parameters to the default 'postgres' database
    # We use the password from the .env if available, or 'admin' as seen in the URL
    db_url = os.getenv('DATABASE_URL')
    # Parse URL manually for simplicity here or use specific parts
    # postgresql://postgres:admin@localhost:5433/BirdSpecies
    
    conn = psycopg2.connect(
        dbname='postgres',
        user='postgres',
        password='admin',
        host='localhost',
        port='5433'
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    try:
        cursor.execute('CREATE DATABASE "BirdSpecies"')
        print("Database 'BirdSpecies' created successfully.")
    except psycopg2.errors.DuplicateDatabase:
        print("Database 'BirdSpecies' already exists.")
    except Exception as e:
        print(f"Error creating database: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    create_bird_species_db()
