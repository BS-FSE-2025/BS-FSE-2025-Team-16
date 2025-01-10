from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify, after_this_request
from flask_cors import CORS, cross_origin
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy

from flask_restful import Api
# from mobile_resources.events import UserMobile
import sqlite3, flask_sqlalchemy
import json
import backend
import base64

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'
# app.config["SESSION_PERMANENT"] = False
# app.config["SESSION_TYPE"] = "filesystem"

app.config['SESSION_PERMANENT'] = False
app.config['SESSION_TYPE'] = 'filesystem'


@app.route('/users', methods=['GET'])
@cross_origin()
def users():
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()

    # שליפת שמות העמודות אוטומטית
    cursor.execute("SELECT * FROM users")
    columns_names = [description[0] for description in cursor.description]

    # שליפת נתונים
    rows = cursor.fetchall()

    # המרת הנתונים ל-JSON
    json_data = backend.query_to_js(columns_names, rows)

    return json_data


@app.route('/usersType', methods=['GET'])
@cross_origin()
def usersType():
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()

    # שליפת שמות העמודות אוטומטית
    cursor.execute("SELECT * FROM UserType")
    columns_names = [description[0] for description in cursor.description]

    # שליפת נתונים
    rows = cursor.fetchall()
    # print(rows)
    # המרת הנתונים ל-JSON
    json_data = backend.query_to_js(columns_names, rows)

    return json_data


@app.route('/plantsType', methods=['GET'])
@cross_origin()
def plantsType():
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()

    # שליפת שמות העמודות אוטומטית
    cursor.execute("SELECT * FROM plants_Type")
    columns_names = [description[0] for description in cursor.description]

    # שליפת נתונים
    rows = cursor.fetchall()
    # print(rows)
    # המרת הנתונים ל-JSON
    json_data = backend.query_to_js(columns_names, rows)

    return json_data


@app.route('/climateType', methods=['GET'])
@cross_origin()
def climateType():
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()

    # שליפת שמות העמודות אוטומטית
    cursor.execute("SELECT * FROM Climate_type")
    columns_names = [description[0] for description in cursor.description]

    # שליפת נתונים
    rows = cursor.fetchall()
    # print(rows)
    # המרת הנתונים ל-JSON
    json_data = backend.query_to_js(columns_names, rows)

    return json_data


@app.route('/projects', methods=['GET'])
@cross_origin()
def projects():
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()

    # שליפת שמות העמודות אוטומטית
    cursor.execute("SELECT * FROM projects")
    columns_names = [description[0] for description in cursor.description]

    # שליפת נתונים
    rows = cursor.fetchall()
    json_data = []
    for row in rows:
        row_dict = dict(zip(columns_names, row))
        if row_dict['img']:  # אם יש נתונים בעמודת img
            row_dict['img'] = base64.b64encode(row_dict['img']).decode('utf-8')
        json_data.append(row_dict)

    # print(rows)
    # המרת הנתונים ל-JSON
    # json_data = backend.query_to_js(columns_names, rows)

    return json_data


@app.route('/newUser', methods=['POST'])
@cross_origin()
def newUser():
    req = request.json

    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()
    sql = f"""
       INSERT INTO users (name, email, password, Type, inactive)
       SELECT '{req["user"]["Name"]}', '{req["user"]["Email"]}', '{req["user"]["Password"]}', id, 1
       FROM UserType
       WHERE name = '{req["userType"]}';
       """

    # print(sql)
    try:
        cursor.execute(sql)
        conn.commit()
        response = {"status": "success", "message": "added successfully"}
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        response = {"status": "error", "message": str(e)}
    finally:
        conn.close()

    return response


@app.route('/newPlants', methods=['POST'])
@cross_origin()
def NewPlants():
    try:
        conn = sqlite3.connect("PlantPricer.db")
        cursor = conn.cursor()
        req = request.get_json()
        # print("Request received:", req)

        img = req.get("img", None)  # Safely access the img key
        data = req.get("data", None)

        if img is None or data is None:
            return {"success": True}, 200

        # print("Image Data:", img.split(",")[1])  # Debug Base64 content
        # Continue processing...
        if "," in req["img"]:
            image_data = base64.b64decode(req["img"].split(",")[1])
        else:
            image_data = base64.b64decode(req["img"])
        sql = f"""
           INSERT INTO plants (name, price, info, type, climate, img)
           VALUES (
               '{req["data"]["name"]}',
               {req["data"]["price"]},
               '{req["data"]["description"]}',
               (SELECT id FROM Plants_type WHERE name = '{req["type_plant"]}'),
               (SELECT id FROM Climate_type WHERE name = '{req["climate"]}'),
               ?
           )
        """
        cursor.execute(sql, (image_data,))
        conn.commit()
        response = {"status": "success", "message": "Added successfully"}
        return response, 200

    except Exception as e:
        print("Error:", e)
        return {"error": str(e)}, 500


#


@app.route('/newElement', methods=['POST'])
@cross_origin()
def newElement():
    req = request.json

    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()

    try:
        # Validate and decode the image data
        img_field = req["data"]["img"]
        if not isinstance(img_field, str):
            raise ValueError("Image data must be a base64-encoded string.")

        if "," in img_field:
            image_data = base64.b64decode(img_field.split(",")[1])
        else:
            image_data = base64.b64decode(img_field)
    except Exception as e:
        print(f"Error decoding image data: {e}")
        return {"status": "error", "message": f"Invalid image data format: {e}"}, 400

    # Prepare the SQL query
    sql = """
        INSERT INTO garden_elements (name, price, info, img) 
        VALUES (?, ?, ?, ?)
    """
    try:
        cursor.execute(sql, (
            req["data"]["name"],
            req["data"]["price"],
            req["data"]["description"],
            image_data
        ))
        conn.commit()
        response = {"status": "success", "message": "Added successfully"}
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        response = {"status": "error", "message": str(e)}
    finally:
        conn.close()

    return response


@app.route('/project_details', methods=['POST'])
@cross_origin()
def project_details():
    req = request.json
    print(req)
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()
    sql = f"""
        SELECT 
            CASE 
                WHEN project_details.type = 'Plant' THEN plants.img
                WHEN project_details.type = 'Garden Element' THEN garden_elements.img
            END AS img,
            project_details.*

        FROM project_details
        LEFT JOIN plants
            ON project_details.item_id = plants.id AND project_details.type = 'Plant'
        LEFT JOIN garden_elements
            ON project_details.item_id = garden_elements.element_id AND project_details.type = 'Garden Element'
        WHERE project_details.project_id = {req["project"]["id"]};
    """

    try:
        cursor.execute(sql)
        columns_names = [description[0] for description in cursor.description]

        rows = cursor.fetchall()

        # Convert the image bytes to base64 strings
        json_data = []
        for row in rows:
            row_dict = dict(zip(columns_names, row))
            if row_dict.get("img") is not None:
                # Convert bytes to base64 string
                row_dict["img"] = base64.b64encode(row_dict["img"]).decode('utf-8')
            json_data.append(row_dict)

        return jsonify({"status": "success", "data": json_data})

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        response = {"status": "error", "message": str(e)}
        return jsonify(response)
    finally:
        conn.close()


@app.route('/plants', methods=['GET'])
@cross_origin()
def plants():
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()

    sql = """SELECT 
    Plants.id,
    Plants.name,
    Plants.type AS plant_type,
    Plants.info AS info,
    Plants.img AS img,
    Plants.price,
    Climate_type.name AS climate_name
    FROM 
        Plants
    INNER JOIN 
        Climate_type
    ON 
        Plants.climate = Climate_type.id;"""

    cursor.execute(sql)
    columns_names = [description[0] for description in cursor.description]
    rows = cursor.fetchall()

    # המרת נתונים ל-JSON עם Base64 עבור img
    json_data = []
    for row in rows:
        row_dict = dict(zip(columns_names, row))
        if row_dict['img']:  # אם יש נתונים בעמודת img
            row_dict['img'] = base64.b64encode(row_dict['img']).decode('utf-8')
        json_data.append(row_dict)

    conn.close()
    return jsonify(json_data)


@app.route('/gardenElement', methods=['GET'])
@cross_origin()
def gardenElement():
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()
    sql = """SELECT element_id  as id, name,price, img, info from garden_elements"""
    # שליפת שמות העמודות אוטומטית
    cursor.execute(sql)
    columns_names = [description[0] for description in cursor.description]

    # שליפת נתונים
    rows = cursor.fetchall()
    json_data = []
    for row in rows:
        row_dict = dict(zip(columns_names, row))
        if row_dict['img']:  # אם יש נתונים בעמודת img
            row_dict['img'] = base64.b64encode(row_dict['img']).decode('utf-8')
        json_data.append(row_dict)

    conn.close()
    return jsonify(json_data)

    # return json_data


@app.route('/UpdateGardenElement', methods=['POST'])
@cross_origin()
def UpdateGardenElement():
    req = request.get_json()

    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()

    sql = f"""
        UPDATE garden_elements
        SET 
             info ='{req["garden"]["info"]}',
            price = {req["garden"]["price"]}
         WHERE element_id =  {req["garden"]["id"]};
       """

    print(sql)
    try:
        cursor.execute(sql)
        conn.commit()
        sql = """SELECT element_id  as id, name,price from garden_elements"""
        # שליפת שמות העמודות אוטומטית
        cursor.execute(sql)
        columns_names = [description[0] for description in cursor.description]

        # שליפת נתונים
        rows = cursor.fetchall()
        # print(rows)
        # המרת הנתונים ל-JSON
        json_data = backend.query_to_js(columns_names, rows)
        response = {"status": "success", "message": " added successfully", "new_elements": json_data}
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        response = {"status": "error", "message": str(e)}
    finally:
        conn.close()

    return response


@app.route('/UpdatePlants', methods=['POST'])
@cross_origin()
def UpdatePlants():
    req = request.get_json()

    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()
    print(req)
    sql = f"""
        UPDATE plants
        SET 
             info ='{req["plants"]["info"]}',
            price = {req["plants"]["price"]}
         WHERE id =  {req["plants"]["id"]};
       """

    # print(sql)
    try:
        cursor.execute(sql)
        conn.commit()
        response = {"status": "success", "message": "User added successfully"}
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        response = {"status": "error", "message": str(e)}
    finally:
        conn.close()

    return response


@app.route('/suppliers', methods=['POST'])
@cross_origin()
def update_supplier():
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()
    req = request.json  # הנתונים שמגיעים מהלקוח
    print("Request received:", req)  # בדוק מה התקבל בשרת

    if 'id' not in req:
        return {"status": "error", "message": "Missing 'id' in request data"}, 400

    sql = f"""
        UPDATE users
        SET
            name = '{req["name"]}',
            info = '{req["info"]}'
        WHERE id = {req["id"]};
        
    """
    # print(sql)
    try:
        cursor.execute(sql)
        conn.commit()
        return {"status": "success", "message": "Supplier updated successfully"}
    except sqlite3.Error as e:
        return {"status": "error", "message": str(e)}, 500
    finally:
        conn.close()


@app.route('/newProject', methods=['POST'])
@cross_origin()
def newProject():
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()
    req = request.json  # הנתונים שמגיעים מהלקוח
    print("Request received:", req)  # בדוק מה התקבל בשרת

    sql = f"""
    INSERT INTO projects (client_id,name, status_id,Budget,Width,Len,climate,inactive)
    VALUES ({req["user"]["Id"]}, '{req["project"]["projectName"]}', 1,  {req["project"]["budget"]}, {req["project"]["width"]}, {req["project"]["length"]}, (SELECT id FROM Climate_type WHERE name='{req["project"]["climate"]}'),1);


    """

    print(sql)

    try:
        cursor.execute(sql)
        conn.commit()
        return {"status": "success", "message": "new Project successfully"}
    except sqlite3.Error as e:
        return {"status": "error", "message": str(e)}, 500
    finally:
        conn.close()




@app.route('/deleteProject', methods=['POST'])
@cross_origin()
def deleteProject():
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()
    req = request.json  # הנתונים שמגיעים מהלקוח
    print("Request received:", req)  # בדוק מה התקבל בשרת

    try:
        # עדכון שדה inactive בפרויקט
        update_sql = f"""
        UPDATE projects
        SET inactive = 0
        WHERE id = ?;
        """
        cursor.execute(update_sql, (req["id"],))

        # מחיקת הפרטים הקשורים לפרויקט
        delete_sql = f"""
        DELETE FROM project_details
        WHERE project_id = ?;
        """
        cursor.execute(delete_sql, (req["id"],))

        conn.commit()
        return {"status": "success", "message": "Project successfully deleted and updated"}
    except sqlite3.Error as e:
        print("SQL Error:", e)
        return {"status": "error", "message": str(e)}, 500
    finally:
        conn.close()



#
# @app.route('/deleteProject', methods=['POST'])
# @cross_origin()
# def deleteProject():
#     conn = sqlite3.connect("PlantPricer.db")
#     cursor = conn.cursor()
#     req = request.json  # הנתונים שמגיעים מהלקוח
#     print("Request received:", req)  # בדוק מה התקבל בשרת
#
#     sql = f"""
#      UPDATE projects
#         SET
#             inactive=0
#         WHERE id = {req["id"]};
#
#     DELETE FROM project_details
#         WHERE project_id = {req["id"]};
#
#     """
#
#     print(sql)
#
#     try:
#         cursor.execute(sql)
#         conn.commit()
#         return {"status": "success", "message": "new Project successfully"}
#     except sqlite3.Error as e:
#         return {"status": "error", "message": str(e)}, 500
#     finally:
#         conn.close()


@app.route('/newReview', methods=['POST'])
@cross_origin()
def newReview():
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()
    req = request.json  # הנתונים שמגיעים מהלקוח
    print("Request received:", req)  # בדוק מה התקבל בשרת

    sql = f"""
    INSERT INTO rating (user_id,stars,review)
    VALUES ({req["id"]},  '{req["rating"]}', '{req["feedback"]}');


    """

    try:
        cursor.execute(sql)
        conn.commit()
        return {"status": "success", "message": "new Project successfully"}
    except sqlite3.Error as e:
        return {"status": "error", "message": str(e)}, 500
    finally:
        conn.close()


@app.route('/review', methods=['GET'])
@cross_origin()
def review():
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()

    # שליפת שמות העמודות אוטומטית
    cursor.execute("""SELECT 
    rating.id,
    rating.review,
    rating.created_at,
    rating.stars,
	users.Name 
    FROM 
    rating
    JOIN 
    users
    ON 
    rating.user_id = users.Id;""")
    columns_names = [description[0] for description in cursor.description]

    # שליפת נתונים
    rows = cursor.fetchall()
    # print(rows)
    # המרת הנתונים ל-JSON
    json_data = backend.query_to_js(columns_names, rows)

    return json_data





# def insert_details(item,project,detail_id_to_check):
def insert_details(item, project, detail_id_to_check):
    print((item["id"]))
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()

    # בדיקת קיום `detail_id_to_check` בטבלה
    check_sql = "SELECT 1 FROM project_details WHERE detail_id = ?"
    cursor.execute(check_sql, (detail_id_to_check,))
    if cursor.fetchone():
        print({"status": "error", "message": f"detail_id {detail_id_to_check} already exists"}, 400)
        conn.close()
        return

    # הוספת פריט חדש
    insert_sql = """
        INSERT INTO project_details
        (detail_id, project_id, item_id, itemName, total_price, type, x, y)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    """
    try:
        cursor.execute(insert_sql, (
            detail_id_to_check,
            project["id"],
            item["id"],
            item["name"],  # הנחה ש-name הוא מחרוזת ולא מספר
            item["price"],
            item["type"],
            item["x"],
            item["y"]
        ))
        print(project["id"])
        conn.commit()
        print({"status": "success", "message": "New item added successfully"})
    except sqlite3.Error as e:
        print({"status": "error", "message": str(e)}, 500)
    finally:
        conn.close()


def delete_item(delete_id):
    delete_sql = f"""
        DELETE FROM project_details
        WHERE detail_id = {delete_id}; 
    """
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()
    try:
        cursor.execute(delete_sql)
        conn.commit()
        print({"status": "success", "message": "item delete successfully"})

    except sqlite3.Error as e:
        print({"status": "error", "message": str(e)}, 500)
    finally:
        conn.close()


@app.route('/designers', methods=['POST'])
@cross_origin()
def update_designer():
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()
    req = request.json  # הנתונים שמגיעים מהלקוח
    # print("Request received:", req)  # בדוק מה התקבל בשרת

    sql = f"""
        UPDATE users
        SET
            info = '{req["info"]}'
        WHERE id = {req["id"]};

    """
    # print(sql)
    try:
        cursor.execute(sql)
        conn.commit()
        return {"status": "success", "message": "Designer updated successfully"}
    except sqlite3.Error as e:
        return {"status": "error", "message": str(e)}, 500
    finally:
        conn.close()


@app.route('/updateUserStatus', methods=['POST'])
@cross_origin()
def update_user_status():
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()
    req = request.json  # הנתונים שמגיעים מהלקוח
    print("Request received:", req)  # בדוק מה התקבל בשרת

    # if 'id' not in req:
    #     return {"status": "error", "message": "Missing 'id' in request data"}, 400
    print(req)
    sql = f"""
        UPDATE users
        SET
            inactive = {req["isActive"]}
        WHERE id = {req["id"]};

    """
    # print(sql)
    try:
        cursor.execute(sql)
        conn.commit()
        return {"status": "success", "message": "User updated successfully"}
    except sqlite3.Error as e:
        return {"status": "error", "message": str(e)}, 500
    finally:
        conn.close()


@app.route('/insertItemProject', methods=['POST'])
@cross_origin()
def insertItemProject():
    req = request.get_json()

    project = req["project"]
    plant = req["Plant"]
    removeList = req["removedItems"]

    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()

    try:

        sql = """SELECT * from project_details"""
        # שליפת שמות העמודות אוטומטית
        cursor.execute(sql)
        columns_names = [description[0] for description in cursor.description]

        # # שליפת נתונים
        rows = cursor.fetchall()
        print(rows)

        # # המרת הנתונים ל-JSON
        json_data = backend.query_to_js(columns_names, rows)
        print(json_data)
        if len(req["Garden Element"]) != 0:
            for i in range(len(req["Garden Element"])):

                detail_id_to_check = req["Garden Element"][i]["uniqueId"]
                exists = any(detail['detail_id'] == detail_id_to_check for detail in json_data)
                if exists:
                    print(f"detail_id {detail_id_to_check} קיים ברשימה.")
                    # update_detail()
                else:
                    insert_details(req["Garden Element"][i], project, detail_id_to_check)
                    print(f"detail_id {detail_id_to_check} לא קיים ברשימה.")

        if len(req["Plant"]) != 0:
            for i in range(len(req["Plant"])):

                detail_id_to_check = plant[i]["uniqueId"]
                exists = any(detail['detail_id'] == detail_id_to_check for detail in json_data)
                if exists:
                    print(f"detail_id {detail_id_to_check} קיים ברשימה.")
                    # update_detail()
                else:
                    insert_details(req["Plant"][i], project, detail_id_to_check)
                    # print(plant[i])
                    print(f"detail_id {detail_id_to_check} לא קיים ברשימה.")
        if len(removeList) != 0:
            for i in range(len(removeList)):
                detail_id_to_check = removeList[i]["uniqueId"]
                exists = any(detail['detail_id'] == detail_id_to_check for detail in json_data)
                if (exists):
                    delete_item(detail_id_to_check)
                    print("item is delete")
        response = {"status": "success", "message": " added successfully", "new_elements": json_data}
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        response = {"status": "error", "message": str(e)}
    finally:
        conn.close()

    return response


@app.route('/InsertImgToProject', methods=['POST'])
@cross_origin()
def InsertImgToProject():
    try:
        conn = sqlite3.connect("PlantPricer.db")
        cursor = conn.cursor()
        req = request.get_json()

        # קבלת נתוני התמונה ומזהה הפרויקט
        img_base64 = req.get("img")
        project_id = req.get("id")

        if not img_base64 or not project_id:
            return {"success": False, "message": "Missing image or project ID"}, 400

        # המרת נתוני Base64 לפורמט בינארי
        if "," in img_base64:
            img_data = img_base64.split(",")[1]  # הפרדה בין metadata לבין התמונה עצמה
        else:
            img_data = img_base64

        img_binary = base64.b64decode(img_data)  # המרה מבסיס 64 לבינארי

        # עדכון בסיס הנתונים עם התמונה
        sql = """
            UPDATE projects
            SET img = ?
            WHERE id = ?;
        """
        cursor.execute(sql, (img_binary, project_id))
        conn.commit()

        return {"status": "success", "message": "Image stored as BLOB successfully"}, 200

    except Exception as e:
        print("Error:", e)
        return {"error": str(e)}, 500

    finally:
        if conn:
            conn.close()


if __name__ == "__main__":
    # db.create_all()
    # app.run(host='10.100.102.17', debug=True)
    # app.run(host='172.20.10.2', debug=True)

    app.run(host="0.0.0.0", port=5001, debug=True)
