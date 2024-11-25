import { Colors } from "@/constants/Colors";
import { Link, router } from "expo-router";
import { Image } from "expo-image";
import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
import CentralLayout from "@/components/CentralLayout";
import NavigateButton from "@/components/NavigateButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
// const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_LOCAL_URL;
console.log(BASE_URL);
console.log("BASE_URL");

export default function userInput() {
  const [userName, setUserName] = useState("");

  const handleRegister = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: userName }),
      });

      if (response.ok) {
        const data = await response.json();
        const { userId } = data;
        console.log("userId!: ", userId);

        // Save to AsyncStorage and wait for it to complete
        await Promise.all([
          // localStorage.setItem("userName", userName),
          // localStorage.setItem("userId", String(userId)),
          AsyncStorage.setItem("userName", userName),
          AsyncStorage.setItem("userId", String(userId)),
          console.log("async!: ", userId),
          router.replace("/"),
        ]);

        Alert.alert("Success", `User registered with ID: ${userId}`, [
          {
            text: "OK",
            // onPress: () => {
            //   // Only navigate after AsyncStorage operations are complete
            //   router.replace("/");
            // },
          },
        ]);
      } else {
        Alert.alert("Error", "Failed to register user.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred during registration.");
    }
  };
  return (
    <CentralLayout>
      <Image
        style={styles.image}
        source={require("../../assets/images/sole-match-logo.png")}
        contentFit="contain"
        transition={500}
      />
      <Text style={styles.label}>이름을 입력해주세요</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Name"
        value={userName}
        onChangeText={setUserName}
      />

      <NavigateButton
        title="유저 등록 하러가기 ﹥"
        link="/"
        onPress={handleRegister}
      />
    </CentralLayout>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    borderRadius: 3,
    borderWidth: 1,
    padding: 10,
    width: "100%", // 부모 요소 너비에 맞추기
    maxWidth: 300, // 최대 너비를 300으로 고정

    borderColor: Colors.gray.gray300,
  },
  image: {
    width: 120,
    height: 40,
    marginBottom: 20,
  },
});
