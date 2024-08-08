import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { foodData, thresholds } from "@/constants/data";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NutritionStatus = {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fiber: number;
  sugar: number;
  sodium: number;
  status: {
    calories: "low" | "high" | "normal";
    protein: "low" | "high" | "normal";
    fat: "low" | "high" | "normal";
    carbohydrates: "low" | "high" | "normal";
    fiber: "low" | "high" | "normal";
    sugar: "low" | "high" | "normal";
    sodium: "low" | "high" | "normal";
  };
};

export default function App() {
  const [meal, setMeal] = useState<string>("");
  const [result, setResult] = useState<NutritionStatus | null>(null);
  const [dailyMeals, setDailyMeals] = useState<NutritionStatus[]>([]);

  useEffect(() => {
    loadMeals();
  }, []);

  const saveMeals = async (meals: NutritionStatus[]) => {
    try {
      const jsonValue = JSON.stringify(meals);
      await AsyncStorage.setItem("dailyMeals", jsonValue);
    } catch (e) {
      console.error("Failed to save meals.", e);
    }
  };

  const loadMeals = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("dailyMeals");
      if (jsonValue != null) {
        setDailyMeals(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Failed to load meals.", e);
    }
  };

  const calculateNutrition = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    let totalFiber = 0;
    let totalSugar = 0;
    let totalSodium = 0;

    const foods = meal.split(",").map((item) => item.trim());

    foods.forEach((food) => {
      const foodItem = foodData.find(
        (f) => f.foodItem.toLowerCase() === food.toLowerCase()
      );
      if (foodItem) {
        totalCalories += foodItem.calories;
        totalProtein += foodItem.protein;
        totalFat += foodItem.fat;
        totalCarbs += foodItem.carbohydrates;
        totalFiber += foodItem.fiber;
        totalSugar += foodItem.sugar;
        totalSodium += foodItem.sodium;
      }
    });

    const nutritionStatus: NutritionStatus = {
      calories: totalCalories,
      protein: totalProtein,
      fat: totalFat,
      carbohydrates: totalCarbs,
      fiber: totalFiber,
      sugar: totalSugar,
      sodium: totalSodium,
      status: {
        calories:
          totalCalories < thresholds.calories.low
            ? "low"
            : totalCalories > thresholds.calories.high
            ? "high"
            : "normal",
        protein:
          totalProtein < thresholds.protein.low
            ? "low"
            : totalProtein > thresholds.protein.high
            ? "high"
            : "normal",
        fat:
          totalFat < thresholds.fat.low
            ? "low"
            : totalFat > thresholds.fat.high
            ? "high"
            : "normal",
        carbohydrates:
          totalCarbs < thresholds.carbohydrates.low
            ? "low"
            : totalCarbs > thresholds.carbohydrates.high
            ? "high"
            : "normal",
        fiber:
          totalFiber < thresholds.fiber.low
            ? "low"
            : totalFiber > thresholds.fiber.high
            ? "high"
            : "normal",
        sugar:
          totalSugar < thresholds.sugar.low
            ? "low"
            : totalSugar > thresholds.sugar.high
            ? "high"
            : "normal",
        sodium:
          totalSodium < thresholds.sodium.low
            ? "low"
            : totalSodium > thresholds.sodium.high
            ? "high"
            : "normal",
      },
    };

    setResult(nutritionStatus);
    const newDailyMeals = [...dailyMeals, nutritionStatus];
    setDailyMeals(newDailyMeals);
    saveMeals(newDailyMeals);
  };

  const clearData = async () => {
    try {
      await AsyncStorage.removeItem("dailyMeals");
      setDailyMeals([]);
    } catch (e) {
      console.error("Failed to clear data.", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Nutritional Value Checker</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter foods separated by commas"
        value={meal}
        onChangeText={setMeal}
      />
      <View style={styles.foodChips}>
        <TouchableOpacity
          style={styles.foodChip}
          onPress={() => setMeal(meal + "apple,")}
        >
          <Text style={styles.foodChipText}>Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.foodChip}
          onPress={() => setMeal(meal + "egg,")}
        >
          <Text style={styles.foodChipText}>Egg</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.foodChip}
          onPress={() => setMeal(meal + "yam,")}
        >
          <Text style={styles.foodChipText}>Yam</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.foodChip}
          onPress={() => setMeal(meal + "beans,")}
        >
          <Text style={styles.foodChipText}>Beans</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.foodChip}
          onPress={() => setMeal(meal + "corn,")}
        >
          <Text style={styles.foodChipText}>Corn</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.checkButton} onPress={calculateNutrition}>
        <Text style={styles.checkButtonText}>Check Nutrition</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.nutritionSummary}>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionValue}>
              {result.carbohydrates.toFixed(1)}g
            </Text>
            <Text style={styles.nutritionLabel}>Carbs</Text>
            <Text style={styles.nutritionLabel}>
              {result.status.carbohydrates}
            </Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionValue}>
              {result.protein.toFixed(1)}g
            </Text>
            <Text style={styles.nutritionLabel}>Proteins</Text>
            <Text style={styles.nutritionLabel}>{result.status.protein}</Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionValue}>{result.calories}</Text>
            <Text style={styles.nutritionLabel}>Kcal</Text>
            <Text style={styles.nutritionLabel}>{result.status.calories}</Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionValue}>{result.fat.toFixed(1)}g</Text>
            <Text style={styles.nutritionLabel}>Fats</Text>
            <Text style={styles.nutritionLabel}>{result.status.fat}</Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionValue}>
              {result.fiber.toFixed(1)}g
            </Text>
            <Text style={styles.nutritionLabel}>Fiber</Text>
            <Text style={styles.nutritionLabel}>{result.status.fiber}</Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionValue}>
              {result.sugar.toFixed(1)}g
            </Text>
            <Text style={styles.nutritionLabel}>Sugar</Text>
            <Text style={styles.nutritionLabel}>{result.status.sugar}</Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionValue}>
              {result.sodium.toFixed(1)}mg
            </Text>
            <Text style={styles.nutritionLabel}>Sodium</Text>
            <Text style={styles.nutritionLabel}>{result.status.sodium}</Text>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.clearButton} onPress={clearData}>
        <Text style={styles.clearButtonText}>Clear Data</Text>
      </TouchableOpacity>

      <Text style={styles.summaryHeader}>Daily Nutrition Summary</Text>
      <FlatList
        data={dailyMeals}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => (
          <View style={styles.nutritionSummary}>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>
                {item.carbohydrates.toFixed(1)}g
              </Text>
              <Text style={styles.nutritionLabel}>Carbs</Text>
              <Text style={styles.nutritionLabel}>
                {item.status.carbohydrates}
              </Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>
                {item.protein.toFixed(1)}g
              </Text>
              <Text style={styles.nutritionLabel}>Proteins</Text>
              <Text style={styles.nutritionLabel}>{item.status.protein}</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>{item.calories}</Text>
              <Text style={styles.nutritionLabel}>Kcal</Text>
              <Text style={styles.nutritionLabel}>{item.status.calories}</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>{item.fat.toFixed(1)}g</Text>
              <Text style={styles.nutritionLabel}>Fats</Text>
              <Text style={styles.nutritionLabel}>{item.status.fat}</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>
                {item.fiber.toFixed(1)}g
              </Text>
              <Text style={styles.nutritionLabel}>Fiber</Text>
              <Text style={styles.nutritionLabel}>{item.status.fiber}</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>
                {item.sugar.toFixed(1)}g
              </Text>
              <Text style={styles.nutritionLabel}>Sugar</Text>
              <Text style={styles.nutritionLabel}>{item.status.sugar}</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>
                {item.sodium.toFixed(1)}mg
              </Text>
              <Text style={styles.nutritionLabel}>Sodium</Text>
              <Text style={styles.nutritionLabel}>{item.status.sodium}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: StatusBar.currentHeight || 0,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  foodChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  foodChip: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  foodChipText: {
    fontSize: 14,
  },
  checkButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  checkButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  clearButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  nutritionSummary: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  nutritionLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
});
