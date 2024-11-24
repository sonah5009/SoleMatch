import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import NavigateButton from "./NavigateButton";
import ActionButton from "./ActionButton";

const window = Dimensions.get("window");

export default function PressureGuide({
  type,
  bottomText,
  buttonTitle,
  buttonHandler,
  buttonLink,
}) {
  return (
    <>
      <View style={styles.main}>
        {type === "ing" ? (
          <ActivityIndicator size="large" color={Colors.green.green100} />
        ) : (
          <Image
            source={require("../assets/images/pressure-both.png")}
            style={styles.image}
          />
        )}
      </View>
      <View style={styles.bottom}>
        <Text>{bottomText}</Text>
        {type === "start" && (
          <ActionButton onPress={buttonHandler} title={buttonTitle} />
        )}
        {type === "end" && (
          <NavigateButton title={buttonTitle} link={buttonLink} />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    height: window.width > 500 ? window.height * 0.6 : window.height * 0.6,
  },
  image: {
    width: "auto",
    height: window.width > 500 ? window.height * 0.6 : window.height * 0.6,
    resizeMode: "contain",
    marginHorizontal: 50,
  },
  bottom: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "space-evenly",
    paddingHorizontal: window.width > 500 ? 350 : 20,
  },
});
