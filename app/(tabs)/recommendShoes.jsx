import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import Carousel from "react-native-snap-carousel";

import { views1 } from "./viewdata";

const renderItem1 = ({ item }) => {
   return (
      <View style={styles.renderItem1_parentView}>
         <Image source={{ uri: item.imgUrl }} style={styles.renderItem1_img} />
         <View style={styles.renderItem1_view1}>
            <Text style={styles.renderItem1_text1}>OFFERS</Text>
         </View>
         <View style={styles.renderItem1_view2}>
            <Text style={styles.renderItem1_text2}>{item.title}</Text>
            <TouchableOpacity>
               <Text style={styles.renderItem1_text3}>EXPLORE OFFERS</Text>
            </TouchableOpacity>
         </View>
      </View>
   );
};

const recommendShoes = () => {
   return (
      <View
         style={{
            flex: 1,
            backgroundColor: "#f2f2f2",
            alignItems: "center",
            padding: 20,
         }}>
         <Carousel
            layout={"default"}
            data={views1}
            renderItem={renderItem1}
            sliderWidth={400}
            itemWidth={350}
         />
      </View>
   );
};

export default recommendShoes;

const styles = StyleSheet.create({
   
});
