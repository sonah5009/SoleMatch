import { Colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Dimensions, Alert, Text } from "react-native";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PressureGuide from "@/components/PressureGuide";
import ActionButton from "../../components/ActionButton";

const window = Dimensions.get("window");
// const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const getUserId = async () => {
  if (Platform.OS === "web") {
    return localStorage.getItem("userId");
  } else {
    return await AsyncStorage.getItem("userId");
  }
};
export default function measurePressure() {
  const [type, setType] = useState("start"); // start, ing, end, error
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      // console.log("**measurePressure page Effect**");
      const storedUserName = await AsyncStorage.getItem("userName");
      setUserName(storedUserName);
      setIsLoading(false); // 로딩 완료
    };

    fetchUserId();
  });

  const startMeasurement = async () => {
    setType("ing");
    // setType("start");
    try {
      const userId = await getUserId();
      console.log("**measurePressure page btn**");
      console.log("User ID:", userId);

      const response = await fetch(`${BASE_URL}/api/pressure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setType("end");
      } else {
        setType("fail");
        console.log(type);
        throw new Error("측정에 실패했어요. 발 사이즈만 측정하러 갈까요?");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "발 압력센서 연결이 불안정해요. 🥲");
      setType("fail");
    }
  };
  const retryMeasrement = async () => {
    setType("start");
  };

  return (
    <View style={styles.container}>
      <Text style={{ textAlign: "center" }}> {userName}👣</Text>
      <PressureGuide
        type={type}
        bottomText={
          type === "start"
            ? "빨간색선에 맞춰 편하게 서주세요"
            : type === "ing"
            ? "압력 측정중..."
            : type === "end"
            ? "발 압력 분포 분석 완료 👍"
            : type === "fail"
            ? "😢 압력 측정에 실패했어요. 껐다가 다시 켜주세요."
            : null
        }
        buttonTitle={
          type === "start"
            ? "압력측정 시작하기"
            : type === "end"
            ? "발 사이즈 재러가기 ﹥"
            : "다시 재기"
        }
        // ActionButton
        buttonHandler={
          type === "start"
            ? startMeasurement
            : type === "fail"
            ? retryMeasrement
            : null
        }
        // NavigateButton
        buttonLink={type === "end" ? "/captureFootSize" : "/captureFootSize"}
      />
      {type == "end" ? (
        <ActionButton
          title="다시 측정하기"
          onPress={() => {
            setType("start");
          }}
          style={{
            alignItems: "center",
            marginHorizontal: 50,
            width: "auto",
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
