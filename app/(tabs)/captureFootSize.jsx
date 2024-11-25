import "./reset.css";
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
  Picker,
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
  const [imageSrc, setImageSrc] = useState(null);
  const [leftfeet, setLeftfeet] = useState(false);
  const [rightfeet, setRightfeet] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [users, setUsers] = useState([]); // users state updated
  const [selectedUser, setSelectedUser] = useState(null);
  const [leftResult, setLeftResult] = useState(null);
  const [rightResult, setRightResult] = useState(null);
  const [leftWidth, setLeftWidth] = useState(null);
  const [leftLength, setLeftLength] = useState(null);
  const [rightWidth, setRightWidth] = useState(null);
  const [rightLength, setRightLength] = useState(null);
  const [divWidth, setDivWidth] = useState(0);
  const [divLength, setDivLength] = useState(0);

  const cameraRef = useRef(null);

  const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
  // const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_LOCAL_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users...");
        const response = await axios.get(`${BASE_URL}/users`);
        setUsers(response.data); // Updated to use response data directly
        setSelectedUser(response.data[0]?.userName || null); // Set the first user or null
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);
  const takeImage = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current?.takePictureAsync();
      setImageURI(photo.uri);
      console.log("HI");
    }
  };
  const sendImageToServer = async (photo) => {
    let filename;
    if (!leftfeet) {
      setLeftfeet(true);
      setRightfeet(false);
      filename = selectedUser + "_left.jpg";
    } else {
      setRightfeet(true);
      filename = selectedUser + "_right.jpg";
    }

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
    formData.append("fileName", filename); // The third parameter specifies the filename
    formData.append("user", selectedUser); // The third parameter specifies the filename

    setImageURI(null);
    if (rightfeet) {
      setLeftfeet(false);
      setRightfeet(false);
    }

    try {
      console.log("hii");
      const res = await axios.post(`${BASE_URL}/analyze_size`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("hii");

      if (res.data && res.data.image) {
        console.log("HIIIIII");
        // If it's a base64 image string
        if (!leftResult) {
          setLeftResult(`data:image/png;base64,${res.data.image}`);
          setLeftWidth(res.data.width);
          setLeftLength(res.data.length);
        } else {
          setRightResult(`data:image/png;base64,${res.data.image}`);
          setRightWidth(res.data.width);
          setRightLength(res.data.length);
        }
        console.log("HIIIIII");
      }
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
      {leftResult && rightResult && (
        <View style={styles.imageContainer}>
          {/* Images Container */}
          <View style={styles.middleContainerFirst}>
            <Image
              source={{ uri: leftResult }}
              style={{
                width: "40%",
                resizeMode: "contain",
              }}
            />
            <Image
              source={{ uri: rightResult }}
              style={{
                width: "40%",
                resizeMode: "contain",
              }}
            />
          </View>

          {/* Text Container with Foot Info */}
          <View style={styles.middleContainerSecond}>
            <View style={styles.imageText}>
              <Text style={styles.imageTextTitle}>Left Foot</Text>
              <Text>Width: {leftWidth} mm</Text>
              <Text>Length: {leftLength} mm</Text>
            </View>
            <View style={styles.imageText}>
              <Text style={styles.imageTextTitle}>Right Foot</Text>
              <Text>Width: {rightWidth} mm</Text>
              <Text>Length: {rightLength} mm</Text>
            </View>
          </View>
        </View>
      )}

      {!rightResult && (
        <View style={styles.camContainer}>
          <View style={styles.pickerset}>
            <Text style={styles.label}>사용자 선택</Text>
            <Picker
              selectedValue={selectedUser}
              onValueChange={(itemValue) => setSelectedUser(itemValue)}
              style={styles.picker}
            >
              {users.map((user, index) => (
                <Picker.Item
                  key={index}
                  label={user.userName}
                  value={user.userName}
                />
              ))}
            </Picker>
          </View>
          {!imageURI ? (
            <div className="page-reset">
              <View>
                <div className="page-reset-detail">
                  <Text style={styles.instructions}>
                    {leftfeet
                      ? "오른쪽 발을 찍어주세요."
                      : "왼쪽 발을 찍어주세요."}
                  </Text>
                </div>
              </View>
              <View onLayout={handleDivLayout}>
                <CameraView
                  ref={cameraRef}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  ratio="16:9"
                >
                  <div className="camera-button">
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.captureButton}
                        onPress={takeImage}
                      >
                        <MaterialIcons name="camera" size={50} color="white" />
                      </TouchableOpacity>
                    </View>
                  </div>
                </CameraView>
              </View>
            </div>
          ) : (
            <View style={styles.previewContainer}>
              <div className="taken-image">
                <Image
                  source={{ uri: imageURI }}
                  style={{
                    width: divWidth,
                    height: divLength,
                  }}
                ></Image>
              </div>
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
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pickerset: {
    flexDirection: "row",
    alignItems: "center",
    width: "30%",
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
  },
  picker: {
    flex: 1,
    height: 35,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#2c3e50",
    marginRight: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginHorizontal: 0,
    position: "absolute",
    bottom: "2.5%",
    textAlign: "center",
    alignSelf: "center", // Center horizontally
  },
  buttonContainer2: {
    flexDirection: "row",
    marginHorizontal: 0,
    position: "absolute",
    textAlign: "center",
    bottom: "15%",
  },
  captureButton: {
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  camContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
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
    paddingVertical: "10%",
  },
  middleContainerFirst: {
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
    height: "20%",
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
    width: "40%",
  },
  imageTextTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  instructions: {
    position: "absolute",
    justifyContent: "center",
    alignSelf: "center",
    textAlign: "center",
    color: "green",
    fontSize: 30,
  },
  camera: {
    flex: 1,
    height: "100%",
  },
  previewContainer: {
    flex: 1,
    alignItems: "center",
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
});
