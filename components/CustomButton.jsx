import React from "react";
import { Colors } from "@/constants/Colors";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomButton = ({ onPress, title, style }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: "#013D2A",
    backgroundColor: Colors.green.green100,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
    maxWidth: 300,
    width: "100%",
  },
  text: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CustomButton;
