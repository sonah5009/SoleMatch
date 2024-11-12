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
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PressureGuide from "../../components/PressureGuide";

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

export default function measurePressure() {
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [guideShow, setGuideShow] = useState(true);
  const [measurementComplete, setMeasurementComplete] = useState(false);
  const navigation = useNavigation();

  const startMeasurement = async () => {
    setIsMeasuring(true);
    const userId = await getUserId();
    console.log("userId");
    console.log(userId);

    try {
      const response = await fetch(`${BACKEND_URL}/api/pressure`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }), // Include userId in the request
      });
      const result = await response.json(); // True or False

      if (result.success) {
        setMeasurementComplete(true);
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
      setIsMeasuring(false);
    }
  };

  const goToSizeMeasurement = () => {
    setGuideShow(true);
    setIsMeasuring(false);
    setMeasurementComplete(false);
    navigation.navigate("captureFootSize");
  };

  const startGuide = async () => {
    setGuideShow(false);
  };

  return (
    <View style={styles.container}>
      {guideShow ? (
        <View>
          {/* <PressureGuide /> */}
          <Image
            source={require("../../assets/images/pressure-both.png")}
            style={{ width: "auto" }}
          />
          <Button
            title="빨간색선에 맞춰 편하게 서주세요"
            onPress={startGuide}
          />
        </View>
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {isMeasuring ? (
            // 백엔드에서 측정 중일때
            <View>
              <Text>Measuring pressure...</Text>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/images/shoes.jpeg")}
                style={{ width: 300, height: 300 }}
              />
              <Text>
                Align yourself with the guide and press "Start Measurement".
              </Text>
              <Button title="Start Measurement" onPress={startMeasurement} />
              {measurementComplete && (
                <Button
                  title="Measure Foot Size"
                  onPress={goToSizeMeasurement}
                />
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
