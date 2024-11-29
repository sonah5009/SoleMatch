import requests
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS
import os
import sqlite3
# from measure import async_measure_pressure
from scipy.spatial import distance as dist
from imutils import contours
import numpy as np
import imutils
import cv2
import base64
import ast

load_dotenv()
BACKEND_PATH = os.environ.get('BACKEND_PATH')
LOCAL_IP_ADDRESS = os.environ.get('LOCAL_IP_ADDRESS')
EXPO_PUBLIC_BACKEND_URL = os.environ.get('EXPO_PUBLIC_BACKEND_URL')

print("LOCAL_IP_ADDRESS", LOCAL_IP_ADDRESS)

app = Flask(__name__)
# CORS 설정
CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:8081",
                EXPO_PUBLIC_BACKEND_URL,
                f"http://{LOCAL_IP_ADDRESS}:8081"
            ],
            "supports_credentials": True,  # 쿠키나 인증 헤더 허용
        }
    },
)

# Define the base paths for different environments

BASE_PATH = BACKEND_PATH
UPLOAD_FOLDER = os.path.join(BASE_PATH, "uploads")

# Set the upload and base paths in app config
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['BASE_PATH'] = BASE_PATH
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 

@app.route('/')
def hello_world():
    return 'Hello from Flask!'

def midpoint(ptA, ptB):
	return ((ptA[0] + ptB[0]) * 0.5, (ptA[1] + ptB[1]) * 0.5)

@app.route('/user', methods=['GET'])
def get_user_info():
    try:
        db_path = os.path.join(app.config['BASE_PATH'], 'user_data.db')
        print(db_path)
        connection = sqlite3.connect(db_path)
        print("success")
        cursor = connection.cursor()
        print("success")

        userName = request.args.get('userName', default=None, type=str)

        # Build SQL query with optional filtering by userName
        if userName:
            query = 'SELECT * FROM users WHERE userName = ?'
            cursor.execute(query, (userName,))

        print("success")
        row = cursor.fetchone()
        print("success")
        connection.close()

        # Return data directly as a JSON response without needing to format manually
        return jsonify({
                "userName": row[1],
                "pressureId": row[2],
                "pressureValid": row[3],
                "leftFootSize": row[4],
                "rightFootSize": row[5],
                "leftWidth": row[6],
                "rightWidth": row[7],
                "class": row[8]
            }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/users', methods=['GET'])
def get_all_users():
    try:
        db_path = os.path.join(app.config['BASE_PATH'], 'user_data.db')
        print(db_path)
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        # Query to get all users
        cursor.execute('SELECT * FROM users')
        rows = cursor.fetchall()
        connection.close()

        # Convert data to a list of dictionaries for JSON response
        users = []
        print("success")
        for row in rows:
            user = {
                "userName": row[1]
            }
            users.append(user)
        return jsonify(users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/shoes', methods=['GET'])
def get_shoes():
    try:
        db_path = os.path.join(app.config['BASE_PATH'], 'user_data.db')
        print(db_path)
        connection = sqlite3.connect(db_path)
        print("success")
        cursor = connection.cursor()
        print("success")

        # Get user parameters for filtering
        user_class = request.args.get('class', default=None, type=str)
        user_size = request.args.get('size', default=None, type=int)

        # Build SQL query with optional filtering by class
        if user_class:
            query = 'SELECT * FROM shoes WHERE class = ?'
            cursor.execute(query, (user_class,))
        else:
            query = 'SELECT * FROM shoes'
            cursor.execute(query)

        rows = cursor.fetchall()
        connection.close()

        # Convert data to JSON-friendly format and filter based on the size parameter
        shoes = []
        for row in rows:
            # Assuming the availableSizes is stored in the 4th column (index 3)
            available_size_str = row[3]  # The column where available sizes are stored
            try:
                # Safely evaluate the availableSize string to a list
                available_sizes = ast.literal_eval(available_size_str)
            except (ValueError, SyntaxError):
                available_sizes = []  # In case the availableSize is not a valid list

            # Check if the requested size is in the available sizes
            if user_size and user_size in available_sizes:
                shoe = {
                    "id": row[0],
                    "name": row[2],  # Assuming the name is in the 3rd column (index 2)
                    "size": user_size,
                    "site": row[4]  # Assuming the site URL is in the 5th column (index 4)
                }
                shoes.append(shoe)

        return jsonify(shoes), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def imread(filename, flags=cv2.IMREAD_COLOR, dtype=np.uint8):
    try:
        n = np.fromfile(filename, dtype)
        img = cv2.imdecode(n, flags)
        return img
    except Exception as e:
        print(e)
        return None

def imwrite(filename, img, params=None):
    try:
        ext = os.path.splitext(filename)[1]
        result, n = cv2.imencode(ext, img, params)

        if result:
            with open(filename, mode='w+b') as f:
                n.tofile(f)
            return True
        else:
            return False
    except Exception as e:
        print(e)
        return False

@app.route('/analyze_size', methods=['POST'])
def analyze_size(file=None):
    try:
        file = request.files['file']
        if file is None:
            return jsonify({"error": "No file"}), 400

        print("file: ", file)
        fileName = request.form.get('fileName')
        user = request.form.get('user')

        temp_path = os.path.join(app.config['BASE_PATH'], "temp", fileName)
        print("temp_path: ", temp_path)
        file.save(temp_path)

        width_of_leftmost_object = 1.06  # Set your width in inches here

        # Load and process the image for OpenCV measurement
        image = imread(temp_path)
        if image is None:
            return jsonify({"error": "Image not found"}), 400

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (7, 7), 0)
        edged = cv2.Canny(gray, 50, 100)
        edged = cv2.dilate(edged, None, iterations=1)
        edged = cv2.erode(edged, None, iterations=1)
        cnts = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        cnts = imutils.grab_contours(cnts)
        (cnts, _) = contours.sort_contours(cnts)
        pixelsPerMetric = None

        # OpenCV measurement for the first element
        for c in cnts:
            if cv2.contourArea(c) < 3000:  # Adjust the threshold if needed
                continue

            peri = cv2.arcLength(c, True)
            approx = cv2.approxPolyDP(c, 0.02 * peri, True)
            rect = cv2.minAreaRect(c)
            min_rect_width = min(rect[1])  # smaller dimension
            max_rect_height = max(rect[1])  # larger dimension

            # Compute pixels per metric
            if pixelsPerMetric is None:
                pixelsPerMetric = min_rect_width / width_of_leftmost_object

            top_left = (int(rect[0][0] - rect[1][0] / 2), int(rect[0][1] - rect[1][1] / 2))
            bottom_right = (int(rect[0][0] + rect[1][0] / 2), int(rect[0][1] + rect[1][1] / 2))

            # Draw the rectangle
            cv2.rectangle(image, top_left, bottom_right, (0, 255, 0), 2)
            # Measure dimensions in mm
            width_mm = min_rect_width / pixelsPerMetric * 25.4
            length_mm = max_rect_height / pixelsPerMetric * 25.4

            break  

        with open(temp_path, "rb") as image_file:
            roboflow_response = requests.post(
                "https://detect.roboflow.com/feetproj/1?api_key=yFIRwtU82s8LdOd9z3dt",
                files={"file": image_file},
            )

        roboflow_data = roboflow_response.json()
        print("up til here", roboflow_data)
        if "predictions" in roboflow_data and len(roboflow_data["predictions"]) > 0:
            data = roboflow_data["predictions"][0]
            x, y, w, h = x, y, w, h = data["x"], data["y"], data["width"], data["height"]

            if "predictions" in roboflow_data and len(roboflow_data["predictions"]) > 0:
                data = roboflow_data["predictions"][0]
                x, y= data["x"], data["y"]

                w = min(data["width"],data["height"])
                h = max(data["width"],data["height"])

                # Calculate bounding box corners and convert to integers
                top_left = (int(x - w / 2), int(y - h / 2))
                top_right = (int(x + w / 2), int(y - h / 2))
                bottom_left = (int(x - w / 2), int(y + h / 2))
                bottom_right = (int(x + w / 2), int(y + h / 2))

                print("Top Left:", top_left)
                print("Top Right:", top_right)
                print("Bottom Left:", bottom_left)
                print("Bottom Right:", bottom_right)

                # Draw bounding box lines
                cv2.line(image, top_left, top_right, (0, 0, 255), 2)  # Top edge
                cv2.line(image, top_right, bottom_right, (0, 0, 255), 2)  # Right edge
                cv2.line(image, bottom_right, bottom_left, (0, 0, 255), 2)  # Bottom edge
                cv2.line(image, bottom_left, top_left, (0, 0, 255), 2)  # Left edge

            # 3. 실제 크기 계산

            print(pixelsPerMetric)
            actual_width = w / pixelsPerMetric  * 25.4
            actual_height = h / pixelsPerMetric  * 25.4
            
            print(f"Actual Width: {actual_width:.2f} mm")
            print(f"Actual Height: {actual_height:.2f} mm")
        else:
            return jsonify({"error": "Roboflow measurement failed"}), 400

        print("up til here")

        width_ratio = (actual_width / actual_height) * 100

        class_value = ""
        if actual_height <= 240:
            if width_ratio <= 35:
                class_value = "narrow"
            elif 35 < width_ratio <= 38:
                class_value = "medium"
            elif 38 < width_ratio:
                class_value = "wide"
        elif 250 <= actual_height <= 260:
            if width_ratio <= 34:
                class_value = "narrow"
            elif 34 < width_ratio <= 37:
                class_value = "medium"
            elif 37 < width_ratio:
                class_value = "wide"
        elif 270 <= actual_height:
            if width_ratio <= 33:
                class_value = "narrow"
            elif 33 < width_ratio <= 36:
                class_value = "medium"
            else:
                class_value = "wide"

        # Save to database (assuming fileName identifies left/right foot)
        db_path = os.path.join(app.config['BASE_PATH'], 'user_data.db')
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        if fileName.split('_')[1] == 'left.jpg':
            cursor.execute(
                'UPDATE users SET class = (?), leftFootSize = (?), leftWidth = (?)  WHERE userName = (?)',
                (class_value, actual_height, actual_width, user)
            )
        else:
            cursor.execute(
                'UPDATE users SET rightFootSize = (?), rightWidth = (?) WHERE userName = (?)',
                (actual_height, actual_width, user)
            )

        connection.commit()
        connection.close()

        _, buffer = cv2.imencode('.jpg', image)  # Encode image to JPG format
        image_bytes = buffer.tobytes()  # Convert the image buffer to bytes
        encoded_image = base64.b64encode(image_bytes).decode('utf-8') 
        
        return jsonify({
            "width": actual_width,
            "length": actual_height,
            "image": encoded_image
        })

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "Internal server error"}), 500



@app.route('/uploads/<filename>')
def uploaded_file(filename):
    print("Request for file:", filename)  # Log file request
    print(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return send_from_directory(os.path.join(app.config['UPLOAD_FOLDER'], filename))

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
        print(user_id)
        return jsonify({"userId": user_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# @app.route('/api/pressure', methods=['POST'])
# async def start_measurement():
#     try:
#         # data = request.json
#         data = request.get_json()
#         user_id = data.get("userId")

#         if not user_id:
#             return jsonify({"success": False, "error": "User ID not provided"}), 400
        
#         # 비동기로 측정 시작
#         avg_array, image_path = await async_measure_pressure(user_id, 10)
#         return jsonify({"success": True, "image_path": image_path})
#     except Exception as e:
#         print(e)
#         return jsonify({"success": False, "error": str(e)})

# @app.route('/pressureImage', methods=['GET'])
# def get_pressure_image():
#     """
#     Returns the pressure image for a given userId.
#     """
#     # userId를 쿼리 파라미터에서 가져옴
#     user_id = request.args.get('userId')
#     if not user_id:
#         return jsonify({"error": "userId is required"}), 400

#     # 파일 경로 설정
#     file_name = f"pressure_{user_id}.png"
#     file_path = os.path.join(app.config['BASE_PATH'], "pressure", file_name)
#     print("file_path: ", file_path)

#     # 파일 존재 여부 확인
#     if not os.path.exists(file_path):
#         return jsonify({"error": f"File not found for userId {user_id}"}), 404

#     # Convert image to Base64
#     with open(file_path, "rb") as image_file:
#         encoded_image = base64.b64encode(image_file.read()).decode('utf-8')

#     # 파일 전송
#     # return send_from_directory(os.path.join(app.config['BASE_PATH'], "pressure", file_name))
#     return jsonify({"image": encoded_image})

if __name__ == '__main__':  
    app.run(debug=True, host=LOCAL_IP_ADDRESS, port=5000)