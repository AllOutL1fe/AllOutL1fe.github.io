import os
from PIL import Image, ImageOps
from PIL.ExifTags import TAGS

# ================= Настройки =================
# Путь к главной папке, внутри которой лежат другие папки с фото
TARGET_DIRECTORY = r"C:\Wwork\PORTFOLIO\images\arts"

# Авторские данные и ссылки
AUTHOR_NAME = "SVNHLLS"
AUTHOR_LINK = "https://alloutl1fe.github.io/"
COPYRIGHT_TEXT = f"Copyright © 2026 {AUTHOR_NAME}. All rights reserved. Portfolio: {AUTHOR_LINK}"
# =============================================

def process_image(file_path):
    try:
        # Открываем изображение
        with Image.open(file_path) as img:
            # ImageOps.exif_transpose исправляет ориентацию фото (например, если снято на телефон)
            # перед тем, как мы полностью уничтожим старый EXIF.
            img = ImageOps.exif_transpose(img)
            
            # Создаем абсолютно новый,  чистый объект EXIF
            new_exif = img.getexif()
            
            # Записываем новые теги (используем стандартные ID для EXIF)
            # 315 - Artist (Автор)
            # 33432 - Copyright (Копирайт)
            # 40092 - User Comment (Комментарий, куда обычно ИИ пишет промпты)
            new_exif[315] = AUTHOR_NAME
            new_exif[33432] = COPYRIGHT_TEXT
            new_exif[40092] = AUTHOR_LINK.encode('utf-16le') # Безопасная кодировка для тега UserComment
            
            # Сохраняем файл поверх старого с НОВЫМ exif и БЕЗ сохранения старых PNG-chunks (инфо ComfyUI)
            # Формат сохраняем оригинальный
            img.save(file_path, exif=new_exif, optimize=True)
            print(f"[УСПЕХ] Обработан: {file_path}")
            
    except Exception as e:
        print(f"[ОШИБКА] Не удалось обработать {file_path}: {e}")

def main():
    if not os.path.exists(TARGET_DIRECTORY):
        print(f"Ошибка: Путь {TARGET_DIRECTORY} не существует. Проверьте настройки скрипта.")
        return

    print("Начало обработки изображений...")
    supported_extensions = ('.png', '.jpg', '.jpeg', '.webp')
    counter = 0

    # os.walk автоматически и рекурсивно обходит все папки, подпапки и файлы внутри TARGET_DIRECTORY
    for root, dirs, files in os.walk(TARGET_DIRECTORY):
        for file in files:
            if file.lower().endswith(supported_extensions):
                full_path = os.path.join(root, file)
                process_image(full_path)
                counter += 1

    print(f"\nЗавершено! Всего обработано изображений: {counter}")

if __name__ == "__main__":
    main()