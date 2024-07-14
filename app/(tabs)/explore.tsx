import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";

const InstructionScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to Your Nutrition Checker App</Text>
      <Text style={styles.title}>By Samuel Ggboyega 21D/47CS/01577</Text>

      <Text style={styles.header}>Instructions</Text>

      <View style={styles.instruction}>
        <Text style={styles.instructionText}>
          1. Enter food items separated by commas (e.g., "apple, egg, yam").
        </Text>
        <Text style={styles.instructionText}>
          2. Tap on food chips to quickly add common items.
        </Text>
        <Text style={styles.instructionText}>
          3. Tap "Check Nutrition" to see nutritional values for your meal.
        </Text>
        <Text style={styles.instructionText}>
          4. View daily and weekly nutrition summaries below.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "white",
  },
  instruction: {
    backgroundColor: "black",
    borderRadius: 8,
    padding: 16,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 12,
    color: "white",
  },
});

export default InstructionScreen;
