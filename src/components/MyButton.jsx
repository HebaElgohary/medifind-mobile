import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";

export function MyButton({ title, onPress }) {
  return (
    <View style={{ display: "flex", alignItems: "center" }}>
      <Button
        buttonColor="#01b3bd"
        mode="contained"
        style={{ width: 180, marginTop: 12 ,marginLeft:10}}
        onPress={onPress}
      >
        {title}
      </Button>
    </View>
  );
}
