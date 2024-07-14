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
  isLow: boolean;
  isHigh: boolean;
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
      isLow:
        totalCalories < thresholds.calories.low ||
        totalProtein < thresholds.protein.low ||
        totalFat < thresholds.fat.low ||
        totalCarbs < thresholds.carbohydrates.low ||
        totalFiber < thresholds.fiber.low ||
        totalSugar < thresholds.sugar.low ||
        totalSodium < thresholds.sodium.low,
      isHigh:
        totalCalories > thresholds.calories.high ||
        totalProtein > thresholds.protein.high ||
        totalFat > thresholds.fat.high ||
        totalCarbs > thresholds.carbohydrates.high ||
        totalFiber > thresholds.fiber.high ||
        totalSugar > thresholds.sugar.high ||
        totalSodium > thresholds.sodium.high,
    };

    setResult(nutritionStatus);
    const newDailyMeals = [...dailyMeals, nutritionStatus];
    setDailyMeals(newDailyMeals);
    saveMeals(newDailyMeals);
  };

  const calculateWeeklyNutrition = () => {
    const weeklySummary = dailyMeals.reduce(
      (acc, meal) => {
        acc.calories += meal.calories || 0;
        acc.protein += meal.protein || 0;
        acc.fat += meal.fat || 0;
        acc.carbohydrates += meal.carbohydrates || 0;
        acc.fiber += meal.fiber || 0;
        acc.sugar += meal.sugar || 0;
        acc.sodium += meal.sodium || 0;
        return acc;
      },
      {
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
      }
    );

    const overallStatus = {
      isLow:
        weeklySummary.calories < thresholds.calories.low ||
        weeklySummary.protein < thresholds.protein.low ||
        weeklySummary.fat < thresholds.fat.low ||
        weeklySummary.carbohydrates < thresholds.carbohydrates.low ||
        weeklySummary.fiber < thresholds.fiber.low ||
        weeklySummary.sugar < thresholds.sugar.low ||
        weeklySummary.sodium < thresholds.sodium.low,
      isHigh:
        weeklySummary.calories > thresholds.calories.high ||
        weeklySummary.protein > thresholds.protein.high ||
        weeklySummary.fat > thresholds.fat.high ||
        weeklySummary.carbohydrates > thresholds.carbohydrates.high ||
        weeklySummary.fiber > thresholds.fiber.high ||
        weeklySummary.sugar > thresholds.sugar.high ||
        weeklySummary.sodium > thresholds.sodium.high,
    };

    return { ...weeklySummary, ...overallStatus };
  };

  const weeklyNutrition = calculateWeeklyNutrition();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>check value</Text>
      <TextInput
        style={styles.input}
        placeholder="nutritional value checker"
        value={meal}
        onChangeText={setMeal}
      />
      <View style={styles.foodChips}>
        <TouchableOpacity
          style={styles.foodChip}
          onPress={() => setMeal(meal + "apple,")}
        >
          <Text style={styles.foodChipText}>apple</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.foodChip}
          onPress={() => setMeal(meal + "egg,")}
        >
          <Text style={styles.foodChipText}>egg</Text>
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
      <Text style={styles.summaryHeader}>view nutrition summary</Text>
      <Text style={styles.summaryDescription}>
        This Healthy section shows you if your meal is reach or low in nutrient
      </Text>
      {result && (
        <View style={styles.nutritionSummary}>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionValue}>
              {result.carbohydrates.toFixed(1)}g
            </Text>
            <Text style={styles.nutritionLabel}>carbs</Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionValue}>
              {result.protein.toFixed(1)}g
            </Text>
            <Text style={styles.nutritionLabel}>proteins</Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionValue}>{result.calories}</Text>
            <Text style={styles.nutritionLabel}>Kcal</Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionValue}>{result.fat.toFixed(1)}g</Text>
            <Text style={styles.nutritionLabel}>fats</Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionValue}>
              {result.fiber.toFixed(1)}g
            </Text>
            <Text style={styles.nutritionLabel}>fiber</Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionValue}>
              {result.sugar.toFixed(1)}g
            </Text>
            <Text style={styles.nutritionLabel}>sugar</Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionValue}>
              {result.sodium.toFixed(1)}mg
            </Text>
            <Text style={styles.nutritionLabel}>sodium</Text>
          </View>
        </View>
      )}
      <Text style={styles.summaryHeader}>Weekly Nutrition Summary</Text>
      {/* <View style={styles.weeklySummary}>
        <Text style={styles.summaryText}>
          Calories: {weeklyNutrition.calories.toFixed(1)} (
          {weeklyNutrition.isLow
            ? "Low"
            : weeklyNutrition.isHigh
            ? "High"
            : "Normal"}
          )
        </Text>
        <Text style={styles.summaryText}>
          Protein: {weeklyNutrition.protein.toFixed(1)}g (
          {weeklyNutrition.isLow
            ? "Low"
            : weeklyNutrition.isHigh
            ? "High"
            : "Normal"}
          )
        </Text>
        <Text style={styles.summaryText}>
          Fat: {weeklyNutrition.fat.toFixed(1)}g (
          {weeklyNutrition.isLow
            ? "Low"
            : weeklyNutrition.isHigh
            ? "High"
            : "Normal"}
          )
        </Text>
        <Text style={styles.summaryText}>
          Carbohydrates: {weeklyNutrition.carbohydrates.toFixed(1)}g (
          {weeklyNutrition.isLow
            ? "Low"
            : weeklyNutrition.isHigh
            ? "High"
            : "Normal"}
          )
        </Text>
        <Text style={styles.summaryText}>
          Fiber: {weeklyNutrition.fiber.toFixed(1)}g (
          {weeklyNutrition.isLow
            ? "Low"
            : weeklyNutrition.isHigh
            ? "High"
            : "Normal"}
          )
        </Text>
        <Text style={styles.summaryText}>
          Sugar: {weeklyNutrition.sugar.toFixed(1)}g (
          {weeklyNutrition.isLow
            ? "Low"
            : weeklyNutrition.isHigh
            ? "High"
            : "Normal"}
          )
        </Text>
        <Text style={styles.summaryText}>
          Sodium: {weeklyNutrition.sodium.toFixed(1)}mg (
          {weeklyNutrition.isLow
            ? "Low"
            : weeklyNutrition.isHigh
            ? "High"
            : "Normal"}
          )
        </Text>
      </View> */}
      <View style={styles.nutritionSummary}>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionValue}>
            {weeklyNutrition.carbohydrates.toFixed(1)}g
          </Text>
          <Text style={styles.nutritionLabel}>carbs</Text>
          <Text style={styles.nutritionLabel}>
            {weeklyNutrition.isLow
              ? "Low"
              : weeklyNutrition.isHigh
              ? "High"
              : "Normal"}
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionValue}>
            {weeklyNutrition.protein.toFixed(1)}g
          </Text>
          <Text style={styles.nutritionLabel}>proteins</Text>
          <Text style={styles.nutritionLabel}>
            {weeklyNutrition.isLow
              ? "Low"
              : weeklyNutrition.isHigh
              ? "High"
              : "Normal"}
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionValue}>{weeklyNutrition.calories}</Text>
          <Text style={styles.nutritionLabel}>Kcal</Text>
          <Text style={styles.nutritionLabel}>
            {weeklyNutrition.isLow
              ? "Low"
              : weeklyNutrition.isHigh
              ? "High"
              : "Normal"}
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionValue}>
            {weeklyNutrition.fat.toFixed(1)}g
          </Text>
          <Text style={styles.nutritionLabel}>fats</Text>
          <Text style={styles.nutritionLabel}>
            {weeklyNutrition.isLow
              ? "Low"
              : weeklyNutrition.isHigh
              ? "High"
              : "Normal"}
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionValue}>
            {weeklyNutrition.fiber.toFixed(1)}g
          </Text>
          <Text style={styles.nutritionLabel}>fiber</Text>
          <Text style={styles.nutritionLabel}>
            {weeklyNutrition.isLow
              ? "Low"
              : weeklyNutrition.isHigh
              ? "High"
              : "Normal"}
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionValue}>
            {weeklyNutrition.sugar.toFixed(1)}g
          </Text>
          <Text style={styles.nutritionLabel}>sugar</Text>
          <Text style={styles.nutritionLabel}>
            {weeklyNutrition.isLow
              ? "Low"
              : weeklyNutrition.isHigh
              ? "High"
              : "Normal"}
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionValue}>
            {weeklyNutrition.sodium.toFixed(1)}mg
          </Text>
          <Text style={styles.nutritionLabel}>sodium</Text>
          <Text style={styles.nutritionLabel}>
            {weeklyNutrition.isLow
              ? "Low"
              : weeklyNutrition.isHigh
              ? "High"
              : "Normal"}
          </Text>
        </View>
      </View>
      <Text style={styles.summaryHeader}>view daily Nutrition Summary</Text>

      <FlatList
        data={dailyMeals}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.nutritionSummary}>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>
                {item.carbohydrates.toFixed(1)}g
              </Text>
              <Text style={styles.nutritionLabel}>carbs</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>
                {item.protein.toFixed(1)}g
              </Text>
              <Text style={styles.nutritionLabel}>proteins</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>{item.calories}</Text>
              <Text style={styles.nutritionLabel}>Kcal</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>{item.fat.toFixed(1)}g</Text>
              <Text style={styles.nutritionLabel}>fats</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>
                {item.fiber.toFixed(1)}g
              </Text>
              <Text style={styles.nutritionLabel}>fiber</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>
                {item.sugar.toFixed(1)}g
              </Text>
              <Text style={styles.nutritionLabel}>sugar</Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>
                {item.sodium.toFixed(1)}mg
              </Text>
              <Text style={styles.nutritionLabel}>sodium</Text>
            </View>
          </View>
        )}
      />
      <StatusBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "white",
  },
  input: {
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "white",
  },
  foodChips: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  foodChip: {
    backgroundColor: "#E0E0E0",
    padding: 8,
    borderRadius: 16,
  },
  foodChipText: {
    fontSize: 14,
    color: "#000",
  },
  checkButton: {
    backgroundColor: "#28A745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  checkButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  summaryHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "white",
    textAlign: "center",
  },
  summaryDescription: {
    fontSize: 14,
    marginBottom: 8,
    color: "white",
    textAlign: "center",
  },
  nutritionSummary: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    backgroundColor: "#28A745",
    borderRadius: 6,
    padding: 3,
  },
  nutritionRow: {
    alignItems: "center",
  },
  nutritionValue: {
    fontSize: 12,
    color: "white",
  },
  nutritionLabel: {
    fontSize: 14,
    color: "white",
  },
  weeklySummary: {
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 4,
  },
  mealItem: {
    padding: 8,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  mealText: {
    fontSize: 14,
  },
});
