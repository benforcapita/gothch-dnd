import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { colors, spacing, typography, shadows } from '../utils/theme';
import type { 
  CollectionStackParamList, 
  Miniature, 
  RootState 
} from '../types';

type CollectionScreenNavigationProp = StackNavigationProp<CollectionStackParamList, 'CollectionMain'>;

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.lg * 3) / 2;

interface MiniatureCardProps {
  miniature: Miniature;
  onPress: (miniature: Miniature) => void;
}

const CollectionScreen: React.FC = () => {
  const navigation = useNavigation<CollectionScreenNavigationProp>();
  
  // Mock data for demonstration - this would come from your store
  const mockMiniatures: Miniature[] = useMemo(() => [
    {
      id: '1',
      name: 'Dwarf Fighter',
      size: 'Medium',
      type: 'humanoid',
      challenge_rating: 5,
      rarity: 'uncommon',
      level: 5,
      imageUrl: 'https://via.placeholder.com/200x200/4FC3F7/FFFFFF?text=Dwarf',
      stats: {
        armor_class: 18,
        hit_points: 58,
        speed: { walk: 25 },
        abilities: {
          strength: 16,
          dexterity: 12,
          constitution: 16,
          intelligence: 11,
          wisdom: 13,
          charisma: 10,
        },
      },
      actions: [],
      isFavorited: false,
      acquired_at: '2024-01-15T10:30:00Z',
      times_used_in_battle: 5,
    },
    {
      id: '2',
      name: 'Elf Ranger',
      size: 'Medium',
      type: 'humanoid',
      challenge_rating: 7,
      rarity: 'rare',
      level: 7,
      imageUrl: 'https://via.placeholder.com/200x200/29B6F6/FFFFFF?text=Elf',
      stats: {
        armor_class: 15,
        hit_points: 65,
        speed: { walk: 30 },
        abilities: {
          strength: 14,
          dexterity: 18,
          constitution: 14,
          intelligence: 13,
          wisdom: 16,
          charisma: 12,
        },
      },
      actions: [],
      isFavorited: true,
      acquired_at: '2024-01-10T14:20:00Z',
      times_used_in_battle: 12,
    },
    {
      id: '3',
      name: 'Human Wizard',
      size: 'Medium',
      type: 'humanoid',
      challenge_rating: 9,
      rarity: 'rare',
      level: 9,
      imageUrl: 'https://via.placeholder.com/200x200/0277BD/FFFFFF?text=Wizard',
      stats: {
        armor_class: 12,
        hit_points: 40,
        speed: { walk: 30 },
        abilities: {
          strength: 8,
          dexterity: 14,
          constitution: 12,
          intelligence: 20,
          wisdom: 15,
          charisma: 13,
        },
      },
      actions: [],
      isFavorited: false,
      acquired_at: '2024-01-12T09:15:00Z',
      times_used_in_battle: 3,
    },
    {
      id: '4',
      name: 'Orc Barbarian',
      size: 'Medium',
      type: 'humanoid',
      challenge_rating: 6,
      rarity: 'uncommon',
      level: 6,
      imageUrl: 'https://via.placeholder.com/200x200/4FC3F7/FFFFFF?text=Orc',
      stats: {
        armor_class: 13,
        hit_points: 95,
        speed: { walk: 30 },
        abilities: {
          strength: 20,
          dexterity: 12,
          constitution: 18,
          intelligence: 8,
          wisdom: 11,
          charisma: 9,
        },
      },
      actions: [],
      isFavorited: false,
      acquired_at: '2024-01-08T16:45:00Z',
      times_used_in_battle: 7,
    },
    {
      id: '5',
      name: 'Gnome Rogue',
      size: 'Small',
      type: 'humanoid',
      challenge_rating: 4,
      rarity: 'common',
      level: 4,
      imageUrl: 'https://via.placeholder.com/200x200/29B6F6/FFFFFF?text=Gnome',
      stats: {
        armor_class: 15,
        hit_points: 35,
        speed: { walk: 25 },
        abilities: {
          strength: 8,
          dexterity: 18,
          constitution: 12,
          intelligence: 14,
          wisdom: 13,
          charisma: 10,
        },
      },
      actions: [],
      isFavorited: true,
      acquired_at: '2024-01-05T11:20:00Z',
      times_used_in_battle: 15,
    },
    {
      id: '6',
      name: 'Dragonborn Paladin',
      size: 'Medium',
      type: 'humanoid',
      challenge_rating: 8,
      rarity: 'epic',
      level: 8,
      imageUrl: 'https://via.placeholder.com/200x200/0277BD/FFFFFF?text=Dragon',
      stats: {
        armor_class: 20,
        hit_points: 85,
        speed: { walk: 30 },
        abilities: {
          strength: 18,
          dexterity: 10,
          constitution: 16,
          intelligence: 12,
          wisdom: 14,
          charisma: 17,
        },
      },
      actions: [],
      isFavorited: false,
      acquired_at: '2024-01-03T13:30:00Z',
      times_used_in_battle: 4,
    },
  ], []);

  const handleMiniaturePress = (miniature: Miniature): void => {
    navigation.navigate('MiniatureDetail', { miniature });
  };

  const MiniatureCard: React.FC<MiniatureCardProps> = ({ miniature, onPress }) => (
    <TouchableOpacity
      style={styles.miniatureCard}
      onPress={() => onPress(miniature)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: miniature.imageUrl }}
            style={styles.miniatureImage}
            resizeMode="cover"
          />
          <View style={styles.addButton}>
            <Icon name="add" size={20} color={colors.text} />
          </View>
        </View>
        
        <View style={styles.cardInfo}>
          <Text style={styles.miniatureName}>{miniature.name}</Text>
          <Text style={styles.miniatureLevel}>Level {miniature.level}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMiniature = ({ item }: { item: Miniature }) => (
    <MiniatureCard
      miniature={item}
      onPress={handleMiniaturePress}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Miniatures</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockMiniatures}
        renderItem={renderMiniature}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  miniatureCard: {
    width: cardWidth,
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.medium,
  },
  cardContent: {
    padding: spacing.md,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  miniatureImage: {
    width: '100%',
    height: cardWidth * 0.8,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  cardInfo: {
    alignItems: 'flex-start',
  },
  miniatureName: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  miniatureLevel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});

export default CollectionScreen; 