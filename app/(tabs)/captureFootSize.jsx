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
  Platform
} from "react-native";
import {
  Camera,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons"; // 아이콘을 위해 추가
import axios from 'axios';

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
  const cameraRef = useRef(null);
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users...");
        const response = await axios.get('http://127.0.0.1:5000/users');
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
      console.log("HI")
    }
  };

  const sendImageToServer = async (photo) => {
    console.log(typeof photo);
    console.log(photo);
    let filename;
    if(!leftfeet) {
      setLeftfeet(true);
      filename=selectedUser+"_left.jpg";
    } else {
      setRightfeet(true);
      filename=selectedUser+"_right.jpg";
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
    
    try {
      const res = await axios.post("http://127.0.0.1:5000/analyze_size", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data && res.data.image) {
        // If it's a base64 image string
        if(!leftResult) {
          setLeftResult(`data:image/png;base64,${res.data.image}`);
          setLeftWidth(res.data.width);
          setLeftLength(res.data.length);
        } else {
          setRightResult(`data:image/png;base64,${res.data.image}`);
          setRightWidth(res.data.width);
          setRightLength(res.data.length);

        }
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
      {leftResult && rightResult && (<View style={styles.imageContainer}>
      
        <Image source={{ uri: leftResult }} style={styles.camera2} />
        
        <Image
          source={{ uri: rightResult }}
          style={styles.camera2} // Adjust dimensions as needed
          
        />
        <View style={styles.imageText}>
          <Text>Left Foot</Text>
          <Text>Width: {leftWidth} mm</Text>
          <Text>Length: {leftLength} mm</Text>
        </View>
        <View style={styles.imageTextRight}>
          <Text>Right Foot</Text>
          <Text>Width: {rightWidth} mm</Text>
          <Text>Length: {rightLength} mm</Text>
        </View>
      
      </View>)}

      {!rightResult && (<View>
      <Text style={styles.label}>Select User:</Text>
      <Picker
        selectedValue={selectedUser}
        onValueChange={(itemValue) => setSelectedUser(itemValue)}
        style={styles.picker}
      >
        {users.map((user, index) => (
          <Picker.Item key={index} label={user.userName} value={user.userName} />
        ))}
      </Picker>
      {!imageURI ? (
        <CameraView ref={cameraRef} style={styles.camera} ratio="16:9">
          <Text style={styles.instructions}>
              {leftfeet ? "오른쪽 발을 찍어주세요." : "왼쪽 발을 찍어주세요."}
            </Text>
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
      </View>)}
    </View>
  );
}

const styles = StyleSheet.create({
  imageText: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    color: 'white'
  },
  imageTextRight: {
    position: 'absolute',
    bottom: 50,
    right: 50,
    color: 'white'
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  instructions: {
    justifyContent: "center",
    alignSelf: "center",
    textAlign: "center",
    color: "green",
    fontSize: 30
  },
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    width: "100%",
    height: undefined,
  },
  camera2: {
    flex: 1,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    resizeMode: 'contain',
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
    margin: 3
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
