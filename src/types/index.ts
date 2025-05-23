// Core domain types
export interface Miniature {
  id: string;
  name: string;
  source?: string;
  challenge_rating?: number;
  size: CreatureSize;
  type: CreatureType;
  stats: CreatureStats;
  actions: Action[];
  rarity: Rarity;
  collection_series?: string;
  print_batch?: string;
  verification_hash?: string;
  level?: number;
  image?: any; // For require() image imports
  imageUrl?: string;
  isFavorited?: boolean;
  acquired_at?: string;
  times_used_in_battle?: number;
}

export interface CreatureStats {
  armor_class: number;
  hit_points: number;
  speed: Speed;
  abilities: Abilities;
}

export interface Speed {
  walk: number;
  climb?: number;
  fly?: number;
  swim?: number;
}

export interface Abilities {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Action {
  name: string;
  description: string;
  damage?: DamageRoll;
  attack_bonus?: number;
  save_dc?: number;
  save_ability?: AbilityScore;
  range?: number;
  uses?: number;
  recharge?: string;
}

export interface DamageRoll {
  dice_count: number;
  dice_size: number;
  modifier: number;
  damage_type: DamageType;
}

// Enums and literal types
export type CreatureSize = 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan';
export type CreatureType = 'humanoid' | 'beast' | 'dragon' | 'undead' | 'fiend' | 'celestial' | 'fey' | 'elemental' | 'giant' | 'monstrosity' | 'ooze' | 'plant' | 'construct' | 'aberration';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type AbilityScore = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';
export type DamageType = 'bludgeoning' | 'piercing' | 'slashing' | 'fire' | 'cold' | 'lightning' | 'thunder' | 'acid' | 'poison' | 'radiant' | 'necrotic' | 'psychic' | 'force';

// User types
export interface User {
  id: string;
  username: string;
  email: string;
  created_at?: string;
  last_login?: string;
}

export interface UserProfile {
  level: number;
  experiencePoints: number;
  battlesWon: number;
  battlesLost: number;
  collectibles: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked_at?: string;
}

export interface UserPreferences {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  notifications: boolean;
  theme: 'light' | 'dark';
}

// Battle types
export interface Battle {
  id: string;
  player1_id: string;
  player2_id: string;
  player1_miniature: Miniature;
  player2_miniature: Miniature;
  winner_id?: string;
  battle_log: BattleLogEntry[];
  duration_seconds?: number;
  created_at: string;
  battle_type: BattleType;
  status: BattleStatus;
}

export interface BattleParticipant {
  id: string;
  miniature: Miniature;
  currentHP: number;
  maxHP: number;
  initiative: number;
  conditions: Condition[];
  isPlayer: boolean;
}

export interface BattleLogEntry {
  type: 'initiative' | 'action' | 'damage' | 'heal' | 'condition' | 'battle_end' | 'turn_start';
  message?: string;
  attacker?: string;
  target?: string;
  action?: string;
  result?: ActionResult;
  timestamp: number;
  winner?: string;
  reason?: string;
}

export interface ActionResult {
  hit: boolean;
  damage: number;
  critical?: boolean;
  roll?: number;
  total?: number;
}

export interface Condition {
  name: string;
  description: string;
  duration: number;
  effect: ConditionEffect;
}

export interface ConditionEffect {
  stat_modifiers?: Partial<Abilities>;
  advantage?: string[];
  disadvantage?: string[];
  immunity?: DamageType[];
  resistance?: DamageType[];
  vulnerability?: DamageType[];
}

export type BattleType = 'standard' | 'tournament' | 'practice' | 'ranked';
export type BattleStatus = 'waiting' | 'active' | 'completed' | 'abandoned';

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Collection: undefined;
  Scan: undefined;
  Battle: undefined;
  Profile: undefined;
};

export type CollectionStackParamList = {
  CollectionMain: undefined;
  MiniatureDetail: { miniature: Miniature };
};

export type BattleStackParamList = {
  BattleMain: undefined;
  BattleSetup: { selectedMiniature?: Miniature };
  BattleArena: { battle: Battle };
};

// Redux state types
export interface MiniatureState {
  collection: Miniature[];
  selectedMiniature: Miniature | null;
  filters: {
    rarity: Rarity | 'all';
    type: CreatureType | 'all';
    challengeRating: string;
  };
  searchQuery: string;
  sortBy: 'name' | 'challengeRating' | 'rarity' | 'level';
  isLoading: boolean;
  error: string | null;
}

export interface BattleState {
  currentBattle: string | null;
  battleState: BattleStateType;
  participants: BattleParticipant[];
  currentTurn: number;
  round: number;
  battleLog: BattleLogEntry[];
  selectedAction: Action | null;
  availableActions: Action[];
  turnTimer: number;
  isConnected: boolean;
  roomId: string | null;
  history: Battle[];
  isLoading: boolean;
  error: string | null;
}

export interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  profile: UserProfile;
  preferences: UserPreferences;
}

export type BattleStateType = 
  | 'idle'
  | 'initializing'
  | 'rolling_initiative'
  | 'player_turn'
  | 'selecting_action'
  | 'resolving_action'
  | 'enemy_turn'
  | 'applying_effects'
  | 'checking_win_condition'
  | 'battle_complete'
  | 'paused';

// Root state type for Redux
export interface RootState {
  miniatures: MiniatureState;
  battles: BattleState;
  user: UserState;
  api: any; // RTK Query state
}

// API types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AddMiniatureRequest {
  userId: string;
  miniatureData: Omit<Miniature, 'id'> & {
    verificationHash: string;
    acquisitionMethod: 'qr_scan' | 'purchase' | 'reward';
  };
}

export interface CreateBattleRequest {
  playerId: string;
  miniatureId: string;
  battleType: BattleType;
}

// QR Code types
export interface QRMiniatureData {
  miniature_type: 'dnd_miniature';
  id: string;
  name: string;
  source: string;
  challenge_rating: number;
  size: CreatureSize;
  creature_type: CreatureType;
  stats: CreatureStats;
  actions: Action[];
  rarity: Rarity;
  collection_series: string;
  print_batch: string;
  verification_hash: string;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Component prop types
export interface MiniatureCardProps {
  miniature: Miniature;
  onPress?: (miniature: Miniature) => void;
  onFavoriteToggle?: (miniatureId: string) => void;
  showLevel?: boolean;
  showRarity?: boolean;
}

export interface BattleActionProps {
  action: Action;
  isAvailable: boolean;
  onSelect: (action: Action) => void;
}

export interface StatBlockProps {
  miniature: Miniature;
  showFullStats?: boolean;
}

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  tertiary: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  common: string;
  uncommon: string;
  rare: string;
  epic: string;
  legendary: string;
  playerHP: string;
  enemyHP: string;
  damage: string;
  heal: string;
  overlay: string;
  cardShadow: string;
  border: string;
} 