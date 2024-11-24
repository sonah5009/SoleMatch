import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const CentralLayout = ({ children }) => {
  const window = Dimensions.get("window");
  return (
    <View
      style={[
        styles.container,
        {
          marginTop: window.width > 500 ? 15 : 10,
          marginHorizontal: window.width > 500 ? 350 : 20,
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CentralLayout;
