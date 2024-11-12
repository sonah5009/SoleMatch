import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const BACKEND_LOCAL_URL = "http://127.0.0.1:5000";
// const BACKEND_LOCAL_URL = "http://192.168.0.16:5000";

export default function userInput() {
  const [userName, setUserName] = useState("");
  const navigation = useNavigation();

  const [userId, setUserId] = useState(null);

  const handleRegister = async () => {
    try {
      const response = await fetch(`${BACKEND_LOCAL_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: userName }),
      });

      if (response.ok) {
        const data = await response.json(); // Read the body stream once
        const { userId } = data; // Destructure userId from data
        setUserId(userId);
        console.log(userId);

        // Save to AsyncStorage
        await AsyncStorage.setItem("userName", userName);
        await AsyncStorage.setItem("userId", String(userId));

        console.log(await AsyncStorage.getItem("userId"), "userInput");

        Alert.alert("Success", `User registered with ID: ${userId}`);
      } else {
        Alert.alert("Error", "Failed to register user.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred during registration.");
    }
  };

  const goToMeasurePressure = () => {
    navigation.navigate("measurePressure");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter your name:</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
        placeholder="Name"
        value={userName}
        onChangeText={setUserName}
      />
      <Button title="Register" onPress={handleRegister} />
      {userId && (
        <Button title="Go to Measure Pressure" onPress={goToMeasurePressure} />
      )}
    </View>
  );
}
