import { StyleSheet, View } from "react-native";

import MarketingView from "./containers/MarketingView";
import React from "react";

const GradientIntroSlider = () => {
  return (
    <View style={styles.container}>
      <MarketingView />
    </View>
  );
};

export default GradientIntroSlider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
