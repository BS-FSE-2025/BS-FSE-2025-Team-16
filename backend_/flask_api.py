from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify, after_this_request
from flask_cors import CORS, cross_origin
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy

from flask_restful import Api
# from mobile_resources.events import UserMobile
import sqlite3, flask_sqlalchemy
import json
import backend

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
    print(rows)
    # המרת הנתונים ל-JSON
    json_data = backend.query_to_js(columns_names, rows)

    return json_data


@app.route('/newUser', methods=['POST'])
@cross_origin()
def NewProject():
    req = request.json

    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()
    sql = f"""
       INSERT INTO users (name, email, password, Type, inactive)
       SELECT '{req["user"]["Name"]}', '{req["user"]["Email"]}', '{req["user"]["Password"]}', id, 1
       FROM UserType
       WHERE name = '{req["userType"]}';
       """

    print(sql)
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


@app.route('/plants', methods=['GET'])
@cross_origin()
def plants():
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()
    sql = """SELECT 
    Plants.plant_id AS plant_id,
    Plants.name AS plant_name,
    Plants.type AS plant_type,
    Plants.price AS plant_price,
    Climate_type.name AS climate_name
    FROM 
        Plants
    INNER JOIN 
        Climate_type
    ON 
        Plants.climate = Climate_type.id;"""
    # שליפת שמות העמודות אוטומטית
    cursor.execute(sql)
    columns_names = [description[0] for description in cursor.description]

    # שליפת נתונים
    rows = cursor.fetchall()
    print(rows)
    # המרת הנתונים ל-JSON
    json_data = backend.query_to_js(columns_names, rows)

    return json_data


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

    print(sql)
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
    print(sql)
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
