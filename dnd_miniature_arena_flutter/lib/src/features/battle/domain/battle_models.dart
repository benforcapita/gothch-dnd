import 'package:dnd_miniature_arena_flutter/src/features/collection/domain/miniature_model.dart';

class BattleParticipant {
  final String playerId; // 'player1' or 'player2' or actual user ID
  final Miniature miniature;
  int currentHp;
  // TODO: Add other battle-specific stats: initiative, conditions, position on a grid, etc.

  BattleParticipant({
    required this.playerId,
    required this.miniature,
    required this.currentHp,
  });

  BattleParticipant copyWith({
    String? playerId,
    Miniature? miniature,
    int? currentHp,
  }) {
    return BattleParticipant(
      playerId: playerId ?? this.playerId,
      miniature: miniature ?? this.miniature,
      currentHp: currentHp ?? this.currentHp,
    );
  }
}

enum BattleStatus { setup, ongoing, finished }

class Battle {
  final String id;
  final List<BattleParticipant> participants;
  final BattleStatus status;
  final String? currentTurnPlayerId; // Whose turn is it
  final String? winnerPlayerId;

  Battle({
    required this.id,
    required this.participants,
    this.status = BattleStatus.setup,
    this.currentTurnPlayerId,
    this.winnerPlayerId,
  });

  Battle copyWith({
    String? id,
    List<BattleParticipant>? participants,
    BattleStatus? status,
    String? currentTurnPlayerId, // Use Object? to allow explicit null
    String? winnerPlayerId,      // Use Object? to allow explicit null
  }) {
    return Battle(
      id: id ?? this.id,
      participants: participants ?? this.participants,
      status: status ?? this.status,
      currentTurnPlayerId: currentTurnPlayerId ?? this.currentTurnPlayerId,
      winnerPlayerId: winnerPlayerId ?? this.winnerPlayerId,
    );
  }
}
