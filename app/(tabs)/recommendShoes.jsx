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

  const shoeImages = {
    1: require('../../assets/shoes/1.png'),
    2: require('../../assets/shoes/2.png'),
    3: require('../../assets/shoes/3.png'),
    4: require('../../assets/shoes/4.png'),
    5: require('../../assets/shoes/5.png'),
    6: require('../../assets/shoes/6.png'),
    7: require('../../assets/shoes/7.png'),
    8: require('../../assets/shoes/8.png'),
    9: require('../../assets/shoes/9.png'),
    10: require('../../assets/shoes/10.png'),
    11: require('../../assets/shoes/11.png'),
    12: require('../../assets/shoes/12.png'),
    13: require('../../assets/shoes/13.png'),
    14: require('../../assets/shoes/14.png'),
    15: require('../../assets/shoes/15.png'),
    16: require('../../assets/shoes/16.png'),
    17: require('../../assets/shoes/17.png'),
    18: require('../../assets/shoes/18.png'),
    19: require('../../assets/shoes/19.png'),
    20: require('../../assets/shoes/20.png'),
    21: require('../../assets/shoes/21.png'),
    22: require('../../assets/shoes/22.png'),
    23: require('../../assets/shoes/23.png'),
    24: require('../../assets/shoes/24.png'),
    25: require('../../assets/shoes/25.png'),
    26: require('../../assets/shoes/26.png'),
    27: require('../../assets/shoes/27.png'),
    28: require('../../assets/shoes/28.png'),
    29: require('../../assets/shoes/29.png'),
    30: require('../../assets/shoes/30.png'),
    31: require('../../assets/shoes/31.png'),
    32: require('../../assets/shoes/32.png'),
    33: require('../../assets/shoes/33.png'),
    34: require('../../assets/shoes/34.png'),
    35: require('../../assets/shoes/35.png'),
    36: require('../../assets/shoes/36.png'),
    37: require('../../assets/shoes/37.png'),
    38: require('../../assets/shoes/38.png'),
    39: require('../../assets/shoes/39.png'),
    40: require('../../assets/shoes/40.png'),
    41: require('../../assets/shoes/41.png'),
    42: require('../../assets/shoes/42.png'),
    43: require('../../assets/shoes/43.png'),
    44: require('../../assets/shoes/44.png'),
    45: require('../../assets/shoes/45.png'),
    46: require('../../assets/shoes/46.png'),
    47: require('../../assets/shoes/47.png'),
    48: require('../../assets/shoes/48.png'),
    49: require('../../assets/shoes/49.png'),
    50: require('../../assets/shoes/50.png'),
    51: require('../../assets/shoes/51.png'),
    52: require('../../assets/shoes/52.png'),
    53: require('../../assets/shoes/53.png'),
    54: require('../../assets/shoes/54.png'),
    55: require('../../assets/shoes/55.png'),
    56: require('../../assets/shoes/56.png'),
    57: require('../../assets/shoes/57.png'),
    58: require('../../assets/shoes/58.png'),
    59: require('../../assets/shoes/59.png'),
    60: require('../../assets/shoes/60.png'),
    61: require('../../assets/shoes/61.png'),
    62: require('../../assets/shoes/62.png'),
    63: require('../../assets/shoes/63.png'),
    64: require('../../assets/shoes/64.png'),
    65: require('../../assets/shoes/65.png'),
  };

  const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_LOCAL_URL;

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
