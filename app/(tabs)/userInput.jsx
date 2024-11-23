import { Link, router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Dimensions,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_LOCAL_URL = "http://127.0.0.1:5000";
const window = Dimensions.get("window");

export default function userInput() {
  const [userName, setUserName] = useState("");

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
        const data = await response.json();
        const { userId } = data;
        console.log("userId!: ", userId);

        // Save to AsyncStorage and wait for it to complete
        await Promise.all([
          AsyncStorage.setItem("userName", userName),
          AsyncStorage.setItem("userId", String(userId)),
          console.log("async!: ", userId),
          router.replace("/"),
        ]);

        Alert.alert("Success", `User registered with ID: ${userId}`, [
          {
            text: "OK",
            onPress: () => {
              // Only navigate after AsyncStorage operations are complete
              router.replace("/");
            },
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
    <View style={styles.container}>
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

      <Link href="/" onPress={handleRegister} style={styles.buttonContainer}>
        <Text style={styles.buttonTitle}>유저 등록 하러가기</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: window.width > 500 ? 15 : 10,
    marginHorizontal: window.width > 500 ? 350 : 20,
  },
  label: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.gray.gray300,
    padding: 10,
    marginVertical: 10,
    width: "100%", // 부모 요소 너비에 맞추기
    maxWidth: 300, // 최대 너비를 300으로 고정
  },
  buttonContainer: {
    width: "100%", // 부모 요소 너비에 맞추기
    maxWidth: 300, // TextInput과 동일한 최대 너비 설정
    padding: 8,
    backgroundColor: Colors.green.green100,
    color: Colors.gray.gray100,
    borderRadius: 3,
    // alignItems: "center", // 텍스트 가운데 정렬
    textAlign: "center",
  },
  buttonTitle: {
    color: "#fff",
    fontWeight: "bold",
  },
  image: {
    width: 120,
    height: 40,
    marginBottom: 20,
  },
});
