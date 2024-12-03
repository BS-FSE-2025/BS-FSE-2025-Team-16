# import sqlite3
#
#
# def query_to_js(columns_names, queries):
#     query_json = []
#     for j in range(len(queries)):
#         query_json.append({})
#         for i in range(len(columns_names)):
#             # if query_json[j]=={}:
#             query_json[-1][columns_names[i]] = queries[j][i]
#
#         # query_json.append()
#     return query_json
#
#
# # חיבור למסד הנתונים
# conn = sqlite3.connect("PlantPricer.db")
# cursor = conn.cursor()
#
# # שליפת נתונים
# cursor.execute("SELECT * FROM plants")
# rows = cursor.fetchall()
# for row in rows:
#     print(row)
# query_to_js(["id", "name", "email", "password", "type", "inactice"], rows)
# # סגירת החיבור
# conn.close()
#
#
#
#
#
#
#





import sqlite3

def query_to_js(columns_names, queries):
    """
    פונקציה להמרת נתונים שהתקבלו משאילתה למבנה JSON.
    """
    return [
        {columns_names[i]: row[i] for i in range(len(columns_names))}
        for row in queries
    ]

# חיבור למסד הנתונים
conn = sqlite3.connect("PlantPricer.db")
cursor = conn.cursor()

# שליפת שמות העמודות אוטומטית
cursor.execute("SELECT * FROM plants")
columns_names = [description[0] for description in cursor.description]

# שליפת נתונים
rows = cursor.fetchall()

# המרת הנתונים ל-JSON
json_data = query_to_js(columns_names, rows)

# הצגת הפלט
print(json_data)

# סגירת החיבור
conn.close()
