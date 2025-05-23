import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type { 
  BattleState, 
  BattleStateType, 
  BattleParticipant, 
  BattleLogEntry,
  Action,
  ActionResult,
  Miniature,
  Battle
} from '../../types';

const battleStates: Record<string, BattleStateType> = {
  IDLE: 'idle',
  INITIALIZING: 'initializing',
  ROLLING_INITIATIVE: 'rolling_initiative',
  PLAYER_TURN: 'player_turn',
  SELECTING_ACTION: 'selecting_action',
  RESOLVING_ACTION: 'resolving_action',
  ENEMY_TURN: 'enemy_turn',
  APPLYING_EFFECTS: 'applying_effects',
  CHECKING_WIN_CONDITION: 'checking_win_condition',
  BATTLE_COMPLETE: 'battle_complete',
  PAUSED: 'paused',
};

const initialState: BattleState = {
  currentBattle: null,
  battleState: battleStates.IDLE,
  participants: [],
  currentTurn: 0,
  round: 1,
  battleLog: [],
  selectedAction: null,
  availableActions: [],
  turnTimer: 30,
  isConnected: false,
  roomId: null,
  history: [],
  isLoading: false,
  error: null,
};

interface InitializeBattlePayload {
  player1Miniature: Miniature;
  player2Miniature: Miniature;
  battleId: string;
}

interface ProcessActionPayload {
  attacker: BattleParticipant;
  target: BattleParticipant;
  actionData: Action;
  result: ActionResult;
}

interface EndBattlePayload {
  winner: BattleParticipant | null;
  reason: string;
}

const battleSlice = createSlice({
  name: 'battles',
  initialState,
  reducers: {
    initializeBattle: (state, action: PayloadAction<InitializeBattlePayload>) => {
      const { player1Miniature, player2Miniature, battleId } = action.payload;
      state.currentBattle = battleId;
      state.battleState = battleStates.INITIALIZING;
      state.participants = [
        {
          id: 'player1',
          miniature: player1Miniature,
          currentHP: player1Miniature.stats.hit_points,
          maxHP: player1Miniature.stats.hit_points,
          initiative: 0,
          conditions: [],
          isPlayer: true,
        },
        {
          id: 'player2',
          miniature: player2Miniature,
          currentHP: player2Miniature.stats.hit_points,
          maxHP: player2Miniature.stats.hit_points,
          initiative: 0,
          conditions: [],
          isPlayer: false,
        },
      ];
      state.round = 1;
      state.currentTurn = 0;
      state.battleLog = [];
      state.turnTimer = 30;
    },
    setBattleState: (state, action: PayloadAction<BattleStateType>) => {
      state.battleState = action.payload;
    },
    rollInitiative: (state) => {
      state.participants.forEach(participant => {
        const dexModifier = Math.floor((participant.miniature.stats.abilities.dexterity - 10) / 2);
        participant.initiative = Math.floor(Math.random() * 20) + 1 + dexModifier;
      });
      
      state.participants.sort((a, b) => b.initiative - a.initiative);
      state.battleState = battleStates.PLAYER_TURN;
      state.currentTurn = 0;
      
      state.battleLog.push({
        type: 'initiative',
        message: `Initiative rolled! ${state.participants[0].miniature.name} goes first.`,
        timestamp: Date.now(),
      });
    },
    selectAction: (state, action: PayloadAction<Action>) => {
      state.selectedAction = action.payload;
      state.battleState = battleStates.RESOLVING_ACTION;
    },
    processAction: (state, action: PayloadAction<ProcessActionPayload>) => {
      const { attacker, target, actionData, result } = action.payload;
      
      if (result.hit && result.damage > 0) {
        const participantIndex = state.participants.findIndex(p => p.id === target.id);
        if (participantIndex !== -1) {
          state.participants[participantIndex].currentHP = Math.max(
            0,
            state.participants[participantIndex].currentHP - result.damage
          );
        }
      }
      
      state.battleLog.push({
        type: 'action',
        attacker: attacker.miniature.name,
        target: target.miniature.name,
        action: actionData.name,
        result,
        timestamp: Date.now(),
      });
      
      state.selectedAction = null;
      state.battleState = battleStates.CHECKING_WIN_CONDITION;
    },
    nextTurn: (state) => {
      state.currentTurn = (state.currentTurn + 1) % state.participants.length;
      
      if (state.currentTurn === 0) {
        state.round += 1;
      }
      
      state.battleState = battleStates.PLAYER_TURN;
      state.turnTimer = 30;
    },
    updateTimer: (state, action: PayloadAction<number>) => {
      state.turnTimer = action.payload;
    },
    addLogEntry: (state, action: PayloadAction<Omit<BattleLogEntry, 'timestamp'>>) => {
      state.battleLog.push({
        ...action.payload,
        timestamp: Date.now(),
      });
    },
    setAvailableActions: (state, action: PayloadAction<Action[]>) => {
      state.availableActions = action.payload;
    },
    endBattle: (state, action: PayloadAction<EndBattlePayload>) => {
      const { winner, reason } = action.payload;
      state.battleState = battleStates.BATTLE_COMPLETE;
      state.battleLog.push({
        type: 'battle_end',
        winner: winner?.miniature?.name || 'Unknown',
        reason,
        timestamp: Date.now(),
      });
    },
    resetBattle: (state) => {
      return { ...initialState, history: state.history };
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setRoomId: (state, action: PayloadAction<string | null>) => {
      state.roomId = action.payload;
    },
    addToHistory: (state, action: PayloadAction<Battle>) => {
      state.history.unshift(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  initializeBattle,
  setBattleState,
  rollInitiative,
  selectAction,
  processAction,
  nextTurn,
  updateTimer,
  addLogEntry,
  setAvailableActions,
  endBattle,
  resetBattle,
  setConnected,
  setRoomId,
  addToHistory,
  setLoading,
  setError,
} = battleSlice.actions;

// Selectors
export const selectCurrentParticipant = (state: RootState): BattleParticipant | null => {
  const battle = state.battles;
  if (battle.participants.length === 0) return null;
  return battle.participants[battle.currentTurn];
};

export const selectIsPlayerTurn = (state: RootState): boolean => {
  const currentParticipant = selectCurrentParticipant(state);
  return currentParticipant?.isPlayer || false;
};

export const selectBattleWinner = (state: RootState): BattleParticipant | null => {
  const participants = state.battles.participants;
  const aliveParticipants = participants.filter(p => p.currentHP > 0);
  return aliveParticipants.length === 1 ? aliveParticipants[0] : null;
};

export const selectBattleProgress = (state: RootState) => {
  const participants = state.battles.participants;
  return participants.map(participant => ({
    id: participant.id,
    name: participant.miniature.name,
    currentHP: participant.currentHP,
    maxHP: participant.maxHP,
    hpPercentage: (participant.currentHP / participant.maxHP) * 100,
    isPlayer: participant.isPlayer,
  }));
};

export const selectRecentBattleLog = (state: RootState, count: number = 5): BattleLogEntry[] => {
  return state.battles.battleLog.slice(-count);
};

export { battleStates };
export default battleSlice.reducer; 