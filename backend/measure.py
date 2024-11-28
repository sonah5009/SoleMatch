import asyncio
import numpy as np
import matplotlib.pyplot as plt
import matplotlib
import serial
import time
import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()
BASE_PATH = os.environ.get('BACKEND_PATH')

# 시리얼 포트 설정
arduino_port = "/dev/tty.usbserial-110"  # 환경에 따라 조정
baud_rate = 9600
ser = serial.Serial(arduino_port, baud_rate)

try:
    if 'ser' in globals() and ser.is_open:
        ser.close()
    ser = serial.Serial(arduino_port, baud_rate)
    ser.reset_input_buffer()  # 초기화
except serial.SerialException as e:
    print(f"Serial initialization error: {e}")
    ser = None

# 배열 크기 설정
array_shape = (6, 4)
x = np.arange(array_shape[1])
y = np.arange(array_shape[0])
X, Y = np.meshgrid(x, y)

def read_from_serial():
    """Serial 데이터를 읽어 배열로 변환합니다."""
    if not ser or not ser.is_open:
        print("Serial port is not available.")
        return None

    try:
        data = []
        for _ in range(array_shape[0]):
            line = ser.readline().decode('utf-8').strip()
            data.extend(map(int, line.split('\t')))
        if len(data) == array_shape[0] * array_shape[1]:
            print(np.array(data).reshape(array_shape), '\n')
            return np.array(data).reshape(array_shape)
        else:
            print(f"Unexpected data length: {len(data)}")
            return None
    except (UnicodeDecodeError, ValueError) as e:
        print(f"Error reading serial data: {e}")
        return None

async def async_measure_pressure(user_id, duration):
    """비동기로 압력을 측정하고 결과를 저장합니다."""
    if not ser or not ser.is_open:
        print("Serial port is not available for measurement.")
        return None, None

    print(f"Measuring pressure for {duration} seconds...")
    start_time = time.time()
    measurements = []

    while time.time() - start_time < duration:
        array = read_from_serial()
        if array is not None:
            measurements.append(array)
        await asyncio.sleep(0.1)

    if not measurements:
        print("No valid measurements collected.")
        return None, None

    avg_array = np.mean(measurements, axis=0)
    avg_array[0, 2:4] = np.nan
    avg_array[1, 2:4] = np.nan
    avg_array[2, 3] = np.nan
    avg_array[3, 3] = np.nan

    image_path = save_measurement_image(user_id, avg_array)
    return avg_array, image_path

def save_measurement_image(user_id, avg_array):
    """측정된 데이터를 시각화하여 이미지로 저장합니다."""
    matplotlib.use('Agg')
    fig, ax = plt.subplots(figsize=(6, 10))
    contour = ax.contourf(X, Y, avg_array, cmap='coolwarm', levels=20)
    ax.contour(X, Y, avg_array, colors='black', levels=10)
    cbar = plt.colorbar(contour, ax=ax)
    cbar.set_label('Sensor Values')

    ax.set_title(f'Average Sensor Data for User {user_id}')
    ax.set_xlabel('X')
    ax.set_ylabel('Y')

    image_dir = os.path.join(BASE_PATH, "pressure")
    os.makedirs(image_dir, exist_ok=True)
    image_path = os.path.join(image_dir, f'pressure_{user_id}.png')
    plt.savefig(image_path)
    plt.close()

    print(f"Image saved at {image_path}")
    return image_path
