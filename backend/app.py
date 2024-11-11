from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS
import os
import sqlite3

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = './uploads'

@app.route('/')
def hello_world():
    return 'Hello from Flask!'

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    print("Request for file:", filename)  # 파일 요청 로그 추가
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
    connection = sqlite3.connect('/Users/choesuna/sonah-git/SoleMatch/backend/user_data.db')
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

if __name__ == '__main__':
    # app.run(debug=True)
    app.run(debug=True, host='0.0.0.1', port=5000)