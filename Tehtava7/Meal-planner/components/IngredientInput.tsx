import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet } from 'react-native';
import { UserIngredient } from '../types';

interface IngredientInputProps {
  ingredients: UserIngredient[];
  onAddIngredient: (ingredient: UserIngredient) => void;
  onRemoveIngredient: (id: string) => void;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const normalized = inputValue.trim().toLowerCase();
    if (!normalized) return;

    const exists = ingredients.some(i => i.name.trim().toLowerCase() === normalized);
    if (exists) {
      // Tyhjennä kenttä mutta älä lisää duplikaattia
      setInputValue('');
      return;
    }

    const newIngredient: UserIngredient = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: normalized,
    };
    onAddIngredient(newIngredient);
    setInputValue('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My ingredients in fridge:</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add ingredient (e.g. chicken, rice...)"
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleAdd}
          autoCapitalize="none"
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={ingredients}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.chip}>
            <Text style={styles.chipText}>{item.name}</Text>
            <TouchableOpacity
              onPress={() => onRemoveIngredient(item.id)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No ingredients added yet</Text>
        }
        contentContainerStyle={ingredients.length === 0 ? styles.emptyListContainer : undefined}
        style={styles.chipList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#4CAF50',
    width: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  chipList: {
    maxHeight: 50,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  chipText: {
    color: '#1976d2',
    fontSize: 14,
    fontWeight: '500',
  },
  removeButton: {
    marginLeft: 6,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#1976d2',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    paddingVertical: 10,
  },
});
