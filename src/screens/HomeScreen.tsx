import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { colors, spacing, typography, shadows } from '@/utils/theme';
import { selectUser, selectUserLevel, selectBattleRecord } from '@/store/slices/userSlice';
import type { MainTabParamList } from '@/types';

type HomeScreenNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Home'>;

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
  gradient: string[];
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const user = useSelector(selectUser);
  const userLevel = useSelector(selectUserLevel);
  const battleRecord = useSelector(selectBattleRecord);

  const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, subtitle, icon, onPress, gradient }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
      <LinearGradient
        colors={gradient}
        style={styles.quickActionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Icon name={icon} size={32} color={colors.text} style={styles.quickActionIcon} />
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => (
    <View style={styles.statCard}>
      <Icon name={icon} size={24} color={colors.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <LinearGradient
        colors={[colors.primary, colors.secondary, colors.background]}
        style={styles.headerBackground}
      >
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.username}>{user?.username || 'Adventurer'}</Text>
          <Text style={styles.levelText}>Level {userLevel} Collector</Text>
        </View>
      </LinearGradient>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Adventure</Text>
        <View style={styles.statsGrid}>
          <StatCard
            label="Miniatures"
            value="12" // TODO: Get from collection
            icon="collections-bookmark"
          />
          <StatCard
            label="Battles Won"
            value={battleRecord.won}
            icon="emoji-events"
          />
          <StatCard
            label="Win Rate"
            value={`${battleRecord.total > 0 ? Math.round((battleRecord.won / battleRecord.total) * 100) : 0}%`}
            icon="trending-up"
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionCard
            title="Scan Miniature"
            subtitle="Add to collection"
            icon="qr-code-scanner"
            gradient={[colors.primary, colors.secondary]}
            onPress={() => navigation.navigate('Scan')}
          />
          <QuickActionCard
            title="Start Battle"
            subtitle="Challenge a friend"
            icon="sports-martial-arts"
            gradient={[colors.tertiary, colors.primary]}
            onPress={() => navigation.navigate('Battle')}
          />
        </View>
        <View style={styles.quickActionsGrid}>
          <QuickActionCard
            title="My Collection"
            subtitle="View miniatures"
            icon="collections-bookmark"
            gradient={[colors.info, colors.tertiary]}
            onPress={() => navigation.navigate('Collection')}
          />
          <QuickActionCard
            title="Battle History"
            subtitle="View past battles"
            icon="history"
            gradient={[colors.success, colors.info]}
            onPress={() => navigation.navigate('Profile')}
          />
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <Icon name="add-circle" size={24} color={colors.success} />
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>New miniature added</Text>
            <Text style={styles.activitySubtitle}>Gloom Stalker Ranger • 2 hours ago</Text>
          </View>
        </View>
        <View style={styles.activityCard}>
          <Icon name="emoji-events" size={24} color={colors.primary} />
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Battle victory!</Text>
            <Text style={styles.activitySubtitle}>Defeated Orc Barbarian • 1 day ago</Text>
          </View>
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
  headerBackground: {
    height: 200,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  username: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  levelText: {
    ...typography.bodySmall,
    color: colors.primary,
    backgroundColor: colors.overlay,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  statsSection: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    ...shadows.small,
  },
  statValue: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.sm,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  quickActionsSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  quickActionCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.medium,
  },
  quickActionGradient: {
    padding: spacing.lg,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  quickActionIcon: {
    marginBottom: spacing.sm,
  },
  quickActionTitle: {
    ...typography.button,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  quickActionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  recentSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    alignItems: 'center',
    ...shadows.small,
  },
  activityContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  activityTitle: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  activitySubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

export default HomeScreen; 