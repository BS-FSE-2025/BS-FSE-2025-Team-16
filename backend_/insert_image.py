import sqlite3

# התחברות למסד הנתונים
conn = sqlite3.connect("PlantPricer.db")
cursor = conn.cursor()


# פונקציה לעדכון תמונה
def update_image(id, image_path):
    try:
        # פתיחת התמונה כנתונים בינאריים
        with open(image_path, 'rb') as file:
            img_data = file.read()

        # עדכון התמונה ב-SQLite
        cursor.execute("""
            UPDATE garden_elements
            SET img = ?
            WHERE element_id = ?
        """, (img_data, id))

        # שמירת השינויים
        conn.commit()
        print(f"Image updated successfully for : {id}")

    except Exception as e:
        print(f"Error updating image: {e}")


# קריאה לפונקציה לעדכון תמונה
update_image(4, '/Users/nadavd/Downloads/Gravel.jpg')  # החלף את הנתיב לתמונה הנכונה

# סגירת החיבור
conn.close()













