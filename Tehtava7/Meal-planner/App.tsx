import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IngredientInput } from './components/IngredientInput';
import { RecipeCard } from './components/RecipeCard';
import { ShoppingList } from './components/ShoppingList';
import { searchRecipesByIngredients } from './services/mealApi';
import { UserIngredient, Recipe } from './types';

const STORAGE_KEY_INGREDIENTS = '@meal_planner_ingredients';
const STORAGE_KEY_FAVORITES = '@meal_planner_favorites';

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
};

export default function App() {
  const [userIngredients, setUserIngredients] = useState<UserIngredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  // Lataa tallennetut ainekset ja suosikit sovelluksen käynnistyessä
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedIngredients = await AsyncStorage.getItem(STORAGE_KEY_INGREDIENTS);
      const storedFavorites = await AsyncStorage.getItem(STORAGE_KEY_FAVORITES);
      
      setUserIngredients(safeParse<UserIngredient[]>(storedIngredients, []));
      setFavorites(safeParse<Recipe[]>(storedFavorites, []));
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  const saveIngredients = async (ingredients: UserIngredient[]) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_INGREDIENTS,
        JSON.stringify(ingredients)
      );
    } catch (error) {
      console.error('Error saving ingredients:', error);
    }
  };

  const saveFavorites = async (favs: Recipe[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favs));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const handleAddIngredient = (ingredient: UserIngredient) => {
    const name = ingredient.name.trim().toLowerCase();
    const exists = userIngredients.some(i => i.name.trim().toLowerCase() === name);
    if (exists) {
      Alert.alert('Already added', `"${ingredient.name}" is already in your list.`);
      return;
    }

    const updated = [...userIngredients, { ...ingredient, name }];
    setUserIngredients(updated);
    saveIngredients(updated);
  };

  const handleRemoveIngredient = (id: string) => {
    const updated = userIngredients.filter((ing) => ing.id !== id);
    setUserIngredients(updated);
    saveIngredients(updated);
  };

  const handleSearchRecipes = async () => {
    if (userIngredients.length === 0) {
      Alert.alert(
        'No Ingredients',
        'Please add ingredients from your fridge first to search for recipes.'
      );
      return;
    }

    setLoading(true);
    setShowFavorites(false);
    setShowShoppingList(false);
    setSelectedRecipe(null);
    
    try {
      const ingredientNames = userIngredients.map((ing) => ing.name);
      const results = await searchRecipesByIngredients(ingredientNames);
      setRecipes(results);
      
      if (results.length === 0) {
        Alert.alert(
          'No Results',
          'Unfortunately we could not find recipes with these ingredients. Try adding more ingredients!'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch recipes. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateShoppingList = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowShoppingList(true);
  };

  const handleToggleFavorite = (recipe: Recipe) => {
    const exists = favorites.some((fav) => fav.id === recipe.id);
    const updated = exists
      ? favorites.filter((fav) => fav.id !== recipe.id)
      : [...favorites, recipe];

    setFavorites(updated);
    saveFavorites(updated);
  };

  const handleRemoveFavorite = (id: string) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this favorite?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updated = favorites.filter((fav) => fav.id !== id);
            setFavorites(updated);
            saveFavorites(updated);
          },
        },
      ]
    );
  };

  const displayedRecipes = showFavorites ? favorites : recipes;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🍽️ Meal Planner</Text>
          <Text style={styles.headerSubtitle}>
            Recipes from your fridge ingredients
          </Text>
        </View>

      <IngredientInput
        ingredients={userIngredients}
        onAddIngredient={handleAddIngredient}
        onRemoveIngredient={handleRemoveIngredient}
      />

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.button, styles.searchButton]}
          onPress={handleSearchRecipes}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '🔍 Searching...' : '🔍 Search Recipes'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.favoriteButton]}
          onPress={() => {
            setShowFavorites(!showFavorites);
            setShowShoppingList(false);
            setSelectedRecipe(null);
          }}
        >
          <Text style={styles.buttonText}>
            {showFavorites ? '📋 Search' : `⭐ Favorites (${favorites.length})`}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Searching for recipes...</Text>
        </View>
      ) : (
        <FlatList
          data={displayedRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <RecipeCard
                recipe={item}
                onGenerateShoppingList={handleGenerateShoppingList}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.some(f => f.id === item.id)}
              />
              {showFavorites && (
                <TouchableOpacity
                  style={styles.removeFavoriteButton}
                  onPress={() => handleRemoveFavorite(item.id)}
                >
                  <Text style={styles.removeFavoriteText}>🗑️ Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {showFavorites
                  ? '⭐ No favorites yet.\nSave recipes to favorites!'
                  : '👋 Add ingredients and search for recipes!'}
              </Text>
            </View>
          }
          contentContainerStyle={
            displayedRecipes.length === 0 ? styles.emptyList : undefined
          }
        />
      )}

      <ShoppingList
        visible={showShoppingList}
        recipe={selectedRecipe}
        onClose={() => setShowShoppingList(false)}
      />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
    opacity: 0.9,
  },
  actionBar: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchButton: {
    backgroundColor: '#2196F3',
  },
  favoriteButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    lineHeight: 28,
  },
  emptyList: {
    flexGrow: 1,
  },
  removeFavoriteButton: {
    marginHorizontal: 15,
    marginTop: -8,
    marginBottom: 8,
    padding: 10,
    backgroundColor: '#f44336',
    borderRadius: 8,
    alignItems: 'center',
  },
  removeFavoriteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

