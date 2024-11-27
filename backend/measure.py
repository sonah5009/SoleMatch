from dotenv import load_dotenv
import time
import serial
import json
import os

# Define the base paths for different environments
load_dotenv()
BASE_PATH = os.environ.get('BACKEND_PATH')

def measure_pressure(duration=10):
    # Placeholder data array with mock pressure values
    mock_data = [i * 10 for i in range(18)]  # Mock data as example values
    data = mock_data  # Use mock_data instead of real serial data

    # Mock delay to simulate the actual measurement process
    time.sleep(duration)  # Simulate waiting time
    return data  # Return mock data


def save_measurement_image(user_id):
    # Define the path to save the image
    image_dir = os.path.join(BASE_PATH, "pressure")
    os.makedirs(image_dir, exist_ok=True)
    image_path = os.path.join(image_dir, f"pressure_{user_id}.png")

    # Create a placeholder image file for testing
    with open(image_path, "wb") as f:
        f.write(b"Image data placeholder")
    return image_path

# # Define the Arduino serial connection
# arduino_port = "/dev/tty.usbserial-110"  # Adjust based on your setup

# baud_rate = 9600
# ser = serial.Serial(arduino_port, baud_rate)

# def _measure_pressure(duration=10):
#     data = []
#     start_time = time.time()
    
#     while time.time() - start_time < duration:
#         if ser.in_waiting > 0:  # Check if there is data in the serial buffer
#             line = ser.readline().decode().strip()  # Read a line from the serial
#             if line.startswith("p_pressure["):
#                 try:
#                     # Parse the index and value
#                     index_value = line.split("] = ")
#                     index = int(index_value[0].split("[")[1])
#                     value = int(index_value[1])
#                     # Ensure our data list can hold up to 18 readings
#                     if len(data) < 18:
#                         data.extend([0] * (18 - len(data)))
#                     data[index - 1] = value  # Store the value at the correct position
#                 except (IndexError, ValueError):
#                     continue  # Handle any parsing errors gracefully
#         time.sleep(0.05)  # Small delay to avoid excessive CPU usage

#     return data


# def _save_measurement_image(user_id):
#     # Define the path to save the image
#     image_dir = os.path.join(BASE_PATH, "pressure")
#     os.makedirs(image_dir, exist_ok=True)
#     image_path = os.path.join(image_dir, f"pressure_{user_id}.png")

#     # Stub for image saving function. Replace with actual code to capture/save the image.
#     with open(image_path, "wb") as f:
#         f.write(b"Image data placeholder")
#     return image_path

