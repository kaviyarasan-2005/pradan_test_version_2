import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function Sidebar({ isVisible }: { isVisible: boolean }) {
  const slideAnim = useState(new Animated.Value(-200))[0];
  const router = useRouter();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -200,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isVisible]);

  return (
    <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
      <TouchableOpacity onPress={() => router.replace("/dashboard")}>
        <Text style={styles.item}>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/settings")}>
        <Text style={styles.item}>Settings</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 60,
    bottom: 0,
    width: 200,
    backgroundColor: "#f0f0f0",
    paddingTop: 20,
    paddingLeft: 10,
    zIndex: 1,
  },
  item: {
    fontSize: 16,
    marginVertical: 15,
    color: "blue",
  },
});
