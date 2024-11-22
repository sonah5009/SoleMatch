//TODO 파일 저장 위치 변경 필요 (현재는 그냥 로컬 백엔드 폴더 내)
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
} from "react-native";
import {
  Camera,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons"; // 아이콘을 위해 추가
import axios from "axios";

const WINDOW_HEIGHT = Dimensions.get("window").height;
const WINDOW_WIDTH = Dimensions.get("window").width;

export default function captureFootSize() {
  const [imageURI, setImageURI] = useState(null);
  const [isLeftSaved, setIsLeftSaved] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const takeImage = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current?.takePictureAsync();
      setImageURI(photo.uri);
      console.log("HI");
    }
  };

  const sendImageToServer = async (photo) => {
    console.log(typeof photo);
    console.log(photo);

    // Remove the prefix (e.g., "data:image/png;base64,")
    const base64String = photo.replace(/^data:image\/\w+;base64,/, "");
    // Convert the base64 string to a binary data buffer
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" }); // You can adjust the MIME type if needed

    const formData = new FormData();
    formData.append("file", blob); // The third parameter specifies the filename
    formData.append("fileName", "work.png"); // The third parameter specifies the filename

    try {
      const res = await fetch("http://127.0.0.1:5000/analyze_size", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      console.log(res.data);
    } catch (error) {
      console.error("Error uploading image:", error);
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

  return (
    <View style={styles.container}>
      {!imageURI ? (
        <CameraView ref={cameraRef} style={styles.camera} ratio="16:9">
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takeImage}>
              <MaterialIcons name="camera" size={50} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageURI }} style={styles.preview} />
          <View style={styles.buttonContainer}>
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "#404040",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    margin: 3,
  },
  retakeText: {
    color: "white",
    fontSize: 16,
  },
  confirmText: {
    color: "white",
    fontSize: 16,
  },
});
