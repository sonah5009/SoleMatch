import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Dimensions, Alert, Text } from "react-native";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PressureGuide from "@/components/PressureGuide";
import ActionButton from "../../components/ActionButton";

const window = Dimensions.get("window");
const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_LOCAL_URL;

export default function measurePressure() {
  const [type, setType] = useState("start"); // start, ing, end, error
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserName = await AsyncStorage.getItem("userName");
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(storedUserId);
      setUserName(storedUserName);
    };

    fetchUserId();
  }, []);

  const fetchPressureImage = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/pressureImage?userId=${userId}`
      );
      if (response.ok) {
        const { image } = await response.json();
        const imageUri = `data:image/png;base64,${image}`; // Base64 URI 생성
        setImageUri(imageUri);
      } else {
        const { error } = await response.json();
        throw new Error(error || "Failed to fetch pressure image.");
      }
    } catch (error) {
      console.log("**fetchPressureImage**");
      Alert.alert("Error", error.message);
    }
  };

  const startMeasurement = async () => {
    setType("ing");
    try {
      const response = await fetch(`${BASE_URL}/api/pressure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setType("end");
        await fetchPressureImage(); // 측정 완료 후 이미지 가져오기
      } else {
        setType("fail");
        throw new Error("측정에 실패했어요. 발 사이즈만 측정하러 갈까요?");
      }
    } catch (error) {
      Alert.alert("Error", "발 압력센서 연결이 불안정해요. 🥲");
      setType("fail");
    }
  };

  const retryMeasurement = () => {
    setType("start");
  };

  return (
    <View style={styles.container}>
      <Text style={{ textAlign: "center" }}>{userName}👣</Text>
      <PressureGuide
        userId={userId}
        type={type}
        imageUri={imageUri}
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
        buttonHandler={
          type === "start"
            ? startMeasurement
            : type === "fail"
            ? retryMeasurement
            : null
        }
        buttonLink={type === "end" ? "/captureFootSize" : "/captureFootSize"}
      />
      {type === "end" ? (
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
