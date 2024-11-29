import sqlite3


def query_to_js(columns_names, queries):
    query_json = []
    for j in range(len(queries)):
        query_json.append({})
        for i in range(len(columns_names)):
            # if query_json[j]=={}:
            query_json[-1][columns_names[i]] = queries[j][i]

        # query_json.append()
    return query_json


# חיבור למסד הנתונים
conn = sqlite3.connect("PlantPricer.db")
cursor = conn.cursor()

# שליפת נתונים
cursor.execute("SELECT * FROM plants")
rows = cursor.fetchall()
for row in rows:
    print(row)
query_to_js(["id", "name", "email", "password", "type", "inactice"], rows)
# סגירת החיבור
conn.close()
