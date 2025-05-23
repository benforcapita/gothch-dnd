import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type { User, UserState, UserProfile, UserPreferences, Achievement } from '../../types';

const initialState: UserState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  profile: {
    level: 1,
    experiencePoints: 0,
    battlesWon: 0,
    battlesLost: 0,
    collectibles: 0,
    achievements: [],
  },
  preferences: {
    soundEnabled: true,
    vibrationEnabled: true,
    notifications: true,
    theme: 'dark',
  },
};

interface LoginSuccessPayload {
  user: User;
  token: string;
}

interface BattleStatsUpdate {
  won: boolean;
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<LoginSuccessPayload>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    addExperience: (state, action: PayloadAction<number>) => {
      const exp = action.payload;
      state.profile.experiencePoints += exp;
      
      // Level up calculation (100 XP per level)
      const newLevel = Math.floor(state.profile.experiencePoints / 100) + 1;
      if (newLevel > state.profile.level) {
        state.profile.level = newLevel;
      }
    },
    updateBattleStats: (state, action: PayloadAction<BattleStatsUpdate>) => {
      const { won } = action.payload;
      if (won) {
        state.profile.battlesWon += 1;
      } else {
        state.profile.battlesLost += 1;
      }
    },
    addAchievement: (state, action: PayloadAction<Achievement>) => {
      const achievement = action.payload;
      if (!state.profile.achievements.find(a => a.id === achievement.id)) {
        state.profile.achievements.push(achievement);
      }
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    incrementCollectibles: (state) => {
      state.profile.collectibles += 1;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  addExperience,
  updateBattleStats,
  addAchievement,
  updatePreferences,
  incrementCollectibles,
  setError,
  clearError,
} = userSlice.actions;

// Selectors
export const selectUser = (state: RootState): User | null => state.user.user;
export const selectIsAuthenticated = (state: RootState): boolean => state.user.isAuthenticated;
export const selectUserLevel = (state: RootState): number => state.user.profile.level;
export const selectUserExperience = (state: RootState): number => state.user.profile.experiencePoints;

export const selectBattleRecord = (state: RootState) => ({
  won: state.user.profile.battlesWon,
  lost: state.user.profile.battlesLost,
  total: state.user.profile.battlesWon + state.user.profile.battlesLost,
});

export const selectUserAchievements = (state: RootState): Achievement[] => state.user.profile.achievements;

export const selectUserPreferences = (state: RootState): UserPreferences => state.user.preferences;

export const selectExperienceToNextLevel = (state: RootState): number => {
  const currentLevel = state.user.profile.level;
  const nextLevelXP = currentLevel * 100;
  const currentXP = state.user.profile.experiencePoints;
  return Math.max(0, nextLevelXP - currentXP);
};

export const selectLevelProgress = (state: RootState): number => {
  const currentLevel = state.user.profile.level;
  const prevLevelXP = (currentLevel - 1) * 100;
  const nextLevelXP = currentLevel * 100;
  const currentXP = state.user.profile.experiencePoints;
  
  if (currentLevel === 1) {
    return (currentXP / 100) * 100;
  }
  
  return ((currentXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100;
};

export default userSlice.reducer; 