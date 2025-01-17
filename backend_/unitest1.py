import pytest
import json
from flask_api import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_users(client):
    response = client.get('/users')
    assert response.status_code == 200
    assert isinstance(response.json, list)


def test_users_type(client):
    response = client.get('/usersType')
    assert response.status_code == 200
    assert isinstance(response.json, list)


def test_plants_type(client):
    response = client.get('/plantsType')
    assert response.status_code == 200
    assert isinstance(response.json, list)


def test_climate_type(client):
    response = client.get('/climateType')
    assert response.status_code == 200
    assert isinstance(response.json, list)


def test_projects(client):
    response = client.get('/projects')
    assert response.status_code == 200
    assert isinstance(response.json, list)


def test_new_user(client):
    data = {
        "user": {"Name": "Test User", "Email": "test@example.com", "Password": "password123"},
        "userType": "Client"
    }
    response = client.post('/newUser', json=data)
    assert response.status_code == 200
    assert response.json["status"] == "success"


def test_new_plants(client):
    data = {
        "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA",
        "data": {
            "name": "Test Plant",
            "price": 100,
            "description": "A test plant"
        },
        "type_plant": "Tree",
        "climate": "Tropical"
    }
    response = client.post('/newPlants', json=data)
    assert response.status_code == 200



def test_new_element(client):
    data = {
        "data": {
            "name": "Test Element",
            "price": 200,
            "description": "A test garden element",
            "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA"
        }
    }
    response = client.post('/newElement', json=data)
    assert response.status_code == 200
    assert response.json["status"] == "success"


def test_project_details(client):
    data = {"project": {"id": 1}}
    response = client.post('/project_details', json=data)
    assert response.status_code == 200
    assert response.json["status"] == "success"


def test_update_garden_element(client):
    data = {
        "garden": {"id": 1, "info": "Updated info", "price": 150}
    }
    response = client.post('/UpdateGardenElement', json=data)
    assert response.status_code == 200
    assert response.json["status"] == "success"


def test_update_plants(client):
    data = {
        "plants": {"id": 1, "info": "Updated plant info", "price": 120}
    }
    response = client.post('/UpdatePlants', json=data)
    assert response.status_code == 200
    assert response.json["status"] == "success"


def test_copy_project(client):
    data = {
        "user": {"Id": 1},
        "project": {
            "id": 1,
            "name": "Original Project",
            "Budget": 1000,
            "Width": 10,
            "Len": 10,
            "Climate": 1
        }
    }
    response = client.post('/copyProject', json=data)
    assert response.status_code == 200
    assert response.json["status"] == "success"


def test_insert_item_project(client):
    data = {
        "project": {"id": 1},
        "Plant": [{"uniqueId": 123, "id": 1, "name": "Test Plant", "price": 50, "type": "Plant", "x": 0, "y": 0}],
        "removedItems": [{"uniqueId": 456}],
        "Garden Element": []
    }
    response = client.post('/insertItemProject', json=data)
    assert response.status_code == 200
    assert response.json["status"] == "success"


def test_insert_img_to_project(client):
    data = {
        "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA",
        "id": 1
    }
    response = client.post('/InsertImgToProject', json=data)
    assert response.status_code == 200
    assert response.json["status"] == "success"


def test_new_review(client):
    data = {
        "id": 1,
        "rating": 5,
        "feedback": "Excellent!"
    }
    response = client.post('/newReview', json=data)
    assert response.status_code == 200
    assert response.json["status"] == "success"


def test_review(client):
    response = client.get('/review')
    assert response.status_code == 200
    assert isinstance(response.json, list)