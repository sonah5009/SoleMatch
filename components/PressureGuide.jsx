import { View, Text, Image } from "react-native";
import React from "react";

export default function PressureGuide() {
  return (
    <Image
      source={require("../assets/images/pressure-both.png")}
      style={{ height: 100 }}
    />
  );
}
