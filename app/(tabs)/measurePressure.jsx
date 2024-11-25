import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { Platform, StyleSheet, Dimensions, Alert } from "react-native";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PressureGuide from "@/components/PressureGuide";

const window = Dimensions.get("window");
const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
// const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_LOCAL_URL;

const getUserId = async () => {
  if (Platform.OS === "web") {
    return localStorage.getItem("userId");
  } else {
    return await AsyncStorage.getItem("userId");
  }
};

export default function measurePressure() {
  const [type, setType] = useState("start"); // start, ing, end, error

  const startMeasurement = async () => {
    setType("ing");
    try {
      const userId = await getUserId();
      console.log("User ID:", userId);

      const response = await fetch(`${BASE_URL}/api/pressure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setType("end");
      } else {
        throw new Error("Measurement failed");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not connect to the backend.");
      setType("error");
    }
  };

  return (
    <View style={styles.container}>
      <PressureGuide
        type={type}
        bottomText={
          type === "start"
            ? "빨간색선에 맞춰 편하게 서주세요"
            : type === "ing"
            ? "압력 측정중..."
            : type === "end"
            ? "발 압력 분포 분석 완료 👍"
            : "😢 압력 측정에 실패했어요. 껐다가 다시 켜주세요."
        }
        buttonTitle={
          type === "start"
            ? "압력측정 시작하기"
            : type === "end"
            ? "발 사이즈 재러가기 ﹥"
            : null
        }
        buttonHandler={type === "start" ? startMeasurement : null}
        buttonLink={type === "end" ? "/captureFootSize" : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
