import React, { useState, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onGenerateShoppingList: (recipe: Recipe) => void;
  onToggleFavorite: (recipe: Recipe) => void;
  isFavorite: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onGenerateShoppingList,
  onToggleFavorite,
  isFavorite,
}) => {
  const [expanded, setExpanded] = useState(false);

  const missingSet = useMemo(
    () => new Set(recipe.missingIngredients),
    [recipe.missingIngredients]
  );

  const getMatchColor = (percentage: number): string => {
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 50) return '#FF9800';
    return '#f44336';
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Image source={{ uri: recipe.thumbnail }} style={styles.image} />
        
        <View style={styles.header}>
          <Text style={styles.title}>{recipe.name}</Text>
          <View
            style={[
              styles.badge,
              { backgroundColor: getMatchColor(recipe.matchPercentage) },
            ]}
          >
            <Text style={styles.badgeText}>{recipe.matchPercentage}%</Text>
          </View>
        </View>

        <View style={styles.info}>
          <Text style={styles.infoText}>
            📍 {recipe.area} • 🍽️ {recipe.category}
          </Text>
        </View>

        <View style={styles.ingredientSummary}>
          <Text style={styles.summaryText}>
            ✅ {recipe.ingredients.length - recipe.missingIngredients.length} /{' '}
            {recipe.ingredients.length} ingredients available
          </Text>
          <Text style={styles.expandHint}>
            {expanded ? '↑ Tap to collapse' : '↓ Tap to expand'}
          </Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.sectionTitle}>Ingredients:</Text>
          <ScrollView style={styles.ingredientList} nestedScrollEnabled>
            {recipe.ingredients.map((ing, index) => {
              const isMissing = missingSet.has(ing.name);
              return (
                <Text
                  key={`${ing.name}-${index}`}
                  style={[
                    styles.ingredient,
                    isMissing && styles.missingIngredient,
                  ]}
                >
                  {isMissing ? '❌' : '✅'} {ing.measure} {ing.name}
                </Text>
              );
            })}
          </ScrollView>

          <Text style={styles.sectionTitle}>Instructions:</Text>
          <ScrollView style={styles.instructionsScroll} nestedScrollEnabled>
            <Text style={styles.instructions}>{recipe.instructions}</Text>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onGenerateShoppingList(recipe)}
            >
              <Text style={styles.actionButtonText}>🛒 Shopping List</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
              onPress={() => onToggleFavorite(recipe)}
            >
              <Text style={styles.actionButtonText}>{isFavorite ? '★ Saved' : '☆ Favorite'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    color: '#333',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 10,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  info: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  ingredientSummary: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  expandHint: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
  expandedContent: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
    color: '#333',
  },
  ingredientList: {
    maxHeight: 150,
    marginBottom: 10,
  },
  ingredient: {
    fontSize: 14,
    paddingVertical: 3,
    color: '#333',
  },
  missingIngredient: {
    color: '#f44336',
    fontWeight: '500',
  },
  instructionsScroll: {
    maxHeight: 200,
    marginBottom: 15,
  },
  instructions: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  favoriteButton: {
    backgroundColor: '#FF9800',
  },
  favoriteButtonActive: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
