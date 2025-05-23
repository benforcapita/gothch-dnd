import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
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
  updatePreferences,
  logout,
} from '../store/slices/userSlice';
import { selectCollectionCount, selectCollectionByRarity } from '../store/slices/miniatureSlice';
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
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked_at?: string;
  };
}

interface SettingRowProps {
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  icon: string;
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

  const [showAllAchievements, setShowAllAchievements] = useState<boolean>(false);

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

  const handlePreferenceToggle = (
    preference: keyof UserPreferences,
    value: boolean
  ): void => {
    dispatch(updatePreferences({ [preference]: value }));
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
          {achievement.unlocked_at && (
            <Text style={styles.achievementDate}>
              Unlocked: {new Date(achievement.unlocked_at).toLocaleDateString()}
            </Text>
          )}
        </View>
      </LinearGradient>
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

  // Mock achievements for demonstration
  const mockAchievements = [
    {
      id: '1',
      name: 'First Collection',
      description: 'Add your first miniature to the collection',
      icon: 'collections-bookmark',
      unlocked_at: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      name: 'Battle Veteran',
      description: 'Win 10 battles',
      icon: 'emoji-events',
      unlocked_at: '2024-01-20T14:20:00Z',
    },
    {
      id: '3',
      name: 'Legendary Hunter',
      description: 'Collect a legendary miniature',
      icon: 'star',
    },
  ];

  const displayAchievements = achievements.length > 0 ? achievements : mockAchievements;
  const visibleAchievements = showAllAchievements ? displayAchievements : displayAchievements.slice(0, 3);

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
          <Text style={styles.username}>{user?.username || 'Guest User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'guest@example.com'}</Text>
          
          {/* Level Info */}
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Level {userLevel}</Text>
            <View style={styles.experienceBar}>
              <View style={[styles.experienceProgress, { width: `${levelProgress}%` }]} />
            </View>
            <Text style={styles.experienceText}>
              {userExperience} XP • {Math.round(levelProgress)}% to next level
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <StatCard
              label="Miniatures"
              value={collectionCount || 3} // Use mock data if empty
              icon="collections-bookmark"
              color={colors.info}
            />
            <StatCard
              label="Battles Won"
              value={battleRecord.won}
              icon="emoji-events"
              color={colors.success}
            />
            <StatCard
              label="Total Battles"
              value={battleRecord.total}
              icon="sports-martial-arts"
              color={colors.warning}
            />
          </View>
        </View>

        {/* Collection Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Collection Summary</Text>
          <View style={styles.collectionSummary}>
            {Object.entries(collectionByRarity).map(([rarity, count]) => (
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
              value={preferences.soundEnabled}
              onToggle={(value) => handlePreferenceToggle('soundEnabled', value)}
              icon="volume-up"
            />
            <SettingRow
              label="Vibration"
              value={preferences.vibrationEnabled}
              onToggle={(value) => handlePreferenceToggle('vibrationEnabled', value)}
              icon="vibration"
            />
            <SettingRow
              label="Notifications"
              value={preferences.notifications}
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
});

export default ProfileScreen; 