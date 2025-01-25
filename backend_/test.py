import unittest
import json
import base64
import os
from flask_api import app
import sqlite3


class FlaskAppTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Create test database
        cls.test_db = "test_PlantPricer.db"
        app.config['TESTING'] = True
        cls.client = app.test_client()

        # Create test tables
        conn = sqlite3.connect(cls.test_db)
        cursor = conn.cursor()

        # Create all necessary tables
        cursor.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT,
                password TEXT,
                Type INTEGER,
                info TEXT,
                inactive INTEGER DEFAULT 1
            );

            CREATE TABLE IF NOT EXISTS UserType (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT
            );

            CREATE TABLE IF NOT EXISTS plants (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                price REAL,
                info TEXT,
                type INTEGER,
                climate INTEGER,
                img BLOB
            );

            CREATE TABLE IF NOT EXISTS plants_Type (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT
            );

            CREATE TABLE IF NOT EXISTS Climate_type (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT
            );

            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_id INTEGER,
                name TEXT,
                status_id INTEGER,
                Budget REAL,
                Width INTEGER,
                Len INTEGER,
                climate INTEGER,
                inactive INTEGER,
                img BLOB
            );

            CREATE TABLE IF NOT EXISTS project_details (
                detail_id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER,
                item_id INTEGER,
                itemName TEXT,
                total_price REAL,
                type TEXT,
                x REAL,
                y REAL
            );

            CREATE TABLE IF NOT EXISTS garden_elements (
                element_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                price REAL,
                info TEXT,
                img BLOB
            );

            CREATE TABLE IF NOT EXISTS rating (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                stars INTEGER,
                review TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()
        conn.close()

    def setUp(self):
        # Insert test data before each test
        conn = sqlite3.connect(self.test_db)
        cursor = conn.cursor()

        # Insert basic test data
        cursor.executescript("""
            INSERT INTO UserType (name) VALUES ('TestType');
            INSERT INTO Climate_type (name) VALUES ('Tropical');
            INSERT INTO plants_Type (name) VALUES ('Flowering');

            INSERT INTO users (name, email, password, Type, info, inactive)
            VALUES ('Test User', 'test@test.com', 'password123', 1, 'Test Info', 1);

            INSERT INTO projects (client_id, name, status_id, Budget, Width, Len, climate, inactive)
            VALUES (1, 'Test Project', 1, 1000, 100, 200, 1, 1);
        """)

        conn.commit()
        conn.close()

    def tearDown(self):
        # Clean up after each test
        conn = sqlite3.connect(self.test_db)
        cursor = conn.cursor()
        cursor.executescript("""
            DELETE FROM users;
            DELETE FROM UserType;
            DELETE FROM plants;
            DELETE FROM plants_Type;
            DELETE FROM Climate_type;
            DELETE FROM projects;
            DELETE FROM project_details;
            DELETE FROM garden_elements;
            DELETE FROM rating;
            DELETE FROM sqlite_sequence;
        """)
        conn.commit()
        conn.close()

    @classmethod
    def tearDownClass(cls):
        if os.path.exists(cls.test_db):
            os.remove(cls.test_db)

    # User Related Tests
    def test_get_users(self):
        response = self.client.get('/users')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        self.assertTrue(len(data) > 0)



    def test_get_users_fail(self):
        response = self.client.get('/users')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        # data.filter()
        filtered_data = list(filter(lambda item: "amir" == item['Name'].lower() and "Amir123"==item['Password'], data))
        print(filtered_data)
        self.assertIsInstance(filtered_data, list)
        self.assertTrue(len(filtered_data) > 0)

    def test_get_users_type(self):
        response = self.client.get('/usersType')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        self.assertTrue(len(data) > 0)

    def test_get_users_type_fail(self):
        response = self.client.get('/usersType')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, str)
        # self.assertTrue(len(data) <= 0)



    def test_update_user_status(self):
        test_data = {
            "id": 1,
            "isActive": 0
        }
        response = self.client.post('/updateUserStatus',
                                    json=test_data,
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'success')

    # Plant Related Tests
    def test_get_plants_type(self):
        response = self.client.get('/plantsType')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)

    def test_get_climate_type(self):
        response = self.client.get('/climateType')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)

    def test_get_climate_type_fail(self):
        response = self.client.get('/climateType')

        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        # data.filter()
        filtered_data = list(filter(lambda item: "artic" == item['name'].lower(), data))
        print(filtered_data)
        self.assertIsInstance(filtered_data, list)
        self.assertTrue(len(filtered_data) > 0)

    def test_new_plants(self):
        # Create test image
        test_image = base64.b64encode(b"test image data").decode('utf-8')

        test_plant = {
            "data": {
                "name": "Test Plant",
                "price": 100,
                "description": "Test Description"
            },
            "type_plant": "Flowering",
            "climate": "Tropical",
            "img": test_image
        }

        response = self.client.post('/newPlants',
                                    json=test_plant,
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'success')

    def test_get_plants(self):
        response = self.client.get('/plants')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)

    # Garden Element Tests
    def test_get_garden_elements(self):
        response = self.client.get('/gardenElement')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)

    def test_new_garden_element(self):
        test_image = base64.b64encode(b"test image data").decode('utf-8')

        test_element = {
            "data": {
                "name": "Test Element",
                "price": 150,
                "description": "Test Description",
                "img": test_image
            }
        }

        response = self.client.post('/newElement',
                                    json=test_element,
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'success')

    # Project Tests
    def test_get_projects(self):
        response = self.client.get('/projects')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)

    def test_new_project(self):
        project_data = {
            "user": {"Id": 1},
            "project": {
                "projectName": "New Test Project",
                "budget": 2000,
                "width": 150,
                "length": 250,
                "climate": "Tropical"
            }
        }

        response = self.client.post('/newProject',
                                    json=project_data,
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'success')

    def test_project_details(self):
        # First create some project details
        conn = sqlite3.connect(self.test_db)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO project_details (project_id, item_id, itemName, total_price, type)
            VALUES (1, 1, 'Test Item', 100, 'Plant')
        """)
        conn.commit()
        conn.close()

        response = self.client.post('/project_details',
                                    json={"project": {"id": 1}},
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'success')

    def test_copy_project(self):
        project_data = {
            "user": {"Id": 1},
            "project": {
                "id": 1,
                "name": "Original Project",
                "Budget": 1000,
                "Width": 100,
                "Len": 200,
                "Climate": 1
            }
        }

        response = self.client.post('/copyProject',
                                    json=project_data,
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'success')

    # Review Tests
    def test_new_review(self):
        review_data = {
            "id": 1,
            "rating": 5,
            "feedback": "Great service!"
        }

        response = self.client.post('/newReview',
                                    json=review_data,
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'success')

    def test_get_reviews(self):
        response = self.client.get('/review')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)

    # Supplier/Designer Tests
    def test_update_supplier(self):
        supplier_data = {
            "id": 1,
            "name": "Updated Supplier",
            "info": "Updated Info"
        }

        response = self.client.post('/suppliers',
                                    json=supplier_data,
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'success')

    def test_update_designer(self):
        designer_data = {
            "id": 1,
            "info": "Updated Designer Info"
        }

        response = self.client.post('/designers',
                                    json=designer_data,
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'success')


if __name__ == '__main__':
    unittest.main()