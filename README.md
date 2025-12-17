# 🍽️ Meal Planner - Recipe Application

A mobile application that fetches recipes from TheMealDB API based on ingredients available in the user's fridge and automatically creates a shopping list for missing ingredients.

## 📱 Features

- ✅ **Ingredient Management**: Add and remove ingredients in your fridge
- 🔍 **Smart Recipe Search**: Finds recipes that best match your available ingredients
- 📊 **Match Percentage**: Shows how many percent of recipe ingredients you have
- 🛒 **Automatic Shopping List**: Generates a list of missing ingredients
- ⭐ **Favorites**: Save your favorite recipes for later use
- 💾 **Data Persistence**: AsyncStorage saves ingredients and favorites

## 🚀 Installation and Usage

### Requirements
- Node.js
- Expo CLI
- Expo Go app (iOS/Android)

### Setup

1. Navigate to project folder:
```bash
cd Tehtava7/Meal-planner
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the application:
```bash
npx expo start
```

4. Scan the QR code with Expo Go app

## 📖 User Guide

1. **Add Ingredients**:
   - Type an ingredient in the text field (e.g., "chicken", "rice", "cream")
   - Press the "+" button or Enter
   - Ingredients appear as blue chips

2. **Search Recipes**:
   - Press the "🔍 Search Recipes" button
   - The app searches for recipes containing your added ingredients
   - Recipes are sorted by match percentage (best match first)

3. **View Recipes**:
   - Tap a recipe card to see ingredients and instructions
   - Green ✅ = you have it, Red ❌ = missing

4. **Create Shopping List**:
   - Press the "🛒 Shopping List" button under the recipe
   - See all missing ingredients listed

5. **Save as Favorite**:
   - Press the "⭐ Favorite" button
   - View all favorites with the "⭐ Favorites" button

## 🏗️ Project Structure

```
Meal-planner/
├── App.tsx                          # Main application
├── types.ts                         # TypeScript types
├── services/
│   └── mealApi.ts                   # TheMealDB API integration
├── components/
│   ├── IngredientInput.tsx          # Ingredient input
│   ├── RecipeCard.tsx               # Recipe card
│   └── ShoppingList.tsx             # Shopping list modal
└── package.json                     # Dependencies
```

## 🔧 Technical Details

### Technologies Used
- **React Native** + **Expo**: Mobile application framework
- **TypeScript**: Typed JavaScript
- **TheMealDB API**: Free recipe API
- **AsyncStorage**: Local data storage

### API
- **TheMealDB**: https://www.themealdb.com/api.php
- No API key or registration required
- Free to use

### Functionality Logic


1. **Recipe Search**:
   - Searches recipes using the user's first ingredient
   - Fetches detailed information for each recipe
   - Calculates match percentage based on user's ingredients

2. **Match Percentage**:
   ```
   Match % = (Available Ingredients / Total Ingredients) × 100
   ```

3. **Shopping List**:
   - Filters recipe ingredients
   - Shows only those the user doesn't have

## 📝 Functional Features

### Assignment Requirements ✅

1. ✅ **Data Fetching from Open API**: TheMealDB
2. ✅ **Ingredient Input**: User can add ingredients
3. ✅ **Recipe Search**: Fetches recipes from API
4. ✅ **Match Calculation**: Calculates how many ingredients are available
5. ✅ **Sorting**: Recipes are sorted by match percentage
6. ✅ **Shopping List**: Generates a list of missing ingredients
7. ✅ **Favorites**: Save and manage favorite recipes
8. ✅ **Local Storage**: AsyncStorage persists data

### Additional Features 🌟

- Recipe category and country of origin
- Visual match percentage with colors (green/yellow/red)
- Modal-based shopping list
- Detailed recipe instructions
- Recipe images

## 🎓 Course Context

This application fulfills the requirements for the "Web and Hybrid Technologies in Mobile Programming" course assignment:

- ✅ Fetches data from an open API (TheMealDB)
- ✅ Contains functional logic (match calculation, shopping list)
- ✅ Not just data display but calculates and processes information
- ✅ TypeScript implementation
- ✅ React Native/Expo
- ✅ Uses JSON from API

