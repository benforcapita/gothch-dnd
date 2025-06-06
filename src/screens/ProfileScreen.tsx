import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Switch, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { colors, spacing, typography, shadows } from '../utils/theme';
import {
  selectUser,
  selectUserLevel,
  selectUserExperience,
  selectBattleRecord,
  selectUserAchievements,
  selectUserPreferences,
  selectLevelProgress,
  selectUserGold,
  updatePreferences,
  logout,
} from '../store/slices/userSlice';
import { selectCollectionCount, selectCollectionByRarity } from '../store/slices/miniatureSlice';
import { useGetUserProfileQuery, useUpdateUserPreferencesMutation } from '../store/api';
import type { MainTabParamList, UserPreferences } from '../types';

type ProfileScreenNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Profile'>;

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}

interface AchievementCardProps {
  achievement: {
    id: string | number;
    name: string;
    description: string;
    icon: string;
    unlocked_at?: string;
    unlockedAt?: string;
  };
}

interface SettingRowProps {
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  icon: string;
}

interface CompletedQuestProps {
  quest: {
    id: string | number;
    title: string;
    description: string;
    goldReward: number;
    completedAt: string;
  };
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const userLevel = useSelector(selectUserLevel);
  const userExperience = useSelector(selectUserExperience);
  const battleRecord = useSelector(selectBattleRecord);
  const achievements = useSelector(selectUserAchievements);
  const preferences = useSelector(selectUserPreferences);
  const levelProgress = useSelector(selectLevelProgress);
  const collectionCount = useSelector(selectCollectionCount);
  const collectionByRarity = useSelector(selectCollectionByRarity);
  const userGold = useSelector(selectUserGold);

  // Fetch user profile data from API
  const { data: profileData, isLoading, error, refetch } = useGetUserProfileQuery(
    user?.id?.toString() || '1', // Use user ID from Redux, fallback to '1' for testing
    { skip: !user?.id }
  );

  const [updateUserPreferencesMutation] = useUpdateUserPreferencesMutation();

  const [showAllAchievements, setShowAllAchievements] = useState<boolean>(false);
  const [showAllQuests, setShowAllQuests] = useState<boolean>(false);

  // Use API data if available, otherwise fall back to Redux state or mock data
  const apiUser = profileData?.data?.user;
  const apiPreferences = profileData?.data?.preferences;
  const apiBattleRecord = profileData?.data?.battleRecord;
  const apiAchievements = profileData?.data?.achievements || [];
  const apiCollectionStats = profileData?.data?.collectionStats;
  const apiCompletedQuests = profileData?.data?.completedQuests || [];
  const apiUserMiniatures = profileData?.data?.userMiniatures || [];

  // Mock completed quests data (fallback)
  const mockCompletedQuests = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first quest',
      goldReward: 50,
      completedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      title: 'Gold Collector',
      description: 'Accumulate 100 gold pieces',
      goldReward: 25,
      completedAt: '2024-01-18T14:20:00Z',
    },
    {
      id: '3',
      title: 'Battle Ready',
      description: 'Win your first battle',
      goldReward: 75,
      completedAt: '2024-01-20T16:45:00Z',
    },
    {
      id: '4',
      title: 'Miniature Master',
      description: 'Collect 5 different miniatures',
      goldReward: 100,
      completedAt: '2024-01-22T09:15:00Z',
    },
  ];

  const handleLogout = (): void => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

  const handlePreferenceToggle = async (
    preference: keyof UserPreferences,
    value: boolean
  ): Promise<void> => {
    // Update local Redux state
    dispatch(updatePreferences({ [preference]: value }));
    
    // Update on server if user is logged in
    if (user?.id) {
      try {
        await updateUserPreferencesMutation({
          userId: user.id.toString(),
          preferences: { [preference]: value }
        }).unwrap();
      } catch (error) {
        console.error('Failed to update preferences:', error);
        // Revert local change if server update fails
        dispatch(updatePreferences({ [preference]: !value }));
      }
    }
  };

  const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color = colors.primary }) => (
    <View style={styles.statCard}>
      <Icon name={icon} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => (
    <View style={styles.achievementCard}>
      <LinearGradient
        colors={[colors.surface, colors.card]}
        style={styles.achievementGradient}
      >
        <Icon name={achievement.icon} size={32} color={colors.primary} />
        <View style={styles.achievementContent}>
          <Text style={styles.achievementName}>{achievement.name}</Text>
          <Text style={styles.achievementDescription}>{achievement.description}</Text>
          {(achievement.unlocked_at || achievement.unlockedAt) && (
            <Text style={styles.achievementDate}>
              Unlocked: {new Date(achievement.unlocked_at || achievement.unlockedAt!).toLocaleDateString()}
            </Text>
          )}
        </View>
      </LinearGradient>
    </View>
  );

  const CompletedQuestCard: React.FC<CompletedQuestProps> = ({ quest }) => (
    <View style={styles.questCard}>
      <View style={styles.questHeader}>
        <Icon name="check-circle" size={24} color={colors.success} />
        <View style={styles.questContent}>
          <Text style={styles.questTitle}>{quest.title}</Text>
          <Text style={styles.questDescription}>{quest.description}</Text>
        </View>
        <View style={styles.questReward}>
          <Text style={styles.goldAmount}>+{quest.goldReward}</Text>
          <Icon name="monetization-on" size={16} color={colors.warning} />
        </View>
      </View>
      <Text style={styles.questCompletedDate}>
        Completed: {new Date(quest.completedAt).toLocaleDateString()}
      </Text>
    </View>
  );

  const SettingRow: React.FC<SettingRowProps> = ({ label, value, onToggle, icon }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Icon name={icon} size={20} color={colors.textSecondary} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        color={colors.primary}
      />
    </View>
  );

  // Show loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Icon name="error" size={48} color={colors.error} />
        <Text style={styles.errorText}>Failed to load profile</Text>
        <Button mode="outlined" onPress={() => refetch()} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  // Use API data or fallback to mock/Redux data
  const displayUser = apiUser || user;
  const displayPreferences = apiPreferences || preferences;
  const displayBattleRecord = apiBattleRecord || battleRecord;
  const displayAchievements = apiAchievements.length > 0 ? apiAchievements : achievements;
  const displayCollectionStats = apiCollectionStats || { count: collectionCount, byRarity: collectionByRarity };
  const displayCompletedQuests = apiCompletedQuests.length > 0 ? apiCompletedQuests : mockCompletedQuests;

  const visibleAchievements = showAllAchievements ? displayAchievements : displayAchievements.slice(0, 3);
  const visibleQuests = showAllQuests ? displayCompletedQuests : displayCompletedQuests.slice(0, 3);

  const totalGoldEarned = displayCompletedQuests.reduce((total, quest) => total + quest.goldReward, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Icon name="person" size={48} color={colors.text} />
          </View>
          <Text style={styles.username}>{displayUser?.username || 'Guest User'}</Text>
          <Text style={styles.userEmail}>{displayUser?.email || 'guest@example.com'}</Text>
          
          {/* Level Info */}
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Level {displayUser?.level || userLevel}</Text>
            <View style={styles.experienceBar}>
              <View style={[styles.experienceProgress, { width: `${displayUser?.levelProgress || levelProgress}%` }]} />
            </View>
            <Text style={styles.experienceText}>
              {displayUser?.experience || userExperience} XP • {Math.round(displayUser?.levelProgress || levelProgress)}% to next level
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Gold Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gold & Wealth</Text>
          <View style={styles.goldContainer}>
            <View style={styles.goldCard}>
              <Icon name="monetization-on" size={32} color={colors.warning} />
              <View style={styles.goldContent}>
                <Text style={styles.goldLabel}>Current Gold</Text>
                <Text style={styles.goldValue}>{displayUser?.gold || userGold}</Text>
              </View>
            </View>
            <View style={styles.goldStatsGrid}>
              <View style={styles.goldStatCard}>
                <Text style={styles.goldStatValue}>{totalGoldEarned}</Text>
                <Text style={styles.goldStatLabel}>Total Earned</Text>
              </View>
              <View style={styles.goldStatCard}>
                <Text style={styles.goldStatValue}>{displayCompletedQuests.length}</Text>
                <Text style={styles.goldStatLabel}>Quests Done</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <StatCard
              label="Miniatures"
              value={displayCollectionStats.count || collectionCount || 3} // Use mock data if empty
              icon="collections-bookmark"
              color={colors.info}
            />
            <StatCard
              label="Battles Won"
              value={displayBattleRecord.won}
              icon="emoji-events"
              color={colors.success}
            />
            <StatCard
              label="Total Battles"
              value={displayBattleRecord.total}
              icon="sports-martial-arts"
              color={colors.warning}
            />
          </View>
        </View>

        {/* Completed Quests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Completed Quests</Text>
            <TouchableOpacity onPress={() => setShowAllQuests(!showAllQuests)}>
              <Text style={styles.viewAllButton}>
                {showAllQuests ? 'Show Less' : 'View All'}
              </Text>
            </TouchableOpacity>
          </View>
          {visibleQuests.map((quest) => (
            <CompletedQuestCard key={quest.id} quest={quest} />
          ))}
        </View>

        {/* Collection Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Collection Summary</Text>
          <View style={styles.collectionSummary}>
            {Object.entries(displayCollectionStats.byRarity || collectionByRarity).map(([rarity, count]) => (
              <View key={rarity} style={styles.rarityRow}>
                <Text style={styles.rarityLabel}>
                  {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                </Text>
                <Text style={styles.rarityCount}>{count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <TouchableOpacity onPress={() => setShowAllAchievements(!showAllAchievements)}>
              <Text style={styles.viewAllButton}>
                {showAllAchievements ? 'Show Less' : 'View All'}
              </Text>
            </TouchableOpacity>
          </View>
          {visibleAchievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsContainer}>
            <SettingRow
              label="Sound Effects"
              value={displayPreferences.soundEnabled}
              onToggle={(value) => handlePreferenceToggle('soundEnabled', value)}
              icon="volume-up"
            />
            <SettingRow
              label="Vibration"
              value={displayPreferences.vibrationEnabled}
              onToggle={(value) => handlePreferenceToggle('vibrationEnabled', value)}
              icon="vibration"
            />
            <SettingRow
              label="Notifications"
              value={displayPreferences.notifications}
              onToggle={(value) => handlePreferenceToggle('notifications', value)}
              icon="notifications"
            />
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            textColor={colors.error}
            buttonColor="transparent"
          >
            Logout
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
  header: {
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  username: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  levelContainer: {
    alignItems: 'center',
    width: '100%',
  },
  levelText: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  experienceBar: {
    width: '80%',
    height: 8,
    backgroundColor: colors.overlay,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  experienceProgress: {
    height: '100%',
    backgroundColor: colors.text,
    borderRadius: 4,
  },
  experienceText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  viewAllButton: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  goldContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    ...shadows.small,
  },
  goldCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  goldContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  goldLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  goldValue: {
    ...typography.h2,
    color: colors.text,
    fontWeight: 'bold',
  },
  goldStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  goldStatCard: {
    alignItems: 'center',
  },
  goldStatValue: {
    ...typography.h3,
    color: colors.warning,
    fontWeight: 'bold',
  },
  goldStatLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  questCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    ...shadows.small,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  questContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  questTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  questDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  questReward: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goldAmount: {
    ...typography.bodySmall,
    color: colors.warning,
    fontWeight: 'bold',
    marginRight: spacing.xs,
  },
  questCompletedDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
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
  collectionSummary: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    ...shadows.small,
  },
  rarityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rarityLabel: {
    ...typography.body,
    color: colors.text,
  },
  rarityCount: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  achievementCard: {
    marginBottom: spacing.sm,
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.small,
  },
  achievementGradient: {
    flexDirection: 'row',
    padding: spacing.md,
    alignItems: 'center',
  },
  achievementContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  achievementName: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  achievementDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  achievementDate: {
    ...typography.caption,
    color: colors.primary,
  },
  settingsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    ...shadows.small,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    ...typography.body,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  logoutButton: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    marginBottom: spacing.md,
  },
  retryButton: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
});

export default ProfileScreen; 