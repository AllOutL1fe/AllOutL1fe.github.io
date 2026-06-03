import os, json

#создание json для галереи для подгрузки в js

folders = {
    "images/arts":        "images/arts/list.json",
    "images/vessel":      "images/vessel/list.json",
    "images/3d":          "images/3d/list.json",
    "images/infographic": "images/infographic/list.json",
}

exts = ('.jpg', '.jpeg', '.png', '.webp')

for folder, out_path in folders.items():
    if not os.path.exists(folder):
        os.makedirs(folder)
        print(f"Создал папку: {folder}")
        continue

    files = sorted([
        f for f in os.listdir(folder)
        if f.lower().endswith(exts)
    ])

    data = [{"file": f, #"stack": "FLUX · LoRA"
             } for f in files]

    with open(out_path, "w", encoding="utf-8") as out:
        json.dump(data, out, ensure_ascii=False, indent=2)

    print(f"{folder}: {len(data)} фото → {out_path}")

print("\nГотово. Обнови сайт на GitHub.")