import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type { Miniature, MiniatureState, Rarity, CreatureType } from '../../types';

const initialState: MiniatureState = {
  collection: [],
  selectedMiniature: null,
  filters: {
    rarity: 'all',
    type: 'all',
    challengeRating: 'all',
  },
  searchQuery: '',
  sortBy: 'name',
  isLoading: false,
  error: null,
};

interface FilterUpdate {
  rarity?: Rarity | 'all';
  type?: CreatureType | 'all';
  challengeRating?: string;
}

const miniatureSlice = createSlice({
  name: 'miniatures',
  initialState,
  reducers: {
    setCollection: (state, action: PayloadAction<Miniature[]>) => {
      state.collection = action.payload;
    },
    addToCollection: (state, action: PayloadAction<Miniature>) => {
      const miniature = action.payload;
      const existingIndex = state.collection.findIndex(m => m.id === miniature.id);
      if (existingIndex === -1) {
        state.collection.push(miniature);
      }
    },
    removeFromCollection: (state, action: PayloadAction<string>) => {
      state.collection = state.collection.filter(m => m.id !== action.payload);
    },
    setSelectedMiniature: (state, action: PayloadAction<Miniature | null>) => {
      state.selectedMiniature = action.payload;
    },
    updateFilters: (state, action: PayloadAction<FilterUpdate>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'challengeRating' | 'rarity' | 'level'>) => {
      state.sortBy = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    favoriteToggle: (state, action: PayloadAction<string>) => {
      const miniatureId = action.payload;
      const miniature = state.collection.find(m => m.id === miniatureId);
      if (miniature) {
        miniature.isFavorited = !miniature.isFavorited;
      }
    },
  },
});

export const {
  setCollection,
  addToCollection,
  removeFromCollection,
  setSelectedMiniature,
  updateFilters,
  setSearchQuery,
  setSortBy,
  setLoading,
  setError,
  favoriteToggle,
} = miniatureSlice.actions;

// Selectors
export const selectFilteredMiniatures = (state: RootState): Miniature[] => {
  let filteredMiniatures = [...state.miniatures.collection];
  
  // Apply search filter
  if (state.miniatures.searchQuery) {
    filteredMiniatures = filteredMiniatures.filter(miniature =>
      miniature.name.toLowerCase().includes(state.miniatures.searchQuery.toLowerCase())
    );
  }
  
  // Apply rarity filter
  if (state.miniatures.filters.rarity !== 'all') {
    filteredMiniatures = filteredMiniatures.filter(miniature =>
      miniature.rarity === state.miniatures.filters.rarity
    );
  }
  
  // Apply type filter
  if (state.miniatures.filters.type !== 'all') {
    filteredMiniatures = filteredMiniatures.filter(miniature =>
      miniature.type === state.miniatures.filters.type
    );
  }
  
  // Apply sorting
  filteredMiniatures.sort((a, b) => {
    switch (state.miniatures.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'challengeRating':
        return (a.challenge_rating || 0) - (b.challenge_rating || 0);
      case 'rarity':
        const rarityOrder: Record<Rarity, number> = { 
          common: 1, 
          uncommon: 2, 
          rare: 3, 
          epic: 4, 
          legendary: 5 
        };
        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
      case 'level':
        return (a.level || 0) - (b.level || 0);
      default:
        return 0;
    }
  });
  
  return filteredMiniatures;
};

export const selectMiniatureById = (state: RootState, id: string): Miniature | undefined => {
  return state.miniatures.collection.find(miniature => miniature.id === id);
};

export const selectCollectionCount = (state: RootState): number => {
  return state.miniatures.collection.length;
};

export const selectCollectionByRarity = (state: RootState): Record<Rarity, number> => {
  const counts: Record<Rarity, number> = {
    common: 0,
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
  };
  
  state.miniatures.collection.forEach(miniature => {
    counts[miniature.rarity]++;
  });
  
  return counts;
};

export default miniatureSlice.reducer; 