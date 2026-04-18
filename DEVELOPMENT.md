# SoleMatch 개발 가이드

실행 방법, 환경 설정, 기술 스택을 정리한 문서입니다.

---

## 기술 스택

### 프론트엔드

- React Native
- Expo
- JavaScript

### 백엔드

- Python
- Flask
- SQLite
- OpenCV

### 하드웨어

- 압력 센서 인솔, Arduino Mega 2560

---

## 환경 변수

앱은 환경별 설정을 `.env` 파일로 관리합니다.

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

### `.env` 예시

```bash
BACKEND_PATH=/Users/choesuna/sonah-git/SoleMatch/backend/
LOCAL_IP_ADDRESS=0.0.0.0
BACKEND_LOCAL_URL=http://0.0.0.0:5000
EXPO_PUBLIC_BACKEND_LOCAL_URL=http://0.0.0.0:5000

EXPO_PUBLIC_BACKEND_URL=https://meowmeow1234.pythonanywhere.com
BACKEND_URL=https://meowmeow1234.pythonanywhere.com
FLASK_ENV=development
```

`<absolute_path_to_backend_directory>`, `<your_local_ip_address>`, `<your_pythonanywhere_id>`는 실제 경로·IP·PythonAnywhere ID로 바꿉니다.

---

## 앱 실행 방법

1. 저장소 클론 (최초 1회)

   ```bash
   git clone <repository-url>
   ```

2. 의존성 설치 (최초 1회)

   ```bash
   npm install
   ```

3. Expo 서버 실행

   ```bash
   npx expo start -c
   ```

4. iOS·Android의 Expo Go 또는 에뮬레이터에서 앱을 연다.

---

## 백엔드 실행

1. `backend` 디렉터리로 이동

   ```bash
   cd backend
   ```

2. 의존성 설치

   ```bash
   pip install -r requirements.txt
   ```

3. `.env`에 백엔드 경로와 URL이 올바르게 설정되어 있는지 확인한다.

4. 서버 실행

   ```bash
   python app.py
   ```

   또는

   ```bash
   flask run
   ```

   기본 주소: `http://127.0.0.1:5000`

`async` 관련 오류가 나면:

```bash
pip install "flask[async]"
```

---

## 빌드 및 정적 실행

1. 빌드

   ```bash
   npx expo export
   ```

2. 서빙

   ```bash
   npx serve dist
   ```

---

## 프로젝트 구조 (요약)

```text
.
├── app
│   ├── (tabs)
│   │   ├── _layout.jsx
│   │   ├── captureFootSize.jsx
│   │   ├── index.jsx
│   │   ├── measurePressure.jsx
│   │   ├── shoes.jsx
│   │   └── userInput.jsx
│   ├── +not-found.tsx
│   └── _layout.jsx
├── app.json
├── assets
├── backend
│   ├── app.py
│   ├── db_setup.py
│   ├── measure.py
│   ├── user_data.db
│   └── pressure
└── constants
    └── Colors.ts
```

---

## 컬러 스키마

`constants/Colors.ts` 기준 주요 색상:

- **Green**: `green100` `#013D2A`, `green200` `#01624D`
- **Gray**: `gray100` `#FAFAFA`, `gray200` `#F5F5F5`, `gray300` `#9E9E9E`, `gray400` `#666`, `gray500` `#424242`

---

## 주요 기능 (개발 관점)

- Arduino 압력 센서와 카메라 입력으로 발 크기·족저 압력 측정
- 족저 압력·발 크기 기반 맞춤 신발 추천
- React Native·Expo 기반 UI
- 데이터 분석·저장용 Python Flask 백엔드 (배포 예: PythonAnywhere)
