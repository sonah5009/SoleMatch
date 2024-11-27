from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory, send_file, jsonify, make_response
from werkzeug.utils import secure_filename
from flask_cors import CORS
import json
import os
import sqlite3
from measure import measure_pressure, save_measurement_image
from scipy.spatial import distance as dist
# from imutils import perspective
from imutils import contours
import numpy as np
# import argparse
import imutils
import cv2
import base64
import ast

load_dotenv()
LOCAL_IP_ADDRESS = os.environ.get('LOCAL_IP_ADDRESS')
BACKEND_LOCAL_URL = os.environ.get('BACKEND_LOCAL_URL')
BACKEND_PATH = os.environ.get('BACKEND_PATH')
print("LOCAL_IP_ADDRESS", LOCAL_IP_ADDRESS)
print("BACKEND_LOCAL_URL", BACKEND_LOCAL_URL)

app = Flask(__name__)
# CORS 설정
CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:8081",  # Expo 웹 미리보기
                "http://127.0.0.1:5000",  # 로컬 Flask 테스트
                "https://sonah5009.pythonanywhere.com",  # 실제 Flask 서버 URL
                "exp://172.30.122.251:8081",  # Expo Go
                "http://192.168.0.16:5000",
                "http://192.168.0.16:8081"
                "http://172.30.122.55:8081",
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

    try :
        file = request.files['file']
        if file==None:
            return   jsonify({"error": "No file"}), 400
        print("file: ", file)
        fileName = request.form.get('fileName')
        user = request.form.get('user')

        # temp_path = os.path.join('./uploads', fileName)
        temp_path = os.path.join(app.config['BASE_PATH'], "temp", fileName)
        print("temp_path: ", temp_path)
        file.save(temp_path)

        width_of_leftmost_object = 1.06  # Set your width in inches here

        # Load and process the image
        image = imread(temp_path)
        print("image: ", image)
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

        # Process contours (similar to your existing logic)
        for c in cnts:
            # if the contour is not sufficiently large, ignore it
            if cv2.contourArea(c) < 3000:
                continue

            # approximate the contour
            peri = cv2.arcLength(c, True)
            approx = cv2.approxPolyDP(c, 0.001 * peri, True)
            approx2 = cv2.approxPolyDP(c, 0.02 * peri, True)

            # draw the approximated polygon
            orig = image.copy()
            cv2.drawContours(orig, [approx], -1, (0, 255, 0), 2)
            rect = cv2.minAreaRect(c)

            min_rect_width = min(rect[1])  # smaller dimension

            box = cv2.boxPoints(rect)  # obtain 4 points of the bounding box
            box2 = np.int64(box)  # convert to integer values
            cv2.drawContours(orig, [box2], -1, (0, 255, 0), 2)

            (tl, tr, br, bl) = box
            (tltrX, tltrY) = midpoint(tl, tr)
            (blbrX, blbrY) = midpoint(bl, br)
            (tlblX, tlblY) = midpoint(tl, bl)
            (trbrX, trbrY) = midpoint(tr, br)

            # draw the midpoints on the image
            cv2.circle(orig, (int(tltrX), int(tltrY)), 5, (255, 0, 0), -1)
            cv2.circle(orig, (int(blbrX), int(blbrY)), 5, (255, 0, 0), -1)
            cv2.circle(orig, (int(tlblX), int(tlblY)), 5, (255, 0, 0), -1)
            cv2.circle(orig, (int(trbrX), int(trbrY)), 5, (255, 0, 0), -1)

            # draw lines between the midpoints
            cv2.line(orig, (int(tltrX), int(tltrY)), (int(blbrX), int(blbrY)), (255, 0, 255), 2)
            cv2.line(orig, (int(tlblX), int(tlblY)), (int(trbrX), int(trbrY)), (255, 0, 255), 2)

            # compute the Euclidean distance between the midpoints
            dA = dist.euclidean((tltrX, tltrY), (blbrX, blbrY))
            dB = dist.euclidean((tlblX, tlblY), (trbrX, trbrY))

            # if the pixels per metric has not been initialized, then compute it
            if pixelsPerMetric is None:
                pixelsPerMetric = dB / width_of_leftmost_object

            # compute the size of the object in millimeters instead of inches
            dimA = dA / pixelsPerMetric * 25.4  # Convert inches to millimeters
            dimB = dB / pixelsPerMetric * 25.4  # Convert inches to millimeters

            # draw the object sizes on the image in millimeters
            cv2.putText(orig, "{:.1f}mm".format(dimA), (int(tltrX - 15), int(tltrY - 10)), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)
            cv2.putText(orig, "{:.1f}mm".format(dimB), (int(trbrX + 10), int(trbrY)), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)

            # find the bounding box of the approximated contour (optional, if needed)
            x, y, w, h = cv2.boundingRect(approx2)
            cv2.rectangle(orig, (x, y), (x + w, y + h), (0, 255, 0), 2)

            max_rect_height = h  # larger dimension

            # compute midpoints manually based on the bounding box coordinates
            (tltrX, tltrY) = (x + w / 2, y)
            (blbrX, blbrY) = (x + w / 2, y + h)
            (tlblX, tlblY) = (x, y + h / 2)
            (trbrX, trbrY) = (x + w, y + h / 2)

            # draw the midpoints on the image
            cv2.circle(orig, (int(tltrX), int(tltrY)), 5, (255, 0, 0), -1)
            cv2.circle(orig, (int(blbrX), int(blbrY)), 5, (255, 0, 0), -1)
            cv2.circle(orig, (int(tlblX), int(tlblY)), 5, (255, 0, 0), -1)
            cv2.circle(orig, (int(trbrX), int(trbrY)), 5, (255, 0, 0), -1)

            # draw lines between the midpoints
            cv2.line(orig, (int(tltrX), int(tltrY)), (int(blbrX), int(blbrY)), (255, 0, 255), 2)
            cv2.line(orig, (int(tlblX), int(tlblY)), (int(trbrX), int(trbrY)), (255, 0, 255), 2)

            # compute the Euclidean distance between the midpoints
            dA = dist.euclidean((tltrX, tltrY), (blbrX, blbrY))
            dB = dist.euclidean((tlblX, tlblY), (trbrX, trbrY))

            # if the pixels per metric has not been initialized, then compute it
            if pixelsPerMetric is None:
                pixelsPerMetric = dB / width_of_leftmost_object

            # compute the size of the object in millimeters instead of inches
            dimA = dA / pixelsPerMetric * 25.4  # Convert inches to millimeters
            dimB = dB / pixelsPerMetric * 25.4  # Convert inches to millimeters

            # draw the object sizes on the image in millimeters
            cv2.putText(orig, "{:.1f}mm".format(dimA), (int(tltrX - 15), int(tltrY - 10)), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)
            cv2.putText(orig, "{:.1f}mm".format(dimB), (int(trbrX + 10), int(trbrY)), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)


            # output_path = f"./analyzed/{fileName}"
            output_path = os.path.join(app.config['BASE_PATH'], "analyzed", fileName)
            imwrite(output_path, orig)

        width_mm = min_rect_width / pixelsPerMetric * 25.4
        length_mm = max_rect_height / pixelsPerMetric * 25.4

        # Convert image to Base64
        with open(output_path, "rb") as image_file:
            encoded_image = base64.b64encode(image_file.read()).decode('utf-8')


        # Return JSON with embedded Base64 image
        response_data = {
            "width": width_mm,
            "length": length_mm,
            "image": encoded_image  # Base64 encoded string
        }
        db_path = os.path.join(app.config['BASE_PATH'], 'user_data.db')
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()
        
        width_ratio = (width_mm / length_mm) * 100

        # Classify based on length and width ratio

        class_value = ""
        if length_mm <= 240:
            if width_ratio <= 35:
                class_value = "narrow"
            elif 35 < width_ratio <= 38:
                class_value = "medium"
            elif 38 < width_ratio:
                class_value = "wide"
        elif 250 <= length_mm <= 260:
            if width_ratio <= 34:
                class_value = "narrow"
            elif 34 < width_ratio <= 37:
                class_value = "medium"
            elif 37 < width_ratio:
                class_value = "wide"
        elif 270 <= length_mm:
            if width_ratio <= 33:
                class_value = "narrow"
            elif 33 < width_ratio <= 36:
                class_value = "medium"
            else:
                class_value = "wide"
        if fileName.split('_')[1]=='left.jpg':
            print("HIHI")
            cursor.execute('UPDATE users SET class = (?), leftFootSize = (?), leftWidth = (?),  WHERE userName = (?)', (class_value, length_mm, width_mm, user))

        else:
            cursor.execute('UPDATE users SET rightFootSize = (?), rightWidth = (?) WHERE userName = (?)', (length_mm, width_mm, user))
            
        connection.commit()
        connection.close()
        
        return jsonify(response_data)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    


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
    app.run(debug=True, host=LOCAL_IP_ADDRESS, port=5000)
    # app.run(debug=True, host='0.0.0.1', port=5000)
    # app.run(debug=not IS_PRODUCTION, host='0.0.0.0', port=5000)