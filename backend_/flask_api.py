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


@app.route('/plants', methods=['GET'])
@cross_origin()
def plants():
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()

    sql = """SELECT 
    Plants.plant_id AS plant_id,
    Plants.name AS plant_name,
    Plants.type AS plant_type,
    Plants.info AS info,
    Plants.img AS img,
    Plants.price AS plant_price,
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
             name ='{req["garden"]["name"]}',
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

    sql = f"""
        UPDATE plants
        SET 
             name ='{req["plants"]["name"]}',
            price = {req["plants"]["price"]}
         WHERE plant_id =  {req["plants"]["id"]};
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

    # if 'id' not in req:
    #     return {"status": "error", "message": "Missing 'id' in request data"}, 400

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
    INSERT INTO projects (client_id,name, status_id,Budget,Width,Len,climate)
    VALUES ({req["user"]["Id"]}, '{req["project"]["projectName"]}', 1,  {req["project"]["budget"]}, {req["project"]["width"]}, {req["project"]["length"]}, (SELECT id FROM Climate_type WHERE name='{req["project"]["climate"]}'));


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


if __name__ == "__main__":
    # db.create_all()
    # app.run(host='10.100.102.17', debug=True)
    # app.run(host='172.20.10.2', debug=True)

    app.run(host="0.0.0.0", port=5001, debug=True)
