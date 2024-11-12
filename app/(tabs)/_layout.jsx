import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2a2a2a",
        headerStyle: {
          backgroundColor: Colors.gray.gray200,
        },
        headerShadowVisible: false,
        headerTintColor: Colors.gray.gray500,
        tabBarStyle: {
          // backgroundColor: "#25292e",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          // href: null,
          title: "홈",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
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
    </Tabs>
  );
}
