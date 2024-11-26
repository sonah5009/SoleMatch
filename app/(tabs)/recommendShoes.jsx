//import './reset.css';
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
  Platform
} from "react-native";
import {
  Camera,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import {Picker} from '@react-native-picker/picker';
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons"; 
import axios from 'axios';
import PagerView from 'react-native-pager-view';
const WINDOW_HEIGHT = Dimensions.get("window").height;
const WINDOW_WIDTH = Dimensions.get("window").width;

export default function recommendShoes() {
    const [users, setUsers] = useState([]); // users state updated
  const [selectedUser, setSelectedUser] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users...");
        const response = await axios.get('http://192.168.0.105:5000/users');
        setUsers(response.data); // Updated to use response data directly
        setSelectedUser(response.data[0]?.userName || null); // Set the first user or null
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
        <View style={styles.pickerset}>
            <Text style={styles.label}>사용자 선택</Text>
            <Picker
            selectedValue={selectedUser}
            onValueChange={(itemValue) => setSelectedUser(itemValue)}
            style={styles.picker}
            >
            {users.map((user, index) => (
                <Picker.Item key={index} label={user.userName} value={user.userName} />
            ))}
            </Picker>
        </View>
        <PagerView style={styles.container} initialPage={0}>
        <View style={styles.page} key="1">
          <Text>First page</Text>
          <Text>Swipe ➡️</Text>
        </View>
        <View style={styles.page} key="2">
          <Text>Second page</Text>
        </View>
        <View style={styles.page} key="3">
          <Text>Third page</Text>
        </View>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    page: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    pickerset: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 15,
        paddingHorizontal: 8,
        paddingVertical: 5,
        backgroundColor: '#f7f9fc',
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#d1d9e6",
        marginHorizontal: 30,
        marginVertical: 10
      },
      picker: {
        flex: 1,
        height: 35,
        marginLeft: 8,
        fontSize: 16,
        color: "#333",
      },
});