import os
import requests
import json
from dotenv import load_dotenv

# --- 1. CONFIGURACIÓN DE RUTAS INTELIGENTE (Buenas Prácticas) ---
# Obtenemos la ruta absoluta de ESTE archivo (get_insta.py)
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

# Subimos un nivel para llegar a la raíz del proyecto (donde está package.json y .env)
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)

# Definimos rutas absolutas para evitar errores de "archivo no encontrado"
DOTENV_PATH = os.path.join(PROJECT_ROOT, '.env')
OUTPUT_FILE = os.path.join(PROJECT_ROOT, "src", "data", "instagram.json")

# --- 2. CARGA Y VALIDACIÓN DE VARIABLES DE ENTORNO ---
# Forzamos la carga desde la ruta específica
loaded = load_dotenv(DOTENV_PATH)

# Obtenemos el token
ACCESS_TOKEN = os.getenv("INSTAGRAM_ACCESS_TOKEN")

# VALIDACIÓN: Si no hay token o no cargó el archivo, detenemos el script
if not loaded or not ACCESS_TOKEN:
    print("❌ ERROR CRÍTICO DE CONFIGURACIÓN")
    print(f"No se pudo leer el token. Verifica lo siguiente:")
    print(f"1. Que exista el archivo: {DOTENV_PATH}")
    print(f"2. Que dentro tenga la línea: INSTAGRAM_ACCESS_TOKEN=tu_token_aqui")
    exit(1) # Salir con error

# --- 3. FUNCIONES DEL NEGOCIO ---

def get_instagram_business_id():
    """Busca el ID de la cuenta de Instagram Business vinculada"""
    url = "https://graph.facebook.com/v21.0/me/accounts"
    params = {
        "access_token": ACCESS_TOKEN,
        "fields": "instagram_business_account"
    }
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        # Validación de error en la API (Token vencido, etc.)
        if "error" in data:
            print(f"❌ Error de API: {data['error']['message']}")
            return None

        # Buscar la primera página con cuenta de IG
        if "data" in data:
            for page in data["data"]:
                if "instagram_business_account" in page:
                    return page["instagram_business_account"]["id"]
        
        print("⚠️ No se encontró ninguna cuenta de Instagram Business vinculada.")
        return None
    except Exception as e:
        print(f"❌ Error de conexión (ID): {e}")
        return None

def get_media(ig_id):
    """Descarga los posts usando el ID encontrado"""
    url = f"https://graph.facebook.com/v21.0/{ig_id}/media"
    fields = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp"
    params = {
        "access_token": ACCESS_TOKEN,
        "fields": fields,
        "limit": 9 
    }
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        if "error" in data:
            print(f"❌ Error al pedir fotos: {data['error']['message']}")
            return []
            
        return data.get("data", [])
    except Exception as e:
        print(f"❌ Error de conexión (Media): {e}")
        return []

def save_json(data):
    """Guarda el archivo para Astro"""
    try:
        # Asegurar que la carpeta src/data exista
        os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
        
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"¡Éxito! Datos guardados en: {OUTPUT_FILE}")
    except Exception as e:
        print(f"❌ Error al escribir archivo: {e}")

# --- 4. EJECUCIÓN PRINCIPAL ---
if __name__ == "__main__":
    print("🔄 Iniciando sincronización con Instagram...")
    
    ig_id = get_instagram_business_id()
    
    if ig_id:
        print(f"📍 ID de cuenta: {ig_id}")
        print("📥 Descargando últimos posts...")
        posts = get_media(ig_id)
        
        if posts:
            save_json(posts)
        else:
            print("⚠️ La cuenta existe pero no devolvió posts.")
    else:
        print("⏹️ Proceso detenido.")