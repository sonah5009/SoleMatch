# SoleMatch

**Soul Mate, Sole Match**  
발의 특성과 스타일을 매칭하여 편안하고 이상적인 신발을 추천해주는 웹앱

---

## 🌍 Environment Variables

The application uses a `.env` file for managing environment-specific configurations. Below are the variables you need to define:

```bash
# Backend Path and URLs
BACKEND_PATH=<absolute_path_to_backend_directory>
LOCAL_IP_ADDRESS=<your_local_ip_address>
BACKEND_LOCAL_URL=http://<your_local_ip_address>:5000

# Expo Public URLs
EXPO_PUBLIC_BACKEND_LOCAL_URL=http://<your_local_ip_address>:5000
EXPO_PUBLIC_BACKEND_URL=https://<your_pythonanywhere_id>.pythonanywhere.com

# Production Backend URL
BACKEND_URL=https://<your_pythonanywhere_id>.pythonanywhere.com

# Flask Environment
FLASK_ENV=development
```

### Example `.env` file

```bash
BACKEND_PATH=/Users/choesuna/sonah-git/SoleMatch/backend/
LOCAL_IP_ADDRESS=0.0.0.0
BACKEND_LOCAL_URL=http://0.0.0.0:5000
EXPO_PUBLIC_BACKEND_LOCAL_URL=http://0.0.0.0:5000

EXPO_PUBLIC_BACKEND_URL=https://meowmeow1234.pythonanywhere.com
BACKEND_URL=https://meowmeow1234.pythonanywhere.com
FLASK_ENV=development
```

> **Note**: Replace `<absolute_path_to_backend_directory>`, `<your_local_ip_address>` and `/<your_pythonanywhere_id>` with your actual file path, IP address and pythonanywhere ID.

---

## 🚀 How to Run the App

1. Clone the repository (only first):

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies (only first):

   ```bash
   npm install
   ```

3. Start the Expo server:

   ```bash
   npx expo start -c
   ```

4. Open the app in the Expo Go app (available on iOS and Android) or in an emulator.

---

## 📚 Backend Setup

The backend is implemented in Python and uses Flask. To set up and run the backend:

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Install required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:

   Ensure your `.env` file contains the required backend paths and URLs.

4. Run the server:

   ```bash
   python app.py
   ```

   or

   ```bash
   flask run
   ```

   The server will run on `http://127.0.0.1:5000` by default.

**Etc**:  
If you encounter `async` error, run following the command in the terminal:

```bash
pip install "flask[async]"
```

---

## 🚀 How to Build and Run the App

1. build

```bash
npx expo export
```

2. start

```bash
 npx serve dist
```

---

## 📂 Project Main Structure

```markdown
.
├── app
│ ├── (tabs)
│ │ ├── \_layout.jsx: Layout for the tab pages
│ │ ├── captureFootSize.jsx: Capture foot size functionality
│ │ ├── index.jsx: Landing page
│ │ ├── measurePressure.jsx: Measure plantar pressure
│ │ ├── shoes.jsx: Shoe recommendations
│ │ └── userInput.jsx: User input page
│ ├── +not-found.tsx: 404 not found page
│ └── \_layout.jsx: Main layout for the app
├── app.json: Expo configuration file
├── assets: App assets (images, fonts, etc.)
├── backend
│ ├── app.py: Main backend server logic
│ ├── db_setup.py: Database setup script
│ ├── measure.py: Pressure measurement logic
│ ├── user_data.db: SQLite database for user data
│ └── pressure: Pressure analysis data and images
├── constants
│ └── Colors.ts: App-wide color constants
```

---

## 🛠️ Features

- **Foot Measurement:** Measure foot size and plantar pressure using arduino pressure sensor & camera inputs.
- **Shoe Recommendation:** Get personalized shoe recommendations based on foot pressure and size.
- **User-Friendly Interface:** Intuitive UI with React Native and Expo.
- **Backend Support:** A Python-based backend server for data analysis and storage. (pythonanywhere)

---

## 🎨 Color Scheme

The app uses a consistent and clean color scheme defined in `constants/Colors.ts`.
Here are the primary colors used:

- **Green**
  - `green100`: `#013D2A` (Primary green)
  - `green200`: `#01624D`
- **Gray**
  - `gray100`: `#FAFAFA` (Background)
  - `gray200`: `#F5F5F5`
  - `gray300`: `#9E9E9E`
  - `gray400`: `#666`
  - `gray500`: `#424242`

---

## 🧩 Technologies Used

### Frontend

- **React Native**
- **Expo**
- **JavaScript**

### Backend

- **Python**
- **Flask**
- **SQLite**
- **OpenCV**

---

## 🤝 Contributors

- **Team Lead**: Sun-a Choe (최선아) - App Design & Development, Sole Pressure Distribution Visualization
- **Software Developer**: Chaeri Kim (김채리) - App Features & CV Based Relative Foot Size Measurement Development
- **Hardware Analyst**: Ju-won Kwon (권주원), Jun-hong Bae (배준홍) - Sole Pressure Sensor <-> Arduino Connection

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

```
To be updated later
```
