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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { foodData, thresholds } from "@/constants/data";

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
        // Perform null/undefined checks before accessing properties
        totalCalories += foodItem.calories || 0;
        totalProtein += foodItem.protein || 0;
        totalFat += foodItem.fat || 0;
        totalCarbs += foodItem.carbohydrates || 0;
        totalFiber += foodItem.fiber || 0;
        totalSugar += foodItem.sugar || 0;
        totalSodium += foodItem.sodium || 0;
      } else {
        console.log(`Food item "${food}" not found in foodData.`);
        // Decide how to handle this case (e.g., skip, log, etc.)
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
      status: {
        calories:
          weeklySummary.calories < thresholds.calories.low
            ? "low"
            : weeklySummary.calories > thresholds.calories.high
            ? "high"
            : "normal",
        protein:
          weeklySummary.protein < thresholds.protein.low
            ? "low"
            : weeklySummary.protein > thresholds.protein.high
            ? "high"
            : "normal",
        fat:
          weeklySummary.fat < thresholds.fat.low
            ? "low"
            : weeklySummary.fat > thresholds.fat.high
            ? "high"
            : "normal",
        carbohydrates:
          weeklySummary.carbohydrates < thresholds.carbohydrates.low
            ? "low"
            : weeklySummary.carbohydrates > thresholds.carbohydrates.high
            ? "high"
            : "normal",
        fiber:
          weeklySummary.fiber < thresholds.fiber.low
            ? "low"
            : weeklySummary.fiber > thresholds.fiber.high
            ? "high"
            : "normal",
        sugar:
          weeklySummary.sugar < thresholds.sugar.low
            ? "low"
            : weeklySummary.sugar > thresholds.sugar.high
            ? "high"
            : "normal",
        sodium:
          weeklySummary.sodium < thresholds.sodium.low
            ? "low"
            : weeklySummary.sodium > thresholds.sodium.high
            ? "high"
            : "normal",
      },
    };
    return { ...weeklySummary, ...overallStatus };
  };

  const weeklyNutrition = calculateWeeklyNutrition();

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
      <Text style={styles.summaryHeader}>Weekly Nutrition Summary</Text>

      <View style={styles.nutritionSummary}>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionValue}>
            {weeklyNutrition.carbohydrates.toFixed(1)}g
          </Text>
          <Text style={styles.nutritionLabel}>carbs</Text>
          <Text style={styles.nutritionLabel}>
            {weeklyNutrition.status.carbohydrates}
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionValue}>
            {weeklyNutrition.protein.toFixed(1)}g
          </Text>
          <Text style={styles.nutritionLabel}>proteins</Text>
          <Text style={styles.nutritionLabel}>
            {weeklyNutrition.status.protein}
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionValue}>{weeklyNutrition.calories}</Text>
          <Text style={styles.nutritionLabel}>Kcal</Text>
          <Text style={styles.nutritionLabel}>
            {weeklyNutrition.status.calories}
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionValue}>
            {weeklyNutrition.fat.toFixed(1)}g
          </Text>
          <Text style={styles.nutritionLabel}>fats</Text>
          <Text style={styles.nutritionLabel}>
            {weeklyNutrition.status.fat}
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionValue}>
            {weeklyNutrition.fiber.toFixed(1)}g
          </Text>
          <Text style={styles.nutritionLabel}>fiber</Text>
          <Text style={styles.nutritionLabel}>
            {weeklyNutrition.status.fiber}
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionValue}>
            {weeklyNutrition.sugar.toFixed(1)}g
          </Text>
          <Text style={styles.nutritionLabel}>sugar</Text>
          <Text style={styles.nutritionLabel}>
            {weeklyNutrition.status.sugar}
          </Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionValue}>
            {weeklyNutrition.sodium.toFixed(1)}mg
          </Text>
          <Text style={styles.nutritionLabel}>sodium</Text>
          <Text style={styles.nutritionLabel}>
            {weeklyNutrition.status.sodium}
          </Text>
        </View>
      </View>

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
                {item.status && item.status.carbohydrates}
              </Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>
                {item.protein.toFixed(1)}g
              </Text>
              <Text style={styles.nutritionLabel}>Proteins</Text>
              <Text style={styles.nutritionLabel}>
                {item.status && item.status.protein}
              </Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>{item.calories}</Text>
              <Text style={styles.nutritionLabel}>Kcal</Text>
              <Text style={styles.nutritionLabel}>
                {item.status && item.status.calories}
              </Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>{item.fat.toFixed(1)}g</Text>
              <Text style={styles.nutritionLabel}>Fats</Text>
              <Text style={styles.nutritionLabel}>
                {item.status && item.status.fat}
              </Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>
                {item.fiber.toFixed(1)}g
              </Text>
              <Text style={styles.nutritionLabel}>Fiber</Text>
              <Text style={styles.nutritionLabel}>
                {item.status && item.status.fiber}
              </Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>
                {item.sugar.toFixed(1)}g
              </Text>
              <Text style={styles.nutritionLabel}>Sugar</Text>
              <Text style={styles.nutritionLabel}>
                {item.status && item.status.sugar}
              </Text>
            </View>
            <View style={styles.nutritionRow}>
              <Text style={styles.nutritionValue}>
                {item.sodium.toFixed(1)}mg
              </Text>
              <Text style={styles.nutritionLabel}>Sodium</Text>
              <Text style={styles.nutritionLabel}>
                {item.status && item.status.sodium}
              </Text>
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
    textAlign: "center",
  },
});
