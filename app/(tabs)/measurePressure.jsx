// TODO: userId 전역 or 지역 변수 고민
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
  const navigationRef = useNavigationContainerRef();

  const [isMeasuring, setIsMeasuring] = useState(false);
  const [guideShow, setGuideShow] = useState(true);
  const [measurementComplete, setMeasurementComplete] = useState(false);
  // const navigation = useNavigation();

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

      if (result.success && navigationRef.isReady()) {
        Alert.alert(
          "Measurement Complete",
          "Pressure data recorded successfully."
        );
      } else {
        Alert.alert("Error", "Measurement failed.");
      }
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
        <View>
          <Image
            source={require("../../assets/images/pressure-both.png")}
            style={{ width: "auto" }}
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
              <Text>Measuring pressure...</Text>
              {/* <ActivityIndicator size="large" color="#0000ff" /> */}
            </View>
          ) : (
            // 3. 측정 완료 시
            <View style={{ alignItems: "center" }}>
              {/* <Image
                source={require("../../assets/images/shoes.jpeg")}
                style={{ width: 300, height: 300 }}
              /> */}
              {measurementComplete ? (
                <View>
                  <Text>측정 완료</Text>
                  <Button
                    title="발 크기 측정하러가기"
                    onPress={() => {
                      if (navigationRef.isReady()) {
                      }
                      navigationRef.isReady();
                      navigationRef.navigate("captureFootSize");
                      // setIsMeasuring(false);
                    }}
                  />
                </View>
              ) : (
                <Text>에이 설마</Text>
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

    marginTop: Dimensions.get("window").width > 500 ? 15 : 10,
    marginHorizontal: Dimensions.get("window").width > 500 ? 350 : 20,
  },
});
