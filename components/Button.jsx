import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
// label: 버튼 글자
// theme: 테마별 색

export default function Button({ label, fontName }) {
  return (
    <View style={styles.buttonContainer}>
      <FontAwesome name="file" />
      <View>
        <Text style={styles.buttonTitle}>발 사이즈만 측정하러가기</Text>
        <Text style={styles.description}>압력을 측정하는 기구가 없어요 🥲</Text>
      </View>
      <Text>{">"}</Text>
    </View>
    // <View style={styles.buttonContainer}>
    //   <FontAwesome name="fontNamae" />
    //   <Pressable
    //     style={styles.button}
    //     onPress={() => alert("You pressed a button")}
    //   >
    //     {/* <FontAwesome
    //       name="picture-o"
    //       size={18}
    //       color="#25292e"
    //       style={styles.buttonIcon}
    //     /> */}
    //     <Text style={styles.buttontext}>{label}</Text>
    //   </Pressable>
    // </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    // color: Colors.green.green100,
    opacity: 0.8,
    lineHeight: 16,
  },
  buttonDescription: {
    // fontSize: 16,
    color: "#666",
    textAlign: "center",
    // marginBottom: 20,
  },
});
