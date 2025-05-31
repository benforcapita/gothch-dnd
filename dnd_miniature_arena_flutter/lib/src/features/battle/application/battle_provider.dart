import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dnd_miniature_arena_flutter/src/features/battle/domain/battle_models.dart';
import 'package:dnd_miniature_arena_flutter/src/features/collection/domain/miniature_model.dart';

class BattleNotifier extends Notifier<Battle?> {
  @override
  Battle? build() {
    return null; // No active battle initially
  }

  // Mock miniatures for selection in setup
  // In a real app, these would come from the user's collection or a general list
  final List<Miniature> _availableMiniaturesForSetup = [
    Miniature(id: 'm1', name: 'Valiant Knight', imageUrl: 'assets/images/placeholder_mini.png', currentHp: 25, description: 'A brave knight in shining armor.'),
    Miniature(id: 'm2', name: 'Goblin Sneak', imageUrl: 'assets/images/placeholder_mini.png', currentHp: 10, description: 'A small but vicious goblin.'),
    Miniature(id: 'm3', name: 'Orc Berserker', imageUrl: 'assets/images/placeholder_mini.png', currentHp: 20, description: 'A furious orc warrior.'),
    Miniature(id: 'm4', name: 'Elf Archer', imageUrl: 'assets/images/placeholder_mini.png', currentHp: 15, description: 'A keen-eyed elf with a longbow.'),
  ];

  List<Miniature> getAvailableMiniaturesForSetup() => _availableMiniaturesForSetup;

  void startNewBattleSetup(Miniature player1Miniature) {
    state = Battle(
      id: 'battle_${DateTime.now().millisecondsSinceEpoch}', // Unique battle ID
      participants: [
        // Player 1's miniature is pre-selected for this setup flow
        BattleParticipant(playerId: 'player1', miniature: player1Miniature, currentHp: player1Miniature.currentHp),
      ],
      status: BattleStatus.setup,
    );
  }

  void addParticipantToSetup(Miniature participantMiniature, String playerId) {
    if (state == null || state!.status != BattleStatus.setup) return;

    // Avoid adding the same player or more than 2 participants for now
    if (state!.participants.any((p) => p.playerId == playerId)) return;
    if (state!.participants.length >= 2) return;


    final newParticipant = BattleParticipant(
        playerId: playerId,
        miniature: participantMiniature,
        currentHp: participantMiniature.currentHp
    );

    state = state!.copyWith(
      participants: [...state!.participants, newParticipant],
    );
  }

  void confirmBattleSetup() {
     if (state == null || state!.participants.length < 2) return; // Need at least two

     state = state!.copyWith(
        status: BattleStatus.ongoing,
        currentTurnPlayerId: state!.participants.first.playerId, // Player 1 starts
     );
  }

  void performMockAttack(String attackerPlayerId, String targetPlayerId) {
    if (state == null || state!.status != BattleStatus.ongoing) return;
    if (state!.currentTurnPlayerId != attackerPlayerId) return; // Not attacker's turn

    final newParticipants = state!.participants.map((p) {
      if (p.playerId == targetPlayerId) {
        // Use a copyWith for BattleParticipant if it becomes more complex
        return p.copyWith(currentHp: (p.currentHp - 5).clamp(0, p.miniature.currentHp)); // Mock 5 damage
      }
      return p;
    }).toList();

    final nextTurnPlayerId = state!.participants.firstWhere((p) => p.playerId != attackerPlayerId).playerId;

    bool isGameOver = newParticipants.any((p) => p.currentHp == 0);
    BattleStatus newStatus = state!.status;
    String? winner;

    if (isGameOver) {
        newStatus = BattleStatus.finished;
        winner = newParticipants.firstWhere((p) => p.currentHp > 0).playerId;
    }

    state = state!.copyWith(
      participants: newParticipants,
      currentTurnPlayerId: isGameOver ? null : nextTurnPlayerId, // Explicitly set to null if game over
      status: newStatus,
      winnerPlayerId: winner, // Explicitly set winner if game over
    );
  }

  void endBattle() {
    state = null;
  }
}

final battleProvider = NotifierProvider<BattleNotifier, Battle?>(BattleNotifier.new);
