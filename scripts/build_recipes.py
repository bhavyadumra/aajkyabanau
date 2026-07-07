#!/usr/bin/env python3
"""
build_recipes.py — Aaj Kya Banau? Kaggle Dataset ETL Pipeline
==============================================================
Downloads, merges, cleans and normalises 4 Kaggle Indian food datasets
into a single `app-build/data/recipes.json` that the Next.js app imports.

Usage:
    python3 scripts/build_recipes.py [--force]

Flags:
    --force   Re-download even if raw CSVs already exist

Requirements (auto-installed if missing):
    pip install pandas kaggle

Kaggle credentials:
    Place ~/.kaggle/kaggle.json with {"username": "...", "key": "..."}
    OR download CSVs manually and place them in data/raw/:
        data/raw/indian_food_kritirathi.csv   (kritirathi dataset)
        data/raw/indian_food_101.csv          (nehaprabhavalkar dataset)
        data/raw/cleaned_recipes.csv          (sooryaprakash12 dataset)
"""

import sys
import os
import json
import re
import subprocess
import logging
import argparse
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(message)s")
log = logging.getLogger(__name__)

# ── Paths ──────────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
ROOT = SCRIPT_DIR.parent
RAW_DIR = ROOT / "data" / "raw"
OUT_JSON = ROOT / "app-build" / "data" / "recipes.json"

RAW_DIR.mkdir(parents=True, exist_ok=True)

# ── Auto-install dependencies ──────────────────────────────────────────────────
def ensure_deps():
    for pkg in ["pandas", "kaggle"]:
        try:
            __import__(pkg)
        except ImportError:
            log.info(f"Installing {pkg}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", pkg, "-q"])

ensure_deps()
import pandas as pd  # noqa: E402

# ── Kaggle datasets to download ────────────────────────────────────────────────
DATASETS = [
    {
        "slug": "kritirathi/indian-food-dataset-with",
        "raw_files": ["indian_food.csv"],
        "target": "indian_food_kritirathi.csv",
    },
    {
        "slug": "nehaprabhavalkar/indian-food-101",
        "raw_files": ["indian_food.csv"],
        "target": "indian_food_101.csv",
    },
    {
        "slug": "sooryaprakash12/cleaned-indian-recipes-dataset",
        "raw_files": ["Cleaned_Indian_Food_Dataset.csv"],
        "target": "cleaned_recipes.csv",
    },
    # l33tc0d3r is images-only (no structured CSV with recipe data); skip
]

def download_datasets(force=False):
    """Download all Kaggle datasets unless raw CSVs already exist."""
    kaggle_json = Path.home() / ".kaggle" / "kaggle.json"
    if not kaggle_json.exists():
        log.warning(
            "~/.kaggle/kaggle.json not found. Skipping auto-download.\n"
            "  -> Create your token at https://www.kaggle.com/account\n"
            "  -> Or manually place CSVs in data/raw/ (see script docstring)."
        )
        return

    try:
        from kaggle.api.kaggle_api_extended import KaggleApi
        api = KaggleApi()
        api.authenticate()
    except Exception as e:
        log.warning(f"Kaggle auth failed: {e}. Trying CLI fallback...")
        api = None

    import shutil
    tmp_dir = RAW_DIR / "tmp"
    tmp_dir.mkdir(parents=True, exist_ok=True)

    for ds in DATASETS:
        target_path = RAW_DIR / ds["target"]
        if target_path.exists() and not force:
            log.info(f"  Already exists: {ds['target']} — skipping download")
            continue

        log.info(f"  Downloading {ds['slug']}...")
        try:
            if api:
                api.dataset_download_files(
                    ds["slug"], path=str(tmp_dir), unzip=True, quiet=False
                )
                for fname in ds["raw_files"]:
                    candidates = list(tmp_dir.rglob(fname))
                    if candidates:
                        candidates[0].rename(target_path)
                        log.info(f"  Saved: {ds['target']}")
                        break
                else:
                    log.warning(f"  {ds['raw_files'][0]} not found in archive for {ds['slug']}")
            else:
                subprocess.check_call(
                    ["kaggle", "datasets", "download", "-d", ds["slug"],
                     "-p", str(tmp_dir), "--unzip"],
                    timeout=120,
                )
        except Exception as e:
            log.warning(f"  Failed to download {ds['slug']}: {e}")

    shutil.rmtree(tmp_dir, ignore_errors=True)


# ── Ingredient normalisation map ────────────────────────────────────────────────
# Maps raw ingredient string fragments -> app slug IDs from ingredients.ts
# Longer/more specific strings must come BEFORE shorter ones (processed in order).
INGREDIENT_MAP = [
    # Vegetables
    ("spring onion", "onion"), ("shallot", "onion"), ("onion", "onion"),
    ("tomato puree", "tomato"), ("tomatoes", "tomato"), ("tomato", "tomato"),
    ("baby potato", "potato"), ("potatoes", "potato"), ("potato", "potato"),
    ("garlic paste", "garlic"), ("garlic clove", "garlic"), ("garlic", "garlic"),
    ("ginger garlic paste", "garlic"), ("ginger paste", "ginger"),
    ("ginger", "ginger"),
    ("green chilly", "green-chilli"), ("green chilli", "green-chilli"),
    ("green chili", "green-chilli"), ("green pepper", "green-chilli"),
    ("capsicum", "capsicum"), ("bell pepper", "capsicum"),
    ("cauliflower", "cauliflower"), ("gobi", "cauliflower"),
    ("green peas", "peas"), ("peas", "peas"), ("matar", "peas"),
    ("spinach", "spinach"), ("palak", "spinach"),
    ("brinjal", "brinjal"), ("eggplant", "brinjal"), ("aubergine", "brinjal"),
    ("baingan", "brinjal"),
    ("bottle gourd", "bottle-gourd"), ("lauki", "bottle-gourd"), ("doodhi", "bottle-gourd"),
    ("bitter gourd", "bitter-gourd"), ("karela", "bitter-gourd"),
    ("ridge gourd", "ridge-gourd"), ("turai", "ridge-gourd"),
    ("carrot", "carrot"), ("gajar", "carrot"),
    ("french bean", "beans"), ("green bean", "beans"), ("beans", "beans"),
    ("sweet corn", "corn"), ("corn", "corn"), ("maize", "corn"),
    ("mushroom", "mushroom"),
    ("cabbage", "cabbage"), ("patta gobi", "cabbage"),
    ("sweet potato", "sweet-potato"), ("shakarkandi", "sweet-potato"),
    ("radish", "radish"), ("mooli", "radish"),
    ("drumstick", "drumstick"), ("moringa", "drumstick"),
    ("raw banana", "raw-banana"), ("plantain", "raw-banana"),
    ("colocasia", "colocasia"), ("arbi", "colocasia"), ("taro", "colocasia"),
    ("cucumber", "cucumber"), ("kheera", "cucumber"),
    ("pumpkin", "pumpkin"), ("kaddu", "pumpkin"),
    ("raw mango", "raw-mango"), ("green mango", "raw-mango"),
    # Pulses & Dal
    ("toor dal", "toor-dal"), ("tuvar dal", "toor-dal"), ("arhar dal", "toor-dal"),
    ("yellow lentil", "moong-dal"), ("moong dal", "moong-dal"),
    ("moong dhal", "moong-dal"), ("mung dal", "moong-dal"),
    ("chana dal", "chana-dal"), ("gram dal", "chana-dal"),
    ("urad dal", "urad-dal"), ("black lentil", "urad-dal"),
    ("masoor dal", "masoor-dal"), ("red lentil", "masoor-dal"), ("lentil", "masoor-dal"),
    ("kidney bean", "rajma"), ("rajma", "rajma"),
    ("kabuli chana", "kabuli-chana"), ("chickpea", "kabuli-chana"), ("chole", "kabuli-chana"),
    ("kala chana", "kala-chana"), ("black chickpea", "kala-chana"),
    ("whole moong", "moong-whole"), ("sabut moong", "moong-whole"),
    ("lobia", "lobia"), ("black eyed pea", "lobia"),
    # Flour & Grains
    ("whole wheat flour", "atta"), ("wheat flour", "atta"), ("chapati flour", "atta"), ("atta", "atta"),
    ("basmati rice", "rice"), ("rice", "rice"), ("chawal", "rice"),
    ("all purpose flour", "maida"), ("refined flour", "maida"), ("maida", "maida"),
    ("gram flour", "besan"), ("chickpea flour", "besan"), ("besan", "besan"),
    ("semolina", "sooji"), ("sooji", "sooji"), ("rava", "sooji"), ("suji", "sooji"),
    ("poha", "poha"), ("flattened rice", "poha"), ("beaten rice", "poha"),
    ("oats", "oats"),
    ("corn flour", "cornflour"), ("cornflour", "cornflour"), ("cornstarch", "cornflour"),
    ("bread crumb", "bread"), ("bread slice", "bread"), ("bread", "bread"),
    ("bajra", "millet"), ("pearl millet", "millet"), ("millet", "millet"),
    ("jowar", "jowar"), ("sorghum", "jowar"),
    ("rice flour", "rice-flour"),
    ("vermicelli", "vermicelli"), ("sevai", "vermicelli"), ("seviyan", "vermicelli"),
    # Dairy
    ("full cream milk", "milk"), ("whole milk", "milk"), ("milk", "milk"),
    ("yogurt", "curd"), ("curd", "curd"), ("dahi", "curd"),
    ("cottage cheese", "paneer"), ("paneer", "paneer"),
    ("butter", "butter"), ("makhan", "butter"),
    ("fresh cream", "cream"), ("heavy cream", "cream"), ("whipping cream", "cream"), ("cream", "cream"),
    ("ghee", "ghee"), ("clarified butter", "ghee"),
    ("khoya", "khoya"), ("mawa", "khoya"),
    ("condensed milk", "condensed-milk"), ("milkmaid", "condensed-milk"),
    ("cheese", "cheese"),
    # Oils & Ghee
    ("mustard oil", "mustard-oil"),
    ("coconut oil", "coconut-oil"),
    ("cooking oil", "oil"), ("vegetable oil", "oil"), ("refined oil", "oil"),
    ("sunflower oil", "oil"), ("canola oil", "oil"), ("oil", "oil"),
    # Masalas & Spices
    ("salt", "salt"), ("namak", "salt"),
    ("red chilli powder", "red-chilli"), ("red chili powder", "red-chilli"),
    ("chili powder", "red-chilli"), ("chilli powder", "red-chilli"),
    ("paprika", "red-chilli"), ("red chilli", "red-chilli"),
    ("turmeric powder", "turmeric"), ("haldi", "turmeric"), ("turmeric", "turmeric"),
    ("cumin seed", "cumin"), ("jeera", "cumin"), ("cumin", "cumin"),
    ("mustard seed", "mustard-seeds"), ("rai", "mustard-seeds"), ("mustard", "mustard-seeds"),
    ("garam masala", "garam-masala"),
    ("coriander powder", "coriander-powder"), ("dhania powder", "coriander-powder"),
    ("chana masala", "chana-masala"), ("chole masala", "chana-masala"),
    ("biryani masala", "biryani-masala"),
    ("dry mango powder", "amchur"), ("amchur", "amchur"), ("amchoor", "amchur"),
    ("asafoetida", "hing"), ("hing", "hing"),
    ("bay leaf", "bay-leaf"), ("tej patta", "bay-leaf"),
    ("cardamom", "cardamom"), ("elaichi", "cardamom"),
    ("clove", "cloves"), ("laung", "cloves"),
    ("cinnamon", "cinnamon"), ("dalchini", "cinnamon"),
    ("black pepper", "pepper"), ("pepper corn", "pepper"), ("pepper", "pepper"),
    ("kashmiri red chilli", "kashmiri-mirch"), ("kashmiri mirch", "kashmiri-mirch"),
    ("chaat masala", "chat-masala"), ("chat masala", "chat-masala"),
    ("sugar", "sugar"), ("cheeni", "sugar"),
    # Herbs
    ("fresh coriander", "coriander"), ("coriander leave", "coriander"),
    ("cilantro", "coriander"), ("dhania", "coriander"), ("coriander", "coriander"),
    ("mint leave", "mint"), ("pudina", "mint"), ("mint", "mint"),
    ("curry leave", "curry-leaves"), ("kadi patta", "curry-leaves"),
    ("kasuri methi", "fenugreek-leaves"), ("fenugreek leave", "fenugreek-leaves"),
    ("methi leave", "fenugreek-leaves"),
    # Sauces & Condiments
    ("soy sauce", "soy-sauce"), ("soya sauce", "soy-sauce"),
    ("vinegar", "vinegar"), ("sirka", "vinegar"),
    ("tomato ketchup", "ketchup"), ("ketchup", "ketchup"),
    ("tamarind", "tamarind"), ("imli", "tamarind"),
    ("coconut milk", "coconut"), ("desiccated coconut", "coconut"), ("coconut", "coconut"),
    # Nuts & Dry Fruits
    ("cashew nut", "cashew"), ("cashewnuts", "cashew"), ("kaju", "cashew"), ("cashew", "cashew"),
    ("almond", "almonds"), ("badam", "almonds"),
    ("raisin", "raisins"), ("kishmish", "raisins"),
    ("groundnut", "peanuts"), ("peanut", "peanuts"), ("moongfali", "peanuts"),
    ("sesame seed", "sesame"), ("til", "sesame"), ("sesame", "sesame"),
    # Fruits
    ("lemon juice", "lemon"), ("lime juice", "lemon"), ("lime", "lemon"), ("lemon", "lemon"),
    ("banana", "banana"), ("kela", "banana"),
    ("mango pulp", "mango"), ("mango", "mango"),
    ("apple", "apple"),
    # Non-Veg
    ("chicken breast", "chicken"), ("chicken thigh", "chicken"),
    ("boneless chicken", "chicken"), ("chicken piece", "chicken"), ("chicken", "chicken"),
    ("lamb", "mutton"), ("mutton", "mutton"),
    ("fish fillet", "fish"), ("fish", "fish"),
    ("egg", "eggs"),
    ("prawn", "prawns"), ("shrimp", "prawns"),
    # Sweet Items
    ("jaggery", "jaggery"), ("gud", "jaggery"), ("gur", "jaggery"),
    ("honey", "honey"),
    ("rose water", "rose-water"), ("gulab jal", "rose-water"),
]


def normalise_ingredient(raw):
    """Map a raw ingredient string to an app ingredient slug ID. Returns None if no mapping found."""
    cleaned = raw.lower().strip()
    cleaned = re.sub(r"\(.*?\)", "", cleaned)
    cleaned = re.sub(
        r"\b(chopped|sliced|diced|grated|crushed|ground|powdered|finely|roughly|"
        r"fresh|dried|whole|boiled|cooked|soaked|peeled|washed|halved|quartered|"
        r"medium|large|small|as needed|to taste|optional|for garnish|few|some|"
        r"handful)\b",
        "", cleaned
    )
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    for fragment, slug in INGREDIENT_MAP:
        if fragment in cleaned:
            return slug
    return None


# ── Cuisine mapping ─────────────────────────────────────────────────────────────
CUISINE_MAP = {
    "north indian": ["north-indian"], "north_indian": ["north-indian"],
    "south indian": ["south-indian"], "south_indian": ["south-indian"],
    "maharashtrian": ["maharashtrian"], "marathi": ["maharashtrian"],
    "gujarati": ["gujarati"],
    "punjabi": ["punjabi", "north-indian"],
    "bengali": ["bengali"],
    "rajasthani": ["rajasthani", "north-indian"],
    "kerala": ["kerala", "south-indian"],
    "mughlai": ["mughlai"],
    "street food": ["street-food"],
    "goan": ["goan"],
    "andhra": ["andhra", "south-indian"],
    "bihari": ["bihari", "north-indian"],
    "kashmiri": ["kashmiri", "north-indian"],
    "chettinad": ["south-indian"],
    "karnataka": ["south-indian"],
    "tamil": ["south-indian"],
    "telugu": ["andhra"],
    "hyderabadi": ["mughlai"],
    "awadhi": ["mughlai", "north-indian"],
    "chinese": ["chinese"], "indo chinese": ["chinese"],
    "continental": ["continental"],
    "breakfast": ["breakfast"],
    "dessert": ["desserts"], "sweets": ["desserts"],
    "snack": ["snacks"],
    "healthy": ["healthy"],
}

def map_cuisine(raw):
    if not raw or str(raw).lower() in ("nan", ""):
        return ["north-indian"]
    key = str(raw).lower().strip()
    for frag, ids in CUISINE_MAP.items():
        if frag in key:
            return list(ids)
    return ["north-indian"]


# ── Unsplash image bank by cuisine ─────────────────────────────────────────────
CUISINE_IMAGES = {
    "north-indian":  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
    "south-indian":  "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&q=80",
    "maharashtrian": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&q=80",
    "gujarati":      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80",
    "punjabi":       "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=600&q=80",
    "bengali":       "https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&q=80",
    "rajasthani":    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80",
    "kerala":        "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&q=80",
    "mughlai":       "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
    "street-food":   "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=600&q=80",
    "chinese":       "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
    "continental":   "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80",
    "breakfast":     "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80",
    "desserts":      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80",
    "healthy":       "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    "goan":          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    "andhra":        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80",
    "bihari":        "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&q=80",
    "kashmiri":      "https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=600&q=80",
    "snacks":        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
    "default":       "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
}

def get_image(cuisine_ids):
    for cid in cuisine_ids:
        if cid in CUISINE_IMAGES:
            return CUISINE_IMAGES[cid]
    return CUISINE_IMAGES["default"]


# ── Helpers ─────────────────────────────────────────────────────────────────────
def to_slug(name):
    slug = name.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-")

def difficulty_from_time(minutes):
    if minutes <= 20:
        return "Easy"
    elif minutes <= 45:
        return "Medium"
    else:
        return "Hard"

OPTIONAL_IDS = {
    "salt", "oil", "ghee", "coriander", "mint", "sugar",
    "garam-masala", "coriander-powder", "red-chilli", "turmeric",
    "cumin", "hing", "bay-leaf", "cloves", "cinnamon", "cardamom",
    "pepper", "mustard-seeds", "curry-leaves", "lemon",
}

def parse_ingredients(raw_str):
    if not raw_str or str(raw_str).lower() == "nan":
        return []
    parts = re.split(r"[,;|\n]+", str(raw_str))
    result = []
    seen_slugs = set()
    for part in parts:
        part = part.strip()
        if not part:
            continue
        qty_match = re.match(
            r"^([\d/.\-]+\s*(?:cup|tbsp|tsp|g|gm|kg|ml|l|pc|piece|"
            r"nos?|bunch|handful|pinch|dash|clove|pod|stick|inch|to taste|as needed)?s?\.?\s*)",
            part, re.IGNORECASE
        )
        if qty_match:
            qty = qty_match.group(1).strip()
            name_part = part[qty_match.end():].strip()
        else:
            qty = "as needed"
            name_part = part

        slug = normalise_ingredient(name_part)
        if slug and slug not in seen_slugs:
            seen_slugs.add(slug)
            entry = {"id": slug, "quantity": qty or "as needed"}
            if slug in OPTIONAL_IDS:
                entry["optional"] = True
            result.append(entry)
    return result


# ── Load individual CSVs ─────────────────────────────────────────────────────────
def find_col(df_cols, *keywords):
    for kw in keywords:
        for c in df_cols:
            if kw in c:
                return c
    return None

def safe_int(val, default=30):
    try:
        s = str(val).replace(".", "")
        if s.isdigit():
            return int(float(str(val)))
        return default
    except Exception:
        return default

def add_course_cuisines(cuisine_ids, course_raw):
    course = str(course_raw).lower()
    if "breakfast" in course and "breakfast" not in cuisine_ids:
        cuisine_ids.append("breakfast")
    if "dessert" in course and "desserts" not in cuisine_ids:
        cuisine_ids.append("desserts")
    if "snack" in course and "snacks" not in cuisine_ids:
        cuisine_ids.append("snacks")
    return cuisine_ids


def load_kritirathi():
    path = RAW_DIR / "indian_food_kritirathi.csv"
    if not path.exists():
        log.warning(f"Not found: {path.name} — skipping")
        return None
    df = pd.read_csv(path, encoding="utf-8", on_bad_lines="skip")
    df.columns = [c.lower().strip().replace(" ", "_") for c in df.columns]
    log.info(f"  Loaded kritirathi: {len(df)} rows, cols={list(df.columns[:8])}")

    name_col    = find_col(df.columns, "name")
    ingr_col    = find_col(df.columns, "ingredient")
    cuisine_col = find_col(df.columns, "cuisine", "region", "state")
    diet_col    = find_col(df.columns, "diet", "veg")
    time_col    = find_col(df.columns, "time", "prep", "cook")
    desc_col    = find_col(df.columns, "desc", "about", "flavor")
    course_col  = find_col(df.columns, "course")

    rows = []
    for _, row in df.iterrows():
        name = str(row.get(name_col, "")).strip() if name_col else ""
        if not name or name.lower() == "nan":
            continue
        ingr_raw    = str(row.get(ingr_col, ""))    if ingr_col    else ""
        cuisine_raw = str(row.get(cuisine_col, "")) if cuisine_col else ""
        diet_raw    = str(row.get(diet_col, "")).lower() if diet_col else ""
        time_raw    = row.get(time_col, 30)          if time_col    else 30
        desc_raw    = str(row.get(desc_col, ""))    if desc_col    else ""
        course_raw  = str(row.get(course_col, ""))  if course_col  else ""

        time_val = max(5, min(safe_int(time_raw), 180))
        cuisine_ids = map_cuisine(cuisine_raw)
        cuisine_ids = add_course_cuisines(cuisine_ids, course_raw)
        is_veg = "non" not in diet_raw and "chicken" not in diet_raw and "meat" not in diet_raw
        ingredients = parse_ingredients(ingr_raw)
        if not ingredients:
            continue

        rows.append({
            "source": "kritirathi", "name": name,
            "cuisine": cuisine_ids, "ingredients_parsed": ingredients,
            "time": time_val, "isVeg": is_veg,
            "description": desc_raw if desc_raw.lower() not in ("nan", "") else "",
            "steps_raw": [],
        })
    return pd.DataFrame(rows) if rows else None


def load_indian_food_101():
    path = RAW_DIR / "indian_food_101.csv"
    if not path.exists():
        log.warning(f"Not found: {path.name} — skipping")
        return None
    df = pd.read_csv(path, encoding="utf-8", on_bad_lines="skip")
    df.columns = [c.lower().strip().replace(" ", "_") for c in df.columns]
    log.info(f"  Loaded indian_food_101: {len(df)} rows, cols={list(df.columns[:8])}")

    name_col    = find_col(df.columns, "name")
    ingr_col    = find_col(df.columns, "ingredient")
    diet_col    = find_col(df.columns, "diet", "veg")
    prep_col    = find_col(df.columns, "prep")
    cook_col    = find_col(df.columns, "cook")
    region_col  = find_col(df.columns, "region", "state", "cuisine")
    desc_col    = find_col(df.columns, "desc", "about", "flavor")
    course_col  = find_col(df.columns, "course")

    rows = []
    for _, row in df.iterrows():
        name = str(row.get(name_col, "")).strip() if name_col else ""
        if not name or name.lower() == "nan":
            continue
        ingr_raw    = str(row.get(ingr_col, ""))    if ingr_col    else ""
        diet_raw    = str(row.get(diet_col, "")).lower() if diet_col else ""
        prep_raw    = row.get(prep_col, 15)          if prep_col    else 15
        cook_raw    = row.get(cook_col, 15)          if cook_col    else 15
        region_raw  = str(row.get(region_col, ""))  if region_col  else ""
        desc_raw    = str(row.get(desc_col, ""))    if desc_col    else ""
        course_raw  = str(row.get(course_col, ""))  if course_col  else ""

        time_val = max(5, min(safe_int(prep_raw, 15) + safe_int(cook_raw, 15), 180))
        cuisine_ids = map_cuisine(region_raw)
        cuisine_ids = add_course_cuisines(cuisine_ids, course_raw)
        is_veg = "non" not in diet_raw
        ingredients = parse_ingredients(ingr_raw)
        if not ingredients:
            continue

        description = desc_raw if desc_raw.lower() not in ("nan", "") else ""
        rows.append({
            "source": "indian_food_101", "name": name,
            "cuisine": cuisine_ids, "ingredients_parsed": ingredients,
            "time": time_val, "isVeg": is_veg,
            "description": description, "steps_raw": [],
        })
    return pd.DataFrame(rows) if rows else None


def load_cleaned_recipes():
    path = RAW_DIR / "cleaned_recipes.csv"
    if not path.exists():
        log.warning(f"Not found: {path.name} — skipping")
        return None
    df = pd.read_csv(path, encoding="utf-8", on_bad_lines="skip")
    df.columns = [c.lower().strip().replace(" ", "_") for c in df.columns]
    log.info(f"  Loaded cleaned_recipes: {len(df)} rows, cols={list(df.columns[:8])}")

    name_col     = find_col(df.columns, "name", "recipe")
    ingr_col     = find_col(df.columns, "ingredient")
    quant_col    = find_col(df.columns, "quant")
    instruct_col = find_col(df.columns, "instruct", "step", "direction", "method")
    cuisine_col  = find_col(df.columns, "cuisine", "region")
    diet_col     = find_col(df.columns, "diet", "veg")
    time_col     = find_col(df.columns, "time")
    course_col   = find_col(df.columns, "course")

    rows = []
    for _, row in df.iterrows():
        name = str(row.get(name_col, "")).strip() if name_col else ""
        if not name or name.lower() == "nan":
            continue
        ingr_raw    = str(row.get(ingr_col, ""))    if ingr_col    else ""
        quant_raw   = str(row.get(quant_col, ""))   if quant_col   else ""
        instruct    = str(row.get(instruct_col, "")) if instruct_col else ""
        cuisine_raw = str(row.get(cuisine_col, "")) if cuisine_col else ""
        diet_raw    = str(row.get(diet_col, "")).lower() if diet_col else ""
        time_raw    = row.get(time_col, 30)          if time_col    else 30
        course_raw  = str(row.get(course_col, ""))  if course_col  else ""

        # Merge quantities with ingredient names if available
        if quant_raw and quant_raw.lower() != "nan":
            quants = re.split(r"[,;|\n]+", quant_raw)
            ingrs  = re.split(r"[,;|\n]+", ingr_raw)
            combined = []
            for i, ing in enumerate(ingrs):
                q = quants[i].strip() if i < len(quants) else ""
                combined.append(f"{q} {ing}".strip())
            merged_ingr = ", ".join(combined)
        else:
            merged_ingr = ingr_raw

        # Parse steps
        steps = []
        if instruct and instruct.lower() not in ("nan", ""):
            raw_steps = re.split(r"(?:\d+\.\s+|\n+)", instruct)
            steps = [s.strip() for s in raw_steps if len(s.strip()) > 15][:8]

        time_val = max(5, min(safe_int(time_raw), 180))
        cuisine_ids = map_cuisine(cuisine_raw)
        cuisine_ids = add_course_cuisines(cuisine_ids, course_raw)
        is_veg = (
            "non" not in diet_raw and
            "chicken" not in ingr_raw.lower() and
            "mutton" not in ingr_raw.lower() and
            "meat" not in ingr_raw.lower()
        )
        ingredients = parse_ingredients(merged_ingr)
        if not ingredients:
            continue

        rows.append({
            "source": "cleaned_recipes", "name": name,
            "cuisine": cuisine_ids, "ingredients_parsed": ingredients,
            "time": time_val, "isVeg": is_veg,
            "description": "", "steps_raw": steps,
        })
    return pd.DataFrame(rows) if rows else None


# ── Merge & clean ───────────────────────────────────────────────────────────────
def merge_datasets(frames):
    valid = [f for f in frames if f is not None and not f.empty]
    if not valid:
        raise RuntimeError("No datasets loaded.")
    merged = pd.concat(valid, ignore_index=True)
    log.info(f"  Total rows before dedup: {len(merged)}")
    return merged

def build_slug_index(df):
    df["slug"] = df["name"].apply(to_slug)
    return df

def deduplicate(df):
    source_priority = {"cleaned_recipes": 0, "indian_food_101": 1, "kritirathi": 2}
    df = df.copy()
    df["_pri"] = df["source"].map(source_priority).fillna(3)
    df = df.sort_values("_pri").drop_duplicates(subset="slug", keep="first")
    df = df.drop(columns=["_pri"])
    log.info(f"  After dedup: {len(df)} unique recipes")
    return df


# ── Assemble recipe objects ──────────────────────────────────────────────────────
CUISINE_BASE_CALORIES = {
    "breakfast": 230, "snacks": 200, "desserts": 350, "healthy": 180,
    "south-indian": 240, "north-indian": 320, "mughlai": 450, "street-food": 280,
}

def estimate_calories(cuisine_ids, is_veg):
    base = 300
    for cid in cuisine_ids:
        if cid in CUISINE_BASE_CALORIES:
            base = CUISINE_BASE_CALORIES[cid]
            break
    if not is_veg:
        base += 80
    return base

def build_tags(is_veg, cuisine_ids, time_val):
    tags = ["vegetarian"] if is_veg else ["non-veg"]
    for cid in cuisine_ids:
        if cid == "breakfast": tags.append("breakfast")
        if cid == "desserts": tags.append("sweet")
        if cid == "healthy": tags.append("healthy")
        if cid == "street-food": tags.append("street-food")
    if time_val <= 20:
        tags.append("quick")
    return list(dict.fromkeys(tags))

def generate_steps(name, ingredients, steps_raw):
    if isinstance(steps_raw, list) and steps_raw:
        return steps_raw
    if isinstance(steps_raw, str) and steps_raw.strip():
        lines = [l.strip() for l in steps_raw.split("\n") if l.strip()]
        return lines[:8] if lines else []
    key_ingr = [i["id"].replace("-", " ") for i in ingredients[:3]]
    ingr_str = ", ".join(key_ingr) if key_ingr else "the ingredients"
    return [
        f"Prepare and measure all ingredients for {name}.",
        "Heat oil or ghee in a pan on medium heat.",
        f"Add {ingr_str} and cook, stirring frequently.",
        "Add spices and mix well. Cook for a few more minutes.",
        "Adjust seasoning. Serve hot and enjoy!",
    ]

def assemble_recipes(df):
    recipes = []
    for _, row in df.iterrows():
        cuisine_ids = row["cuisine"] if isinstance(row["cuisine"], list) else ["north-indian"]
        ingredients = row["ingredients_parsed"] if isinstance(row["ingredients_parsed"], list) else []
        if not ingredients:
            continue
        time_val = int(row.get("time", 30))
        is_veg   = bool(row.get("isVeg", True))
        name     = str(row["name"]).strip()
        description = str(row.get("description", "")).strip()
        if not description or description.lower() == "nan":
            description = f"A delicious {cuisine_ids[0].replace('-', ' ')} dish — {name}."
        steps = generate_steps(name, ingredients, row.get("steps_raw", []))
        recipes.append({
            "id":           row["slug"],
            "name":         name,
            "nameHindi":    name,
            "cuisine":      cuisine_ids,
            "ingredients":  ingredients,
            "time":         time_val,
            "difficulty":   difficulty_from_time(time_val),
            "image":        get_image(cuisine_ids),
            "description":  description[:200],
            "steps":        steps,
            "youtubeQuery": f"{name} recipe",
            "tags":         build_tags(is_veg, cuisine_ids, time_val),
            "isVeg":        is_veg,
            "calories":     estimate_calories(cuisine_ids, is_veg),
        })
    return recipes


# ── Hardcoded fallback recipes ───────────────────────────────────────────────────
FALLBACK_RECIPES = [
    {
        "id": "aloo-paratha", "name": "Aloo Paratha", "nameHindi": "आलू पराठा",
        "cuisine": ["north-indian", "breakfast", "punjabi"],
        "ingredients": [
            {"id": "atta", "quantity": "2 cups"}, {"id": "potato", "quantity": "3 medium"},
            {"id": "onion", "quantity": "1 small"}, {"id": "green-chilli", "quantity": "2"},
            {"id": "coriander", "quantity": "handful", "optional": True},
            {"id": "ghee", "quantity": "2 tbsp", "optional": True},
            {"id": "salt", "quantity": "to taste", "optional": True},
        ],
        "time": 30, "difficulty": "Easy",
        "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
        "description": "Crispy whole wheat flatbread stuffed with spiced mashed potato.",
        "steps": ["Boil and mash potatoes. Mix with onion, chilli, coriander, salt.", "Knead atta into smooth dough.", "Stuff and roll flat.", "Cook on hot tawa with ghee until golden.", "Serve hot with curd and pickle."],
        "youtubeQuery": "aloo paratha recipe", "tags": ["breakfast", "vegetarian"], "isVeg": True, "calories": 320,
    },
    {
        "id": "dal-tadka", "name": "Dal Tadka", "nameHindi": "दाल तड़का",
        "cuisine": ["north-indian"],
        "ingredients": [
            {"id": "toor-dal", "quantity": "1 cup"}, {"id": "onion", "quantity": "1 medium"},
            {"id": "tomato", "quantity": "2 medium"}, {"id": "garlic", "quantity": "4 cloves"},
            {"id": "ginger", "quantity": "1 inch"}, {"id": "cumin", "quantity": "1 tsp"},
            {"id": "turmeric", "quantity": "1/2 tsp", "optional": True},
            {"id": "red-chilli", "quantity": "1 tsp", "optional": True},
            {"id": "oil", "quantity": "2 tbsp", "optional": True},
            {"id": "salt", "quantity": "to taste", "optional": True},
        ],
        "time": 40, "difficulty": "Easy",
        "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80",
        "description": "Comforting lentil curry with a sizzling spiced tadka.",
        "steps": ["Pressure cook dal with turmeric and salt.", "Saute onion, ginger-garlic, tomato and spices.", "Add cooked dal and simmer 10 mins.", "Pour cumin-chilli tadka.", "Garnish with coriander and serve."],
        "youtubeQuery": "dal tadka recipe restaurant style", "tags": ["vegetarian", "lunch"], "isVeg": True, "calories": 250,
    },
    {
        "id": "paneer-butter-masala", "name": "Paneer Butter Masala", "nameHindi": "पनीर बटर मसाला",
        "cuisine": ["north-indian", "mughlai"],
        "ingredients": [
            {"id": "paneer", "quantity": "250g"}, {"id": "tomato", "quantity": "4 medium"},
            {"id": "onion", "quantity": "2 medium"}, {"id": "butter", "quantity": "3 tbsp"},
            {"id": "garlic", "quantity": "5 cloves"}, {"id": "ginger", "quantity": "1 inch"},
            {"id": "cashew", "quantity": "10-12", "optional": True},
            {"id": "cream", "quantity": "3 tbsp", "optional": True},
            {"id": "salt", "quantity": "to taste", "optional": True},
        ],
        "time": 45, "difficulty": "Medium",
        "image": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80",
        "description": "Silky, rich tomato-based gravy with soft paneer cubes.",
        "steps": ["Blend tomato, onion, cashew, ginger, garlic into paste.", "Cook paste in butter, add spices.", "Add paneer and simmer 10 mins.", "Finish with cream and sugar."],
        "youtubeQuery": "paneer butter masala recipe", "tags": ["vegetarian", "dinner"], "isVeg": True, "calories": 420,
    },
    {
        "id": "poha", "name": "Poha", "nameHindi": "पोहा",
        "cuisine": ["maharashtrian", "breakfast"],
        "ingredients": [
            {"id": "poha", "quantity": "2 cups"}, {"id": "onion", "quantity": "1 medium"},
            {"id": "mustard-seeds", "quantity": "1 tsp"}, {"id": "green-chilli", "quantity": "1-2"},
            {"id": "turmeric", "quantity": "1/2 tsp", "optional": True},
            {"id": "peanuts", "quantity": "2 tbsp", "optional": True},
            {"id": "curry-leaves", "quantity": "8-10", "optional": True},
            {"id": "lemon", "quantity": "1", "optional": True},
        ],
        "time": 20, "difficulty": "Easy",
        "image": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80",
        "description": "Light and fluffy flattened rice breakfast tossed with spices.",
        "steps": ["Rinse poha and let soften 5 mins.", "Temper mustard seeds, curry leaves, green chilli in oil.", "Add onion and cook.", "Mix in poha, turmeric, salt, sugar.", "Squeeze lemon and serve."],
        "youtubeQuery": "poha recipe Maharashtra style", "tags": ["breakfast", "vegetarian", "quick"], "isVeg": True, "calories": 220,
    },
    {
        "id": "rajma-chawal", "name": "Rajma Chawal", "nameHindi": "राजमा चावल",
        "cuisine": ["north-indian", "punjabi"],
        "ingredients": [
            {"id": "rajma", "quantity": "1 cup"}, {"id": "rice", "quantity": "2 cups"},
            {"id": "onion", "quantity": "2 medium"}, {"id": "tomato", "quantity": "3 medium"},
            {"id": "garlic", "quantity": "6 cloves"}, {"id": "ginger", "quantity": "1 inch"},
            {"id": "cumin", "quantity": "1 tsp"},
            {"id": "red-chilli", "quantity": "1 tsp", "optional": True},
            {"id": "garam-masala", "quantity": "1 tsp", "optional": True},
        ],
        "time": 60, "difficulty": "Medium",
        "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80",
        "description": "Classic kidney bean curry served over steamed rice - ultimate comfort food.",
        "steps": ["Soak rajma overnight, pressure cook.", "Saute onion, ginger-garlic.", "Add tomato and spices, cook until oil separates.", "Add rajma and simmer 20 min.", "Serve with steamed rice."],
        "youtubeQuery": "rajma chawal recipe Punjabi", "tags": ["vegetarian", "lunch", "comfort"], "isVeg": True, "calories": 380,
    },
    {
        "id": "masala-chai", "name": "Masala Chai", "nameHindi": "मसाला चाय",
        "cuisine": ["snacks"],
        "ingredients": [
            {"id": "milk", "quantity": "1 cup"}, {"id": "ginger", "quantity": "small piece"},
            {"id": "cardamom", "quantity": "2 pods", "optional": True},
            {"id": "sugar", "quantity": "2 tsp", "optional": True},
        ],
        "time": 10, "difficulty": "Easy",
        "image": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
        "description": "Aromatic spiced Indian tea brewed to perfection.",
        "steps": ["Boil water with ginger and cardamom.", "Add tea leaves and simmer 2 mins.", "Add milk and sugar.", "Strain and serve hot."],
        "youtubeQuery": "masala chai recipe", "tags": ["vegetarian", "quick", "drink"], "isVeg": True, "calories": 80,
    },
    {
        "id": "besan-chilla", "name": "Besan Chilla", "nameHindi": "बेसन चीला",
        "cuisine": ["north-indian", "breakfast"],
        "ingredients": [
            {"id": "besan", "quantity": "1 cup"}, {"id": "onion", "quantity": "1 small"},
            {"id": "green-chilli", "quantity": "1"}, {"id": "tomato", "quantity": "1 small", "optional": True},
            {"id": "coriander", "quantity": "handful", "optional": True},
            {"id": "salt", "quantity": "to taste", "optional": True},
        ],
        "time": 15, "difficulty": "Easy",
        "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
        "description": "Protein-rich gram flour pancakes - quick, crispy and delicious.",
        "steps": ["Mix besan with water into smooth batter.", "Add veggies and spices.", "Pour on hot pan and spread thin.", "Cook both sides until golden brown."],
        "youtubeQuery": "besan chilla recipe", "tags": ["breakfast", "vegetarian", "quick"], "isVeg": True, "calories": 180,
    },
    {
        "id": "palak-paneer", "name": "Palak Paneer", "nameHindi": "पालक पनीर",
        "cuisine": ["north-indian", "mughlai"],
        "ingredients": [
            {"id": "spinach", "quantity": "2 bunches"}, {"id": "paneer", "quantity": "200g"},
            {"id": "onion", "quantity": "1 medium"}, {"id": "garlic", "quantity": "4 cloves"},
            {"id": "ginger", "quantity": "1 inch"}, {"id": "tomato", "quantity": "1 medium", "optional": True},
            {"id": "cream", "quantity": "2 tbsp", "optional": True},
            {"id": "garam-masala", "quantity": "1/2 tsp", "optional": True},
        ],
        "time": 30, "difficulty": "Medium",
        "image": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80",
        "description": "Creamy spinach gravy with golden paneer cubes - rich, vibrant and nutritious.",
        "steps": ["Blanch spinach and blend smooth.", "Saute onion, ginger-garlic.", "Add spices and spinach puree.", "Add paneer and simmer.", "Finish with cream."],
        "youtubeQuery": "palak paneer recipe", "tags": ["vegetarian", "dinner", "healthy"], "isVeg": True, "calories": 310,
    },
    {
        "id": "chole-bhature", "name": "Chole Bhature", "nameHindi": "छोले भटूरे",
        "cuisine": ["north-indian", "punjabi", "street-food"],
        "ingredients": [
            {"id": "kabuli-chana", "quantity": "1 cup"}, {"id": "onion", "quantity": "2 medium"},
            {"id": "tomato", "quantity": "3 medium"}, {"id": "garlic", "quantity": "5 cloves"},
            {"id": "ginger", "quantity": "1 inch"}, {"id": "chana-masala", "quantity": "2 tsp"},
            {"id": "maida", "quantity": "2 cups"}, {"id": "curd", "quantity": "2 tbsp"},
        ],
        "time": 60, "difficulty": "Medium",
        "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
        "description": "Spicy chickpea curry served with fluffy deep-fried bread - a North Indian favourite.",
        "steps": ["Soak and pressure cook chole.", "Saute onion, ginger-garlic.", "Add tomato and masala, cook until oil separates.", "Add chole and simmer.", "Knead maida dough, roll and deep fry bhature."],
        "youtubeQuery": "chole bhature recipe", "tags": ["vegetarian", "street-food"], "isVeg": True, "calories": 520,
    },
    {
        "id": "chicken-biryani", "name": "Chicken Biryani", "nameHindi": "चिकन बिरयानी",
        "cuisine": ["mughlai", "north-indian"],
        "ingredients": [
            {"id": "chicken", "quantity": "500g"}, {"id": "rice", "quantity": "2 cups"},
            {"id": "onion", "quantity": "3 medium"}, {"id": "curd", "quantity": "1/2 cup"},
            {"id": "garlic", "quantity": "6 cloves"}, {"id": "ginger", "quantity": "2 inches"},
            {"id": "biryani-masala", "quantity": "2 tsp"},
            {"id": "mint", "quantity": "handful", "optional": True},
            {"id": "ghee", "quantity": "3 tbsp", "optional": True},
        ],
        "time": 90, "difficulty": "Hard",
        "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
        "description": "Aromatic layered rice and chicken cooked dum-style for a regal feast.",
        "steps": ["Marinate chicken with curd and spices 30 min.", "Parboil rice with whole spices.", "Fry onions until caramelised.", "Layer chicken and rice in pot.", "Dum cook on low flame 25 min."],
        "youtubeQuery": "chicken biryani recipe dum style", "tags": ["non-veg", "dinner"], "isVeg": False, "calories": 580,
    },
    {
        "id": "masala-dosa", "name": "Masala Dosa", "nameHindi": "मसाला डोसा",
        "cuisine": ["south-indian", "breakfast"],
        "ingredients": [
            {"id": "rice", "quantity": "2 cups"}, {"id": "urad-dal", "quantity": "1/2 cup"},
            {"id": "potato", "quantity": "3 medium"}, {"id": "onion", "quantity": "1 medium"},
            {"id": "mustard-seeds", "quantity": "1 tsp"},
            {"id": "curry-leaves", "quantity": "10", "optional": True},
            {"id": "turmeric", "quantity": "1/2 tsp", "optional": True},
        ],
        "time": 30, "difficulty": "Medium",
        "image": "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&q=80",
        "description": "Crispy fermented rice crepe filled with spiced potato - South India's signature dish.",
        "steps": ["Soak and grind rice+dal, ferment overnight.", "Prepare potato masala filling.", "Spread thin batter on hot tawa.", "Add filling, fold and serve with sambar."],
        "youtubeQuery": "masala dosa recipe authentic", "tags": ["vegetarian", "breakfast"], "isVeg": True, "calories": 300,
    },
    {
        "id": "egg-bhurji", "name": "Egg Bhurji", "nameHindi": "एग भुर्जी",
        "cuisine": ["north-indian", "breakfast"],
        "ingredients": [
            {"id": "eggs", "quantity": "3"}, {"id": "onion", "quantity": "1 medium"},
            {"id": "tomato", "quantity": "1 medium"}, {"id": "green-chilli", "quantity": "1"},
            {"id": "coriander", "quantity": "handful", "optional": True},
            {"id": "turmeric", "quantity": "1/4 tsp", "optional": True},
        ],
        "time": 10, "difficulty": "Easy",
        "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80",
        "description": "Spicy Indian scrambled eggs with onion, tomato and green chilli.",
        "steps": ["Beat eggs lightly.", "Saute onion, chilli, tomato.", "Add eggs and scramble on medium heat.", "Garnish with coriander and serve."],
        "youtubeQuery": "egg bhurji recipe", "tags": ["non-veg", "breakfast", "quick"], "isVeg": False, "calories": 190,
    },
    {
        "id": "moong-dal-khichdi", "name": "Moong Dal Khichdi", "nameHindi": "मूंग दाल खिचड़ी",
        "cuisine": ["north-indian", "healthy"],
        "ingredients": [
            {"id": "moong-dal", "quantity": "1/2 cup"}, {"id": "rice", "quantity": "1/2 cup"},
            {"id": "ginger", "quantity": "1/2 inch", "optional": True},
            {"id": "turmeric", "quantity": "1/4 tsp", "optional": True},
            {"id": "cumin", "quantity": "1 tsp", "optional": True},
            {"id": "ghee", "quantity": "1 tbsp", "optional": True},
            {"id": "salt", "quantity": "to taste", "optional": True},
        ],
        "time": 25, "difficulty": "Easy",
        "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80",
        "description": "Wholesome one-pot lentil and rice comfort food, perfect for any time of day.",
        "steps": ["Rinse dal and rice.", "Pressure cook with turmeric, salt and water.", "Temper with ghee, cumin, ginger.", "Mix and serve hot."],
        "youtubeQuery": "moong dal khichdi recipe", "tags": ["vegetarian", "healthy", "comfort"], "isVeg": True, "calories": 220,
    },
    {
        "id": "aloo-gobi", "name": "Aloo Gobi", "nameHindi": "आलू गोभी",
        "cuisine": ["north-indian"],
        "ingredients": [
            {"id": "potato", "quantity": "2 medium"}, {"id": "cauliflower", "quantity": "1 small head"},
            {"id": "onion", "quantity": "1 medium", "optional": True},
            {"id": "tomato", "quantity": "1 medium", "optional": True},
            {"id": "garlic", "quantity": "3 cloves", "optional": True},
            {"id": "turmeric", "quantity": "1/2 tsp", "optional": True},
            {"id": "cumin", "quantity": "1 tsp", "optional": True},
            {"id": "salt", "quantity": "to taste", "optional": True},
        ],
        "time": 25, "difficulty": "Easy",
        "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80",
        "description": "Dry spiced potato and cauliflower stir-fry - a North Indian classic.",
        "steps": ["Cut potato and cauliflower into florets.", "Temper cumin in oil.", "Add veggies and spices.", "Cook covered until tender.", "Serve with roti."],
        "youtubeQuery": "aloo gobi recipe", "tags": ["vegetarian", "lunch", "dry"], "isVeg": True, "calories": 210,
    },
]


# ── Main ────────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Build recipes.json from Kaggle datasets")
    parser.add_argument("--force", action="store_true", help="Force re-download")
    args = parser.parse_args()

    log.info("=" * 60)
    log.info("Aaj Kya Banau? - Recipe ETL Pipeline")
    log.info("=" * 60)

    # Step 1: Download
    log.info("\n[1/4] Downloading datasets...")
    download_datasets(force=args.force)

    # Step 2: Load
    log.info("\n[2/4] Loading CSVs...")
    frames = [
        load_kritirathi(),
        load_indian_food_101(),
        load_cleaned_recipes(),
    ]
    any_loaded = any(f is not None and not f.empty for f in frames)

    if any_loaded:
        # Step 3: Merge, dedup, clean
        log.info("\n[3/4] Merging and cleaning...")
        df = merge_datasets(frames)
        df = build_slug_index(df)
        df = deduplicate(df)

        # Step 4: Assemble
        log.info("\n[4/4] Assembling recipe objects...")
        kaggle_recipes = assemble_recipes(df)
        log.info(f"  Generated {len(kaggle_recipes)} recipes from Kaggle data")

        existing_slugs = {r["id"] for r in kaggle_recipes}
        extra = [r for r in FALLBACK_RECIPES if r["id"] not in existing_slugs]
        all_recipes = kaggle_recipes + extra
        log.info(f"  Added {len(extra)} fallback recipes not present in Kaggle data")
    else:
        log.warning("\nNo Kaggle CSVs found. Writing fallback recipes only.")
        log.warning("  -> To get full data: create ~/.kaggle/kaggle.json and run again.")
        all_recipes = list(FALLBACK_RECIPES)

    # Validate: require >= 2 mapped ingredients
    all_recipes = [r for r in all_recipes if len(r["ingredients"]) >= 2]

    log.info(f"\nFinal recipe count: {len(all_recipes)}")

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(all_recipes, f, ensure_ascii=False, indent=2)
    log.info(f"Written: {OUT_JSON}")

    # Summary stats
    veg_count    = sum(1 for r in all_recipes if r["isVeg"])
    nonveg_count = len(all_recipes) - veg_count
    cuisines = {}
    for r in all_recipes:
        for c in r["cuisine"]:
            cuisines[c] = cuisines.get(c, 0) + 1
    top_cuisines = sorted(cuisines.items(), key=lambda x: -x[1])[:5]

    log.info("\n-- Dataset Summary --")
    log.info(f"  Total recipes  : {len(all_recipes)}")
    log.info(f"  Vegetarian     : {veg_count}")
    log.info(f"  Non-vegetarian : {nonveg_count}")
    log.info(f"  Top cuisines   : {', '.join(f'{k}({v})' for k, v in top_cuisines)}")
    log.info("\nDone!")


if __name__ == "__main__":
    main()
