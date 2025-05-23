import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { colors, spacing, typography, shadows } from '../utils/theme';
import type { BattleStackParamList } from '../types';

type BattleScreenNavigationProp = StackNavigationProp<BattleStackParamList, 'BattleMain'>;

interface ActionButtonProps {
  iconName: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const BattleScreen: React.FC = () => {
  const navigation = useNavigation<BattleScreenNavigationProp>();

  const handleAttack = () => {
    console.log('Attack action selected');
    // Handle attack logic
  };

  const handleHeal = () => {
    console.log('Heal action selected');
    // Handle heal logic
  };

  const handleDefend = () => {
    console.log('Defend action selected');
    // Handle defend logic
  };

  const ActionButton: React.FC<ActionButtonProps> = ({ iconName, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.actionIconContainer}>
        <Icon name={iconName} size={28} color={colors.text} />
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=1000'
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Battle</Text>
          </View>

          {/* Battle Scene */}
          <View style={styles.battleScene}>
            {/* This would contain the battle visualization */}
          </View>

          {/* Your Turn Section */}
          <View style={styles.turnSection}>
            <Text style={styles.turnTitle}>Your Turn</Text>
            
            <View style={styles.actionsContainer}>
              <ActionButton
                iconName="local-grocery-store"
                title="Sword Slash"
                subtitle="Attack"
                onPress={handleAttack}
              />
              
              <ActionButton
                iconName="favorite"
                title="Healing Potion"
                subtitle="Heal"
                onPress={handleHeal}
              />
              
              <ActionButton
                iconName="shield"
                title="Shield Block"
                subtitle="Defend"
                onPress={handleDefend}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 27, 42, 0.7)', // Dark overlay to maintain readability
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
  },
  battleScene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  turnSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  turnTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  actionsContainer: {
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    ...shadows.medium,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  actionSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
});

export default BattleScreen; 