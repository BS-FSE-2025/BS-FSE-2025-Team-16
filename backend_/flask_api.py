from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify, after_this_request
from flask_cors import CORS, cross_origin
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
import json

from flask_restful import Api
# from mobile_resources.events import UserMobile
import sqlite3,flask_sqlalchemy
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
def login():
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


if __name__ == "__main__":
    # db.create_all()
    # app.run(host='10.100.102.17', debug=True)
    # app.run(host='172.20.10.2', debug=True)

     app.run(host='172.20.10.7', debug=True)