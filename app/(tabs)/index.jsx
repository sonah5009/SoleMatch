import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Image } from "expo-image";
import { StyleSheet, View, Text, Button, Dimensions } from "react-native";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCameraPermissions } from "expo-camera";

const window = Dimensions.get("window");
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

// const clearAsyncStorage = async () => {
//   try {
//     await AsyncStorage.clear();
//     console.log("AsyncStorage has been cleared!");
//   } catch (error) {
//     console.error("Error clearing AsyncStorage:", error);
//   }
// };

// // Call this function to clear all stored data
// clearAsyncStorage();

export default function index() {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      console.log("index page rendered");
      setUserId(storedUserId);
      setIsLoading(false); // 로딩 완료
      console.log("storedUserId", storedUserId);
      if (!permission) {
        return <View />;
      }
      if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
          <View style={styles.container}>
            <Text style={styles.message}>
              We need your permission to show the camera
            </Text>
            <Button onPress={requestPermission} title="grant permission" />
          </View>
        );
      }
    };

    fetchUserId();
  });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: Colors.gray.gray200, dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("../../assets/images/partial-SoleMatch-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          발의 압력을 재고 사진을 찍으면{"\n"} AI가 신발을 추천해드려요
        </Text>
        <Text style={styles.discription}>
          나의 발의 압력분포를 알아보고 촬영하고 나에게 딱 맞는 신발을
          찾아가세요
        </Text>
      </View>

      <View style={styles.main}>
        {/* Button */}

        <Link href="userInput" replace={true}>
          <View style={styles.buttonContainer}>
            <View>
              <Text style={styles.buttonTitle}>유저 등록 하러가기</Text>
              <Text style={styles.buttonDescription}>
                정보 등록을 하지 않았다면 먼저해주세요.{"\n"}
              </Text>
            </View>
            <Text>{">"}</Text>
          </View>
        </Link>

        <Link
          href="measurePressure"
          style={{ opacity: userId ? 1 : 0.5 }} // Dim button if disabled
          disabled={userId == null}
        >
          <View style={styles.buttonContainer}>
            <View>
              <Text style={styles.buttonTitle}>
                압력측정부터 발 사이즈까지 측정 하러가기
              </Text>
              <Text style={styles.buttonDescription}>
                내 발에 대해 자세히 알고싶어요!
              </Text>
            </View>
            <Text>{">"}</Text>
          </View>
        </Link>

        <Link
          href="captureFootSize"
          style={{ opacity: userId ? 1 : 0.5 }}
          disabled={userId == null}
        >
          <View style={styles.buttonContainer}>
            <View>
              <Text style={styles.buttonTitle}>발 사이즈만 측정하러가기</Text>
              <Text style={styles.buttonDescription}>
                압력을 측정하는 기구가 없어요 🥲
              </Text>
            </View>
            <Text>{">"}</Text>
          </View>
        </Link>
      </View>

      {/* 사용자의 발 정보 */}

      <View style={styles.footer}>
        <View style={styles.userNameHeader}>
          <Text style={{ fontWeight: 600 }}>김채리</Text>
          <Text>{">"}</Text>
        </View>
        <View style={styles.userPlantarInfo}>
          <View style={styles.plantarSize}>
            <Text style={styles.plantarInfoTitle}>발 사이즈</Text>
            <Text style={styles.plantarInfoSubtitle}>왼발</Text>
            <Text>233mm</Text>
            <Text style={styles.plantarInfoSubtitle}>오른발</Text>
            <Text>235mm</Text>
          </View>
          <View style={styles.plantarWidth}>
            <Text style={styles.plantarInfoTitle}>발 사이즈</Text>
            <Text style={styles.plantarInfoSubtitle}>왼발</Text>
            <Text>107mm</Text>
            <Text style={styles.plantarInfoSubtitle}>오른발</Text>
            <Text>100mm</Text>
          </View>
          <View>
            <Image
              style={styles.image}
              source={require("../../assets/images/shoes.jpeg")}
              contentFit="cover"
              placeholder={{ blurhash }}
              transition={1000}
            />
          </View>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
  container: {
    flex: 1,
    marginTop: window.width > 500 ? 15 : 10,
    marginHorizontal: window.width > 500 ? 350 : 20,
    // opacity: 0.8,
  },
  header: {
    borderRadius: 5,
    paddingHorizontal: window.width > 500 ? 30 : 20,
    paddingVertical: window.width > 500 ? 50 : 30,
    gap: 10,
    backgroundColor: "#fafafa",
  },
  main: {
    marginTop: 20,
    gap: 10,
  },
  footer: {
    width: "100%",
    marginTop: 20,
    backgroundColor: "#fafafa",
    borderRadius: 5,
    paddingBottom: 15,
  },
  userNameHeader: {
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },
  userPlantarInfo: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  plantarSize: {
    gap: 3,
  },
  plantarWidth: {
    gap: 3,
  },
  plantarInfoTitle: {
    fontWeight: "bold",
  },
  plantarInfoSubtitle: {
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  discription: {
    fontSize: 16,
  },
  buttonContainer: {
    paddingHorizontal: window.width > 500 ? 30 : 18,
    paddingVertical: 20,
    width: "100%",
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    alignContent: "stretch",
    borderRadius: 5,
    borderColor: "#333",
    backgroundColor: "#fafafa",
  },
  buttonTitle: {
    fontSize: window.width > 500 ? 19 : 18,
    fontWeight: "bold",
    opacity: 0.8,
  },
  buttonDescription: {
    fontSize: 16,
    color: "#666",
  },
  reactLogo: {
    opacity: 90,
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
