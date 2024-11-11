import React, { useState } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { Link } from "expo-router";

const measurePressure = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pressureResult, setPressureResult] = useState(null);

  const simulateMeasurement = () => {
    setIsLoading(true);

    // 시뮬레이션용 타이머
    setTimeout(() => {
      setIsLoading(false);
      // 임시 결과 설정, 실제 개발에서는 서버 또는 장비로부터 받은 데이터를 사용
      setPressureResult({
        imageUrl: "https://via.placeholder.com/150",
        pressureData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      });
    }, 5000);
  };

  return (
    <View>
      <Text style={styles.title}>발 압력 측정</Text>
      {!isLoading && !pressureResult && (
        <View>
          <Text>발을 가이드 선에 맞게 올려주세요</Text>
          <Link
            style={{ marginHorizontal: "auto" }}
            href="/measurePressure"
            asChild
          >
            <Pressable style={styles.button} onPress={simulateMeasurement}>
              <Text style={styles.buttonText}>시작하기</Text>
            </Pressable>
          </Link>
        </View>
      )}

      {isLoading && (
        <View>
          <Text style={styles.title}>측정중...</Text>
          <ActivityIndicator size="large" color="#0000FF" />
        </View>
      )}

      {pressureResult && (
        <View style={styles.resultContainer}>
          <Image
            source={{ uri: pressureResult.imageUrl }}
            style={styles.resultImage}
          />
          <Text>측정 결과 이미지</Text>
          <Link href="/captureFootSize" style={styles.buttonLink} asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>발 사이즈 측정하기</Text>
            </Pressable>
          </Link>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  resultContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  resultImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  buttonLink: {
    marginTop: 10,
  },
});

export default measurePressure;
