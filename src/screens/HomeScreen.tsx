import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Button,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { colors, spacing, typography, shadows } from '@/utils/theme';
import { selectUser, selectUserLevel, selectBattleRecord, selectUserGold, addGold } from '@/store/slices/userSlice';
import { useGetQuestsQuery } from '@/store/api';
import type { MainTabParamList, Quest } from '@/types';

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
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userLevel = useSelector(selectUserLevel);
  const battleRecord = useSelector(selectBattleRecord);
  const userGold = useSelector(selectUserGold);
  const { data: questsData, isLoading, error } = useGetQuestsQuery();

  const handleCompleteQuest = (goldReward: number) => {
    dispatch(addGold(goldReward));
  };

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

  const renderQuestItem = ({ item }: { item: Quest }) => (
    <View style={styles.questItemContainer}>
      <Text style={styles.questTitle}>{item.title}</Text>
      <Text style={styles.questDescription}>{item.description}</Text>
      <Text style={styles.questReward}>Reward: {item.goldReward} Gold</Text>
      <Button 
        title="Complete Quest" 
        onPress={() => handleCompleteQuest(item.goldReward)} 
        color={colors.primary} 
      />
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

      {/* Gold Section */}
      <View style={styles.goldSection}>
        <View style={styles.goldCard}>
          <Icon name="monetization-on" size={32} color={colors.warning} />
          <View style={styles.goldContent}>
            <Text style={styles.goldLabel}>Current Gold</Text>
            <Text style={styles.goldValue}>{userGold}</Text>
          </View>
        </View>
      </View>

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

      {/* Available Quests Section */}
      <View style={styles.questSection}>
        <Text style={styles.sectionTitle}>Available Quests</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : error ? (
          <Text style={styles.errorText}>Error loading quests. Please try again later.</Text>
        ) : questsData && questsData.data && questsData.data.length > 0 ? (
          <FlatList
            data={questsData.data.slice(0, 3)} // Show only first 3 quests on home
            renderItem={renderQuestItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            style={styles.questList}
          />
        ) : (
          <Text style={styles.noQuestsText}>No quests available at the moment.</Text>
        )}
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
  goldSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  goldCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.warning,
    ...shadows.medium,
  },
  goldContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  goldLabel: {
    ...typography.bodySmall,
    color: colors.text,
    opacity: 0.9,
  },
  goldValue: {
    ...typography.h2,
    color: colors.text,
    fontWeight: 'bold',
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
  questSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  questList: {
    maxHeight: 300,
  },
  questItemContainer: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  questTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  questDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  questReward: {
    ...typography.bodySmall,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  noQuestsText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
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