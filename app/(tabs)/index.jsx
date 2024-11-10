// import Button from "@/components/Button";
import { Image } from "expo-image";
import { StyleSheet, View, Text, Button, Dimensions } from "react-native";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const window = Dimensions.get("window");
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Index() {
  return (
    <View style={styles.container}>
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
        <Link href="measurePressure">
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

        <Link href="captureFootSize">
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
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
  container: {
    flex: 1,

    marginTop: Dimensions.get("window").width > 500 ? 15 : 10,
    marginHorizontal: Dimensions.get("window").width > 500 ? 350 : 20,

    opacity: 0.8,
  },
  header: {
    borderRadius: 5,
    paddingHorizontal: Dimensions.get("window").width > 500 ? 30 : 20,
    paddingVertical: Dimensions.get("window").width > 500 ? 50 : 30,
    gap: 10,

    backgroundColor: "#fafafa",
  },
  main: {
    // paddingHorizontal: 30,
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
    paddingHorizontal: Dimensions.get("window").width > 500 ? 30 : 18,
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
    fontSize: Dimensions.get("window").width > 500 ? 19 : 18,
    fontWeight: "bold",

    opacity: 0.8,
  },
  buttonDescription: {
    fontSize: 16,
    color: "#666",
  },
});
