import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";

const NavigateButton = ({ title, link, onPress }) => (
  <View style={styles.buttonWrapper}>
    <Link href={link} onPress={onPress} style={styles.link}>
      <Text style={styles.text}>{title}</Text>
    </Link>
  </View>
);

const styles = StyleSheet.create({
  buttonWrapper: {
    maxWidth: 300,
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: Colors.green.green100,
    borderRadius: 5,
    padding: 10,
  },
  link: {
    textAlign: "center", // Ensures text alignment
    width: "100%",
  },
  text: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default NavigateButton;
