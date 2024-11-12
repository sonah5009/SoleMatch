from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS
import json
import os
import sqlite3
from measure import measure_pressure, save_measurement_image

app = Flask(__name__)
CORS(app)

# Define the base paths for different environments
PRODUCTION_PATH = '/home/sonah5009/mysite'
DEVELOPMENT_PATH = '/Users/choesuna/sonah-git/SoleMatch/backend'
IS_PRODUCTION = os.getenv("FLASK_ENV") == "production"

BASE_PATH = PRODUCTION_PATH if IS_PRODUCTION else DEVELOPMENT_PATH
UPLOAD_FOLDER = os.path.join(BASE_PATH, "uploads")

# Set the upload and base paths in app config
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['BASE_PATH'] = BASE_PATH

@app.route('/')
def hello_world():
    return 'Hello from Flask!'

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    print("Request for file:", filename)  # Log file request
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({"message": "File successfully uploaded", "filename": filename}), 200
    else:
        return jsonify({"error": "Allowed file types are png, jpg, jpeg"}), 400

# Function to add user to the database
def add_user_to_db(user_name):
    db_path = os.path.join(app.config['BASE_PATH'], 'user_data.db')
    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()
    cursor.execute('INSERT INTO users (userName) VALUES (?)', (user_name,))
    user_id = cursor.lastrowid
    connection.commit()
    connection.close()
    print(user_id)
    return user_id

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    user_name = data.get('name')

    if not user_name:
        return jsonify({"error": "Name is required"}), 400

    try:
        user_id = add_user_to_db(user_name)
        return jsonify({"userId": user_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/pressure', methods=['POST'])
def start_measurement():
    try:
        data = request.json
        user_id = data.get("userId")

        if not user_id:
            return jsonify({"success": False, "error": "User ID not provided"}), 400

        # Perform the pressure measurement
        pressure_data = measure_pressure()

        # Save the measurement image
        image_path = save_measurement_image(user_id)

        # Save pressure data and image path in JSON format
        json_path = os.path.join(app.config['BASE_PATH'], "pressure", "pressure_data.json")
        with open(json_path, "w") as f:
            json.dump({"pressure_data": pressure_data, "image_path": image_path}, f)

        return jsonify({"success": True})
    except Exception as e:
        print(e)
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.1', port=5000)
    # app.run(debug=not IS_PRODUCTION, host='0.0.0.0', port=5000)
