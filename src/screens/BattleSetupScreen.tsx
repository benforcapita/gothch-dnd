import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { RadioButton, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

import { colors, spacing, typography, shadows, getRarityColor } from '../utils/theme';
import { initializeBattle } from '../store/slices/battleSlice';
import { selectFilteredMiniatures } from '../store/slices/miniatureSlice';
import type { BattleStackParamList, Miniature, BattleType } from '../types';

type BattleSetupScreenNavigationProp = StackNavigationProp<BattleStackParamList, 'BattleSetup'>;
type BattleSetupScreenRouteProp = RouteProp<BattleStackParamList, 'BattleSetup'>;

interface MiniatureSelectionCardProps {
  miniature: Miniature;
  isSelected: boolean;
  onSelect: (miniature: Miniature) => void;
}

const BattleSetupScreen: React.FC = () => {
  const navigation = useNavigation<BattleSetupScreenNavigationProp>();
  const route = useRoute<BattleSetupScreenRouteProp>();
  const dispatch = useDispatch();
  
  const miniatures = useSelector(selectFilteredMiniatures);
  const [selectedMiniature, setSelectedMiniature] = useState<Miniature | null>(
    route.params?.selectedMiniature || null
  );
  const [battleType, setBattleType] = useState<BattleType>('practice');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Mock enemy miniatures for demonstration
  const mockEnemies: Miniature[] = [
    {
      id: 'enemy-1',
      name: 'Orc Warrior',
      size: 'Medium',
      type: 'humanoid',
      challenge_rating: 2,
      rarity: 'common',
      stats: {
        armor_class: 13,
        hit_points: 15,
        speed: { walk: 30 },
        abilities: {
          strength: 16,
          dexterity: 12,
          constitution: 13,
          intelligence: 7,
          wisdom: 11,
          charisma: 10,
        },
      },
      actions: [
        {
          name: 'Greataxe',
          description: 'Melee weapon attack',
          attack_bonus: 5,
          damage: {
            dice_count: 1,
            dice_size: 12,
            modifier: 3,
            damage_type: 'slashing',
          },
        },
      ],
      level: 2,
    },
    {
      id: 'enemy-2',
      name: 'Goblin Shaman',
      size: 'Small',
      type: 'humanoid',
      challenge_rating: 1,
      rarity: 'uncommon',
      stats: {
        armor_class: 12,
        hit_points: 9,
        speed: { walk: 30 },
        abilities: {
          strength: 8,
          dexterity: 14,
          constitution: 10,
          intelligence: 14,
          wisdom: 15,
          charisma: 11,
        },
      },
      actions: [
        {
          name: 'Fire Bolt',
          description: 'Ranged spell attack',
          attack_bonus: 4,
          damage: {
            dice_count: 1,
            dice_size: 10,
            modifier: 0,
            damage_type: 'fire',
          },
          range: 120,
        },
      ],
      level: 1,
    },
  ];

  const handleStartBattle = (): void => {
    if (!selectedMiniature) {
      Alert.alert('Error', 'Please select a miniature to battle with');
      return;
    }

    setIsLoading(true);

    // Select a random enemy
    const enemy = mockEnemies[Math.floor(Math.random() * mockEnemies.length)];
    const battleId = `battle_${Date.now()}`;

    // Initialize battle in Redux
    dispatch(initializeBattle({
      player1Miniature: selectedMiniature,
      player2Miniature: enemy,
      battleId,
    }));

    setIsLoading(false);

    // Navigate to battle arena (for now, show success message)
    Alert.alert(
      'Battle Starting!',
      `${selectedMiniature.name} vs ${enemy.name}`,
      [
        {
          text: 'Ready!',
          onPress: () => {
            // navigation.navigate('BattleArena', { battleId });
            Alert.alert('Coming Soon', 'Battle arena implementation in progress!');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const MiniatureSelectionCard: React.FC<MiniatureSelectionCardProps> = ({ 
    miniature, 
    isSelected, 
    onSelect 
  }) => (
    <TouchableOpacity
      style={[styles.miniatureCard, isSelected && styles.selectedCard]}
      onPress={() => onSelect(miniature)}
    >
      <LinearGradient
        colors={isSelected ? [colors.primary, colors.secondary] : [colors.surface, colors.card]}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(miniature.rarity) }]}>
            <Text style={styles.rarityText}>{miniature.rarity.toUpperCase()}</Text>
          </View>
          {isSelected && (
            <Icon name="check-circle" size={20} color={colors.text} />
          )}
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.miniatureName} numberOfLines={2}>
            {miniature.name}
          </Text>
          <Text style={styles.miniatureType}>
            {miniature.size} {miniature.type}
          </Text>
          <Text style={styles.challengeRating}>
            CR {miniature.challenge_rating || 'Unknown'}
          </Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Icon name="favorite" size={14} color={colors.playerHP} />
              <Text style={styles.statText}>{miniature.stats.hit_points} HP</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="security" size={14} color={colors.info} />
              <Text style={styles.statText}>{miniature.stats.armor_class} AC</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderMiniature = ({ item }: { item: Miniature }) => (
    <MiniatureSelectionCard
      miniature={item}
      isSelected={selectedMiniature?.id === item.id}
      onSelect={setSelectedMiniature}
    />
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Battle Setup</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Battle Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Battle Type</Text>
          <View style={styles.battleTypeContainer}>
            {(['practice', 'standard', 'ranked'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.battleTypeOption}
                onPress={() => setBattleType(type)}
              >
                <RadioButton
                  value={type}
                  status={battleType === type ? 'checked' : 'unchecked'}
                  onPress={() => setBattleType(type)}
                  color={colors.primary}
                />
                <View style={styles.battleTypeInfo}>
                  <Text style={styles.battleTypeLabel}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                  <Text style={styles.battleTypeDescription}>
                    {type === 'practice' && 'No rewards, perfect for learning'}
                    {type === 'standard' && 'Moderate rewards, casual play'}
                    {type === 'ranked' && 'High rewards, competitive play'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Miniature Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Fighter</Text>
          {selectedMiniature && (
            <View style={styles.selectedInfo}>
              <Icon name="check-circle" size={20} color={colors.success} />
              <Text style={styles.selectedText}>
                Selected: {selectedMiniature.name}
              </Text>
            </View>
          )}
          
          {miniatures.length > 0 ? (
            <FlatList
              data={miniatures}
              renderItem={renderMiniature}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.miniatureGrid}
            />
          ) : (
            <View style={styles.emptyState}>
              <Icon name="collections-bookmark" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No Miniatures</Text>
              <Text style={styles.emptySubtitle}>
                Add miniatures to your collection to start battling!
              </Text>
            </View>
          )}
        </View>

        {/* Enemy Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Random Opponent</Text>
          <View style={styles.enemyPreview}>
            <Icon name="help" size={48} color={colors.textMuted} />
            <Text style={styles.enemyText}>
              You'll be matched against a random opponent
            </Text>
            <Text style={styles.enemySubtext}>
              Enemy difficulty is balanced based on your selected miniature
            </Text>
          </View>
        </View>

        {/* Start Battle Button */}
        <View style={styles.actionSection}>
          <Button
            mode="contained"
            onPress={handleStartBattle}
            loading={isLoading}
            disabled={!selectedMiniature || isLoading}
            style={styles.startButton}
            buttonColor={colors.primary}
            contentStyle={styles.buttonContent}
          >
            Start Battle
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 20,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  placeholder: {
    width: 48,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  battleTypeContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    ...shadows.small,
  },
  battleTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  battleTypeInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  battleTypeLabel: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  battleTypeDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  selectedText: {
    ...typography.body,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  miniatureGrid: {
    gap: spacing.sm,
  },
  miniatureCard: {
    flex: 1,
    margin: spacing.xs,
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.medium,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  cardGradient: {
    padding: spacing.md,
    minHeight: 180,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  rarityBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rarityText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 10,
  },
  cardContent: {
    flex: 1,
  },
  miniatureName: {
    ...typography.h4,
    color: colors.text,
    fontSize: 16,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  miniatureType: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  challengeRating: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    ...typography.h4,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  enemyPreview: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.small,
  },
  enemyText: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  enemySubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actionSection: {
    marginTop: spacing.lg,
  },
  startButton: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: spacing.md,
  },
});

export default BattleSetupScreen; 