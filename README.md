# BS-FSE-2025-Team16
## Project Name: PlantPricer 🌱
PlantPricer is a web application that helps users design and plan their dream home garden. It allows users to visualize their garden layout, estimate costs, and explore a comprehensive database of plants and garden elements. Additionally, users can choose
to copy a design from one of the site's own designers and build off their
designs as a baseline. The site also has a list of suppliers, that can update the
site's item list. Users can look at the supplier/designer pages to get in contact
with them and use their services if they need to.
## Features
* Visual design tools for arranging plants in your garden.
* Calculate the total cost of your garden plan.
* A comprehensive plant and garden element database with pricing and additional info.
* Easy-to-use interface for creating and saving your garden plans.
* Lists of desingers and suppliers to help you bring your garden to life.
## Tech Stack
* Frontend: React
* Backend: Python (Flask)
* Database: SQLite
## Prerequisites
Make sure you have the following installed:
* Node.js (for running the React frontend, link in the installation section)
* Python 3.8+ (includes the sqlite3 module, or you can download the VSC extension)
* Git (to clone the repository)
## Installation
We recommand running the site on [Visual Studio Code](https://code.visualstudio.com/)
and installing [Node.js](https://nodejs.org/en)

Once installed, install the following extensions on Visual Studio Code:

[GitHub Repositories](https://marketplace.visualstudio.com/items?itemName=GitHub.remotehub) 

[Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python)

[React Native Tools](https://marketplace.visualstudio.com/items?itemName=msjsdiag.vscode-react-native)

After the extensions are installed, clone the repo:
```bash
git clone https://github.com/username/BS-FSE-2025-Team-16.git
cd BS-FSE-2025-Team-16
```
Then, open 2 new terminals.
On one terminal, navigate to the backend_ folder by typing:
```bash
cd backend_
```
and then install the backend packages using the command:
```bash
pip install flask flask-cors flask-session flask-sqlalchemy flask-restful sqlite3 json base64
```
after installing everything, run the command:
```bash
python flask_api.py
```
to run the python backend.

On the second terminal, navigate to:
```bash
cd frontend
```
and run the following command:
```bash
npm install
```
after the installation, run the command:
```bash
npm start
```
to run the frontend of the site.
