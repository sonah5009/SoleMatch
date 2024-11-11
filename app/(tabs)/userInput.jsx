import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const BACKEND_LOCAL_URL = "http://127.0.0.1:5000";

export default function userInput() {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  const handleRegister = async () => {
    console.log(BACKEND_LOCAL_URL);
    try {
      const response = await fetch(`${BACKEND_LOCAL_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: userName }),
      });
      const { userId } = response.data;

      // Save to AsyncStorage
      await AsyncStorage.setItem("userName", userName);
      await AsyncStorage.setItem("userId", String(userId));

      setUserId(userId);
      Alert.alert("Success", `User registered with ID: ${userId}`);
    } catch (error) {
      Alert.alert("Error", "Failed to register user.");
    }
  };

  const goToMeasurePressure = () => {
    navigation.navigate("MeasurePressure");
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
