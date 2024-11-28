import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Dimensions,
  Button,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons"; // 아이콘을 위해 추가
import NavigateButton from "../../components/NavigateButton";
import UserPicker from "../../components/UserPicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

const WINDOW_HEIGHT = Dimensions.get("window").height;
const WINDOW_WIDTH = Dimensions.get("window").width;

export default function captureFootSize() {
  const [imageURI, setImageURI] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [userName, setUserName] = useState(null); // 방금 등록한 유저
  const [users, setUsers] = useState([]); // users state updated
  const [selectedUser, setSelectedUser] = useState(null);

  const [leftfeet, setLeftfeet] = useState(false);
  const [rightfeet, setRightfeet] = useState(false);

  const [leftResult, setLeftResult] = useState(null);
  const [rightResult, setRightResult] = useState(null);
  const [leftWidth, setLeftWidth] = useState(null);
  const [leftLength, setLeftLength] = useState(null);
  const [rightWidth, setRightWidth] = useState(null);
  const [rightLength, setRightLength] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef(null);
  const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem("userName");
        setUserName(storedUserName);

        console.log("**captureFootSize page**");
        console.log("Fetching users...");
        const response = await fetch(`${BASE_URL}/users`);
        const data = await response.json();
        setUsers(data); // Updated to use response data directly
        setSelectedUser(storedUserName || null); // Set the current user or null
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, [userName]);
  const initialize = async () => {
    setLeftfeet(false);
    setRightfeet(false);
    setLeftResult(null);
    setLeftWidth(null);
    setLeftLength(null);
    setRightResult(null);
    setRightWidth(null);
    setRightLength(null);
    setImageURI(null);
  };
  const takeImage = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current?.takePictureAsync();
      setImageURI(photo.uri);
    }
  };

  const sendImageToServer = async (photo) => {
    setIsLoading(true);
    let filename;
    if (!leftfeet) {
      setLeftfeet(true);
      filename = selectedUser + "_left.jpg";
    } else {
      setRightfeet(true);
      filename = selectedUser + "_right.jpg";
    }
    const formData = new FormData();
    formData.append("file", {
      uri: photo,
      type: "image/jpeg",
      name: filename,
    }); // The third parameter specifies the filename
    formData.append("fileName", filename); // The third parameter specifies the filename
    formData.append("user", selectedUser); // The third parameter specifies the filename

    if (rightfeet) {
      setLeftfeet(false);
      setRightfeet(false);
    }
    if (!rightfeet) {
      setImageURI(null);
    }
    try {
      // POST 요청 실행
      const response = await fetch(`${BASE_URL}/analyze_size`, {
        method: "POST",
        headers: {
          // fetch에서는 FormData와 함께 Content-Type을 설정할 필요 없음
        },
        body: formData,
      });

      if (!response.ok) {
        console.log("업로드 되는 지 확인");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 응답 데이터를 JSON으로 변환
      const resData = await response.json();

      // 응답 데이터 처리
      if (resData && resData.image) {
        // Base64 이미지 처리
        if (!leftResult) {
          setLeftResult(`data:image/png;base64,${resData.image}`);
          setLeftWidth(resData.width);
          setLeftLength(resData.length);
        } else {
          setRightResult(`data:image/png;base64,${resData.image}`);
          setRightWidth(resData.width);
          setRightLength(resData.length);
        }
      } else {
        alert("다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Failed to analyze size:", error);
      alert("발을 분석할 수 가 없어요. 다시 찍어주세요.");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };
  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 로딩 표시 Modal */}
      <Modal transparent={true} visible={isLoading} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>처리 중...</Text>
          </View>
        </View>
      </Modal>
      {leftResult && rightResult ? (
        <View style={styles.imageContainer}>
          <View style={styles.middleContainerFirst}>
            <Image
              source={{ uri: leftResult }}
              style={{
                width: "50%",
                resizeMode: "contain",
              }}
            />
            <Image
              source={{ uri: rightResult }}
              style={{
                width: "50%",
                resizeMode: "contain",
              }}
            />
          </View>
          <View style={styles.middleContainerSecond}>
            <View style={styles.imageText}>
              <Text style={styles.imageTextTitle}>Left Foot</Text>
              <Text>Width</Text>
              <Text>{Math.round(leftWidth * 100) / 100} mm</Text>
              <Text>Length</Text>
              <Text>{Math.round(leftLength * 100) / 100} mm</Text>
            </View>
            <View style={styles.imageText}>
              <Text style={styles.imageTextTitle}>Right Foot</Text>
              <Text>Width</Text>
              <Text>{Math.round(rightWidth * 100) / 100} mm</Text>
              <Text>Length</Text>
              <Text>{Math.round(rightLength * 100) / 100} mm</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => initialize()}
          >
            <Text style={styles.confirmText}>Retry</Text>
          </TouchableOpacity>
          <NavigateButton
            title="신발 추천 보러가기 ﹥"
            link="/recommendShoes"
          />
        </View>
      ) : imageURI ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageURI }} style={styles.preview} />
          <View style={styles.buttonContainer2}>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={() => setImageURI(null)}
            >
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={() => sendImageToServer(imageURI)}
            >
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <CameraView ref={cameraRef} style={styles.camera} ratio="16:9">
          <UserPicker
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            userName={userName}
            defaultTitle={`${userName}의 발`}
            secondTitle="다른 사람의 발"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takeImage}>
              <MaterialIcons name="camera" size={50} color="white" />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.instructions}>
              {leftfeet ? "오른쪽 발을 찍어주세요." : "왼쪽 발을 찍어주세요."}
            </Text>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  confirmButton: {
    textAlign: "center",
    backgroundColor: "#404040",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    margin: "5%",
  },
  pickerset: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 15,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: "#f7f9fc",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#d1d9e6",
    marginHorizontal: 30,
    marginVertical: 10,
  },
  picker: {
    flex: 1,
    height: 35,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 40,
  },
  buttonContainer2: {
    flexDirection: "row",
    marginHorizontal: 0,
    position: "absolute",
    textAlign: "center",
    bottom: 3,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#404040",
    justifyContent: "center",
    alignItems: "center",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  preview: {
    width: WINDOW_WIDTH * 0.8,
    height: WINDOW_HEIGHT * 0.8,
    resizeMode: "contain",
  },
  retakeButton: {
    textAlign: "center",
    backgroundColor: "#404040",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    margin: 3,
  },
  retakeText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
  },
  confirmText: {
    color: "white",
    fontSize: 16,
  },
  instructions: {
    position: "absolute",
    justifyContent: "center",
    alignSelf: "center",
    textAlign: "center",
    color: "green",
    bottom: 14,
    fontSize: 20,
  },
  imageContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f8f8", // Light background for the whole container
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000", // Adds shadow effect
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // For Android shadow
    width: "100%",
    height: "100%",
    paddingVertical: "40%",
  },
  middleContainerFirst: {
    gap: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    margin: 0,
    width: "100%",
    height: "80%",
  },
  middleContainerSecond: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    height: "40%",
    gap: 1,
  },
  imageText: {
    backgroundColor: "#fff", // White background for the text container
    padding: 10,
    borderRadius: 8, // Rounded corners
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000", // Shadow for text container
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // For Android shadow
    width: "45%",
  },
  imageTextTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});
