import { Link, Stack } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import React from "react";

const App = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: "Home" }} />
      <Link href={"/lottery"}>{"1. Lottery Screen"}</Link>
      <Link href={"/gradient-intro-slider"}>{"2. Gradient Intro Slider"}</Link>
      <Link href={"/use-call-back"}>{"3. Use CallBack Demo"}</Link>
      <Link href={"/advanced-form"}>{"4. Advanced Form"}</Link>
      <Link href={"/skia"}>{"5. Skia"}</Link>
      <Link href={"/shaders/sdf-line"}>
        {"6. Skia Shaders and the SDF of a Line"}
      </Link>
      <Link href={"/legend-list-optimized"}>{"7. Legend List Optimized"}</Link>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});

export default App;
