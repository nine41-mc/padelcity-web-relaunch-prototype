# Builds public/data/places.json for the radius search in the club finder (src/components/locations/places.ts).
# Source: GeoNames country dumps DE, AT, PL (https://download.geonames.org/export/dump/, CC BY 4.0).
# usage: python3 -I scripts/build-places.py <folder with DE.txt AT.txt PL.txt> public/data/places.json
import sys, json, csv, re
src, out = sys.argv[1], sys.argv[2]
rows = []
for cc in ["DE", "AT", "PL"]:
    with open(f"{src}/{cc}.txt", encoding="utf-8") as f:
        for r in csv.reader(f, delimiter="\t", quoting=csv.QUOTE_NONE):
            if r[6] != "P" or r[7] in ("PPLX", "PPLH", "PPLQ", "PPLW", "PPLCH"): continue
            pop = int(r[14] or 0)
            if pop < 1000: continue
            alts = []
            if pop >= 100000:  # big cities: other spellings people type (Warschau, Warszawa, Wien, Krakau …)
                alts = sorted({a for a in r[3].split(",") if a and a != r[1] and re.fullmatch(r"[A-Za-zÀ-ž' .-]{3,40}", a)})
            rows.append((pop, r[1], round(float(r[4]), 3), round(float(r[5]), 3), alts))
rows.sort(key=lambda x: -x[0])
seen, places = set(), []
for pop, name, lat, lon, alts in rows:
    key = (name, round(lat, 1), round(lon, 1))
    if key in seen: continue
    seen.add(key); places.append([name, lat, lon, "|".join(alts)] if alts else [name, lat, lon])
json.dump(places, open(out, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print(len(places))
