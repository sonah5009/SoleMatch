// TODO: userId 전역 or 지역 변수 고민
import { Colors } from "@/constants/Colors";
import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, Dimensions } from "react-native";
import {
  View,
  Text,
  Button,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigationContainerRef } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useNavigation } from "expo-router";
import NavigateButton from "@/components/NavigateButton";

const window = Dimensions.get("window");
const BACKEND_URL = "http://127.0.0.1:5000";
// const BACKEND_URL = "http://192.168.0.16:5000";

const getUserId = async () => {
  if (Platform.OS === "web") {
    // Web 환경에서는 localStorage를 사용
    return localStorage.getItem("userId");
  } else {
    // 모바일 환경에서는 AsyncStorage 사용
    return await AsyncStorage.getItem("userId");
  }
};
// const userId = getUserId;

export default function measurePressure() {
  const navigation = useNavigation();
  const navigationRef = useNavigationContainerRef();

  const [isMeasuring, setIsMeasuring] = useState(false);
  const [guideShow, setGuideShow] = useState(true);
  const [measurementComplete, setMeasurementComplete] = useState(false);

  const startMeasurement = async () => {
    setIsMeasuring(true);
    const userId = await getUserId();
    console.log("userId");
    console.log(userId);
    setGuideShow(false);

    try {
      const response = await fetch(`${BACKEND_URL}/api/pressure`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }), // Include userId in the request
      });
      const result = await response.json(); // True or False
      setMeasurementComplete(true);

      // if (result.success) {
      //   Alert.alert(
      //     "Measurement Complete",
      //     "Pressure data recorded successfully."
      //   );
      // } else {
      //   Alert.alert("Error", "Measurement failed.");
      // }
    } catch (error) {
      Alert.alert("Error", "Could not connect to the backend.");
    } finally {
      // navigationRef.navigate("captureFootSize");
      setIsMeasuring(false);
    }
  };

  return (
    <View style={styles.container}>
      {guideShow ? (
        // 1. 빨간색 선 이미지 보여주고 측정 시작 버튼
        <View style={styles.guideContainer}>
          <Image
            source={require("../../assets/images/pressure-both.png")}
            style={styles.imageContainer}
            transition={1000}
          />

          <Button
            title="빨간색선에 맞춰 편하게 서주세요"
            onPress={startMeasurement}
          />
        </View>
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {isMeasuring ? (
            // 2. 측정 중 메시지 띄우기 - 백엔드에서 계산 중 및 압력 분포 이미지 저장 중
            <View>
              <Text>압력 측정중...</Text>
              {/* <ActivityIndicator size="large" color="#0000ff" /> */}
            </View>
          ) : (
            // 3. 측정 완료 시
            <View style={{ alignItems: "center" }}>
              {measurementComplete ? (
                <View>
                  <Text style={{ textAlign: "center" }}>
                    발 압력 분포 분석 완료 👍
                  </Text>

                  <NavigateButton
                    title="발 사이즈 재러가기 ﹥"
                    link="/captureFootSize"
                  />
                </View>
              ) : (
                <Text>😢압력 측정에 실패했어요. 껐다가 다시 켜주세요.</Text>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // marginTop: Dimensions.get("window").width > 500 ? 15 : 10,
    // marginHorizontal: Dimensions.get("window").width > 500 ? 350 : 20,
  },
  guideContainer: {
    alignItems: "center",
  },
  imageContainer: {
    width: window.width, // 화면의 전체 너비
    height: window.width > 500 ? window.width * 0.55 : window.width * 0.75, // 가로 대비 세로 비율을 유지
    resizeMode: "contain", // 이미지를 컨테이너에 맞게 조정
  },
});
