import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

import { colors, spacing, typography, shadows } from '../utils/theme';
import { favoriteToggle } from '../store/slices/miniatureSlice';
import type { CollectionStackParamList, Miniature } from '../types';

type MiniatureDetailScreenNavigationProp = StackNavigationProp<CollectionStackParamList, 'MiniatureDetail'>;
type MiniatureDetailScreenRouteProp = RouteProp<CollectionStackParamList, 'MiniatureDetail'>;

const MiniatureDetailScreen: React.FC = () => {
  const navigation = useNavigation<MiniatureDetailScreenNavigationProp>();
  const route = useRoute<MiniatureDetailScreenRouteProp>();
  const dispatch = useDispatch();
  
  const { miniature } = route.params;

  const getAbilityModifier = (score: number): string => {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  // Sample data for abilities and lore (would come from API in real app)
  const abilities = [
    {
      name: 'Dread Ambusher',
      description: 'You are a master of ambushing and escaping danger.',
    },
    {
      name: 'Natural Explorer',
      description: 'You gain proficiency in Stealth and Survival.',
    },
    {
      name: 'Spellcasting',
      description: 'You can cast spells like Hunter\'s Mark and Pass Without Trace.',
    },
  ];

  const loreText = `A ranger who has sworn to hunt down creatures of the Underdark, the Gloom Stalker is a formidable foe in the dark. They are masters of stealth and ambush, striking from the shadows with deadly precision.`;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Miniature Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Character Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: miniature.imageUrl }}
            style={styles.characterImage}
            resizeMode="cover"
          />
        </View>

        {/* Character Info */}
        <View style={styles.characterInfo}>
          <Text style={styles.characterName}>{miniature.name}</Text>
          <Text style={styles.characterSubtitle}>
            Level {miniature.level}, {miniature.size} {miniature.type}
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stats</Text>
          
          {/* Ability Scores Grid */}
          <View style={styles.abilitiesGrid}>
            <View style={styles.abilityRow}>
              <View style={styles.abilityItem}>
                <Text style={styles.abilityLabel}>Strength</Text>
                <Text style={styles.abilityValue}>
                  {miniature.stats.abilities.strength} ({getAbilityModifier(miniature.stats.abilities.strength)})
                </Text>
              </View>
              <View style={styles.abilityItem}>
                <Text style={styles.abilityLabel}>Dexterity</Text>
                <Text style={styles.abilityValue}>
                  {miniature.stats.abilities.dexterity} ({getAbilityModifier(miniature.stats.abilities.dexterity)})
                </Text>
              </View>
            </View>
            
            <View style={styles.abilityRow}>
              <View style={styles.abilityItem}>
                <Text style={styles.abilityLabel}>Constitution</Text>
                <Text style={styles.abilityValue}>
                  {miniature.stats.abilities.constitution} ({getAbilityModifier(miniature.stats.abilities.constitution)})
                </Text>
              </View>
              <View style={styles.abilityItem}>
                <Text style={styles.abilityLabel}>Intelligence</Text>
                <Text style={styles.abilityValue}>
                  {miniature.stats.abilities.intelligence} ({getAbilityModifier(miniature.stats.abilities.intelligence)})
                </Text>
              </View>
            </View>
            
            <View style={styles.abilityRow}>
              <View style={styles.abilityItem}>
                <Text style={styles.abilityLabel}>Wisdom</Text>
                <Text style={styles.abilityValue}>
                  {miniature.stats.abilities.wisdom} ({getAbilityModifier(miniature.stats.abilities.wisdom)})
                </Text>
              </View>
              <View style={styles.abilityItem}>
                <Text style={styles.abilityLabel}>Charisma</Text>
                <Text style={styles.abilityValue}>
                  {miniature.stats.abilities.charisma} ({getAbilityModifier(miniature.stats.abilities.charisma)})
                </Text>
              </View>
            </View>
          </View>

          {/* Combat Stats */}
          <View style={styles.combatStatsGrid}>
            <View style={styles.abilityRow}>
              <View style={styles.abilityItem}>
                <Text style={styles.abilityLabel}>Armor Class</Text>
                <Text style={styles.abilityValue}>{miniature.stats.armor_class}</Text>
              </View>
              <View style={styles.abilityItem}>
                <Text style={styles.abilityLabel}>Hit Points</Text>
                <Text style={styles.abilityValue}>{miniature.stats.hit_points}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Abilities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Abilities</Text>
          {abilities.map((ability, index) => (
            <View key={index} style={styles.abilityCard}>
              <Text style={styles.abilityName}>{ability.name}</Text>
              <Text style={styles.abilityDescription}>{ability.description}</Text>
            </View>
          ))}
        </View>

        {/* Lore Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lore</Text>
          <Text style={styles.loreText}>{loreText}</Text>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.card,
  },
  characterImage: {
    width: 250,
    height: 300,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  characterInfo: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  characterName: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  characterSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  abilitiesGrid: {
    marginBottom: spacing.lg,
  },
  abilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  abilityItem: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  abilityLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  abilityValue: {
    ...typography.h4,
    color: colors.text,
  },
  combatStatsGrid: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  abilityCard: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  abilityName: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  abilityDescription: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  loreText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    ...shadows.small,
  },
});

export default MiniatureDetailScreen; 