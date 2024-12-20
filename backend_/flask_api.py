from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS, cross_origin
<<<<<<< HEAD
import sqlite3
=======
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy

from flask_restful import Api
# from mobile_resources.events import UserMobile
import sqlite3,flask_sqlalchemy
import json
>>>>>>> c49de15f9ea4f718cde873facd0fbd04320f4d2c
import backend

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # נדרש לניהול session
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

# פונקציה להתחברות משתמש
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

    conn.close()
    return json_data

# פונקציה לשליפת סוגי משתמשים
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

    conn.close()
    return json_data

# פונקציה ליצירת משתמש חדש
@app.route('/newUser', methods=['POST'])
@cross_origin()
def NewProject():
    req = request.json
    print(req["userType"])
    print(req["user"]["Name"])
    print(req)
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

    return jsonify(response)

# פונקציה לשליפת ביקורות מתוך הטבלה של reviews
@app.route('/reviews', methods=['GET'])
@cross_origin()
def reviews():
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()

    # שליפת שמות העמודות אוטומטית
    cursor.execute("""
        SELECT r.id, r.rating, r.feedback, r.created_at, u.name AS username 
        FROM reviews r 
        JOIN users u ON r.user_id = u.id
    """)
    columns_names = [description[0] for description in cursor.description]
    rows = cursor.fetchall()

    # המרת הנתונים ל-JSON
    json_data = backend.query_to_js(columns_names, rows)

    conn.close()
    return json_data

# פונקציה להוספת ביקורת חדשה
@app.route('/submit_review', methods=['POST'])
@cross_origin()
def submit_review():
    if 'user_id' not in session:
        return {"status": "error", "message": "User not logged in"}, 401

    req = request.json
    print(req)

    # בדיקת קלט
    if not all(key in req for key in ('rating', 'feedback')):
        return {"status": "error", "message": "Missing required fields"}, 400

    # שליפת נתונים
    rating = req['rating']
    feedback = req['feedback']
    user_id = session['user_id']

    # הכנסת הנתונים למסד הנתונים
    conn = sqlite3.connect("PlantPricer.db")
    cursor = conn.cursor()
    sql = """
        INSERT INTO reviews (user_id, rating, feedback, created_at)
        VALUES (?, ?, ?, datetime('now'))
    """
    try:
        cursor.execute(sql, (user_id, rating, feedback))
        conn.commit()
        response = {"status": "success", "message": "Review submitted successfully"}
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        response = {"status": "error", "message": str(e)}
    finally:
        conn.close()

    return jsonify(response)


if __name__ == "__main__":
<<<<<<< HEAD
    app.run(host='0.0.0.0', debug=True)
=======
    # db.create_all()
    # app.run(host='10.100.102.17', debug=True)
    # app.run(host='172.20.10.2', debug=True)

    app.run(host="0.0.0.0", port=5000, debug=True)
>>>>>>> c49de15f9ea4f718cde873facd0fbd04320f4d2c
