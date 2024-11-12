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
} from "react-native";
import {
  Camera,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons"; // 아이콘을 위해 추가

const WINDOW_HEIGHT = Dimensions.get("window").height;
const WINDOW_WIDTH = Dimensions.get("window").width;

export default function captureFootSize() {
  const [imageURI, setImageURI] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const takeImage = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current?.takePictureAsync();
      setImageURI(photo.uri);
      await sendImageToServer(photo);
    }
  };

  const sendImageToServer = async (photo) => {
    // photo: {height, uri, width}
    const formData = new FormData();
    const host = "https://sonah5009.pythonanywhere.com";
    // const host = "http://192.168.0.16:5000";

    const imageFile = {
      uri: photo.uri,
      type: "image/jpeg",
      name: photo.uri.split("/").pop(),
    };
    formData.append("file", imageFile);

    try {
      const response = await fetch(`${host}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        setImageURI(`${host}/uploads/${responseData.filename}`);
        Alert.alert("Image Processed", "Your foot size has been calculated.");
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload failed", error);
      Alert.alert("Upload failed", "Unable to upload image.");
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
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => setImageURI(null)}
          >
            <Text style={styles.retakeText}>Retake</Text>
          </TouchableOpacity>
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
    position: "absolute",
    bottom: 50,
    backgroundColor: "#404040",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retakeText: {
    color: "white",
    fontSize: 16,
  },
});
