import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../types';

interface ShoppingListProps {
  visible: boolean;
  recipe: Recipe | null;
  onClose: () => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
  visible,
  recipe,
  onClose,
}) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadCheckedItems = async () => {
      if (visible && recipe) {
        try {
          const key = `@shopping_list_${recipe.id}`;
          const saved = await AsyncStorage.getItem(key);
          const arr = saved ? (JSON.parse(saved) as string[]) : [];
          setCheckedItems(new Set(arr));
        } catch (error) {
          console.error('Error loading checked items:', error);
          setCheckedItems(new Set());
        }
      }
    };
    loadCheckedItems();
  }, [visible, recipe]);

  if (!recipe) return null;

  const toggleCheck = async (ingredientName: string) => {
    const normalized = ingredientName.toLowerCase().trim();
    const newChecked = new Set(checkedItems);

    if (newChecked.has(normalized)) {
      newChecked.delete(normalized);
    } else {
      newChecked.add(normalized);
    }
    setCheckedItems(newChecked);
    
    try {
      const key = `@shopping_list_${recipe!.id}`;
      await AsyncStorage.setItem(key, JSON.stringify(Array.from(newChecked)));
    } catch (error) {
      console.error('Error saving checked items:', error);
    }
  };

  // Varmistetaan että missingIngredients on array ja uniikit
  const missingItems = Array.from(
    new Set((recipe.missingIngredients ?? []).map(x => x.trim().toLowerCase()))
  );
  const hasItems = missingItems.length > 0;
  const allChecked = hasItems && checkedItems.size === missingItems.length;

  const clearCheckedItems = async () => {
    setCheckedItems(new Set());
    try {
      const key = `@shopping_list_${recipe!.id}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing checked items:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>🛒 Shopping List</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.recipeName}>{recipe.name}</Text>

          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              Missing {missingItems.length} ingredient{missingItems.length !== 1 ? 's' : ''}
              {allChecked && ' - ✅ All done!'}
            </Text>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionText}>
                👆 Tap items to check them off
              </Text>
              {checkedItems.size > 0 && (
                <TouchableOpacity onPress={clearCheckedItems} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>Clear all ✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {hasItems ? (
            <FlatList
              data={missingItems}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              keyExtractor={(item, index) => `ingredient-${index}-${item}`}
              renderItem={({ item: ingredient, index }) => {
                const fullIngredient = recipe.ingredients.find(
                  ing => ing.name.trim().toLowerCase() === ingredient.trim().toLowerCase()
                );
                const isChecked = checkedItems.has(ingredient.trim().toLowerCase());
                
                return (
                  <TouchableOpacity 
                    style={styles.listItem}
                    onPress={() => toggleCheck(ingredient)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.itemNumber}>{index + 1}.</Text>
                    <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                      {isChecked && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <View style={styles.itemContent}>
                      <Text style={[styles.itemText, isChecked && styles.itemTextChecked]}>
                        {fullIngredient?.measure && fullIngredient.measure.trim() !== '' 
                          ? `${fullIngredient.measure} - ` 
                          : ''}
                        {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No items to display</Text>
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                ✅ You have all ingredients!
              </Text>
              <Text style={styles.emptySubtext}>
                You can start cooking right away.
              </Text>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              💡 Tip: Take a screenshot of your shopping list!
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    paddingBottom: 20,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 36,
    color: '#666',
    fontWeight: '300',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    paddingHorizontal: 20,
    marginTop: 5,
  },
  summary: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: '600',
    marginBottom: 5,
  },
  instructionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  clearButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#ff5252',
    borderRadius: 12,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  itemNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginRight: 10,
    minWidth: 25,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemContent: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});
