import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const ActionButton = ({ title, onPress, style }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: Colors.green.green100,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  text: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ActionButton;
