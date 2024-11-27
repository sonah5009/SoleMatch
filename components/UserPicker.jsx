import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";

const UserPicker = ({
  users,
  selectedUser,
  setSelectedUser,
  userName,
  defaultTitle,
  secondTitle,
}) => (
  <View>
    <Text style={styles.label}>
      {userName === selectedUser ? (
        <Text>{defaultTitle}</Text>
      ) : (
        <Text>{secondTitle}</Text>
      )}
    </Text>
    <Picker
      selectedValue={selectedUser}
      onValueChange={(itemValue) => setSelectedUser(itemValue)}
      style={styles.picker}
    >
      {users.map((user, index) => (
        <Picker.Item key={index} label={user.userName} value={user.userName} />
      ))}
    </Picker>
  </View>
);

export default UserPicker;

const styles = StyleSheet.create({
  label: {
    textAlign: "center",
    padding: 10,
    backgroundColor: "#013D2A",
    height: 35,
    fontSize: 16,
    color: "#fff",
  },
  picker: {},
});
