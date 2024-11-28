import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Linking } from "react-native";
import { Picker } from "@react-native-picker/picker";
import PagerView from "react-native-pager-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserPicker from "../../components/UserPicker";

export default function RecommendShoes() {
  const [userName, setUserName] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [shoes, setShoes] = useState([]);

  const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem("userName");
        setUserName(storedUserName);

        console.log("**recommendShoes page**");
        console.log("**First Fetching users...**");
        const response = await fetch(`${BASE_URL}/users`);
        const data = await response.json();
        setUsers(data);
        setSelectedUser(storedUserName || null);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, [userName]);

  useEffect(() => {
    if (selectedUser) {
      const fetchShoes = async () => {
        try {
          console.log(`Fetching shoes for user: ${selectedUser}`);
          const userResponse = await fetch(
            `${BASE_URL}/user?userName=${selectedUser}`
          );
          const user = await userResponse.json();
          const roundedSize = Math.round(user.leftFootSize / 5) * 5;

          const shoesResponse = await fetch(
            `${BASE_URL}/shoes?class=${user.class}&size=${roundedSize}`
          );
          const shoes = await shoesResponse.json();

          setShoes(shoes);
        } catch (error) {
          console.error("Failed to fetch shoes:", error);
        }
      };

      fetchShoes();
    }
  }, [selectedUser]);

  return (
    <View style={styles.container}>
      <UserPicker
        users={users}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        userName={userName}
        defaultTitle={`${userName}의 추천 신발 👟`}
        secondTitle="다른 사람의 추천 신발 구경하기"
      />
      <PagerView style={styles.container} initialPage={0}>
        {shoes.length > 0 ? (
          shoes.map((shoe, index) => (
            <View style={styles.page} key={index}>
              <Text style={styles.shoeName}>{shoe.name}</Text>
              <Text style={styles.shoeDetails}>Size: {shoe.size}</Text>
              <Image source={shoeImages[shoe.id]} style={styles.shoeImage} />
              <Text
                style={styles.shoeLink}
                onPress={() => Linking.openURL(shoe.site)}
              >
                Visit site
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.page}>
            <Text>음... 추천할만한 신발이 없네요 🥲</Text>
          </View>
        )}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  shoeName: {
    marginTop: 40,
    fontSize: 20,
    fontWeight: "bold",
  },
  shoeDetails: {
    fontSize: 16,
    marginVertical: 5,
  },
  shoeLink: {
    backgroundColor: "darkgreen",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    fontSize: 16,
    color: "white",
    marginVertical: 10,
    textDecorationLine: "none",
  },
  shoeImage: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginTop: 10,
  },
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
