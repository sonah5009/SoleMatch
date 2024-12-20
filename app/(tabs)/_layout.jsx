import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

import { useSegments } from "expo-router";

export default function TabsLayout() {
  // const segments = useSegments()[1];
  // console.log("segments:", segments);

  // // Determine if tabs should be hidden
  // const isTabHidden = segments === "measurePressure";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2a2a2a",
        headerStyle: {
          backgroundColor: Colors.gray.gray200,
        },
        headerShadowVisible: false,
        headerTintColor: Colors.gray.gray500,
        // tabBarStyle: isTabHidden
        //   ? { display: "none" } // Hide tabs
        //   : {}, // Default style
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "내 발 정보",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "person-sharp" : "person-outline"}
              size={30}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="userInput"
        options={{
          title: "유저 정보",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "person-sharp" : "person-outline"}
              size={30}
            />
          ),
        }}
      />

      <Tabs.Screen
        options={{
          href: null,
        }}
        name="shoes"
      />
      <Tabs.Screen
        name="measurePressure"
        options={{
          title: "발 압력 측정",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "footsteps-sharp" : "footsteps-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="captureFootSize"
        options={{
          title: "발 사이즈 측정",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "footsteps-sharp" : "footsteps-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="recommendShoes"
        options={{
          title: "신발 추천",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "footsteps-sharp" : "footsteps-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
