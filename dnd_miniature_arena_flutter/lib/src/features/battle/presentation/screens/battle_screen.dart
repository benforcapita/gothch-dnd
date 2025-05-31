import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dnd_miniature_arena_flutter/src/features/battle/application/battle_provider.dart';
import 'package:dnd_miniature_arena_flutter/src/features/battle/domain/battle_models.dart';
import 'package:go_router/go_router.dart';

class BattleScreen extends ConsumerWidget {
  const BattleScreen({super.key});

  Widget _buildParticipantCard(BuildContext context, BattleParticipant participant, bool isCurrentTurn) {
    final theme = Theme.of(context);
    return Card(
      elevation: isCurrentTurn ? 6.0 : 2.0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12.0),
        side: isCurrentTurn ? BorderSide(color: theme.colorScheme.primary, width: 2) : BorderSide.none,
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text(participant.playerId == 'player1' ? 'Player 1' : 'Player 2', style: theme.textTheme.headlineSmall),
            const SizedBox(height: 12),
            Image.asset(
              participant.miniature.imageUrl,
              height: 100,
              errorBuilder: (c, o, s) => Icon(Icons.shield_outlined, size: 100, color: theme.colorScheme.error),
            ),
            const SizedBox(height: 12),
            Text(participant.miniature.name, style: theme.textTheme.titleLarge),
            const SizedBox(height: 8),
            Chip(
              label: Text('HP: ${participant.currentHp} / ${participant.miniature.currentHp}', style: theme.textTheme.titleMedium),
              backgroundColor: theme.colorScheme.surfaceVariant,
            ),
            if (isCurrentTurn) ...[
              const SizedBox(height: 10),
              Chip(
                label: Text('Current Turn', style: TextStyle(color: theme.colorScheme.onPrimary)),
                backgroundColor: theme.colorScheme.primary,
                padding: const EdgeInsets.symmetric(horizontal: 8),
              )
            ]
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final battleState = ref.watch(battleProvider);
    final battleNotifier = ref.read(battleProvider.notifier);
    final theme = Theme.of(context);

    if (battleState == null || battleState.status == BattleStatus.setup) {
      return Scaffold(
        appBar: AppBar(title: const Text('Battle Arena')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('No active battle or battle is in setup.', style: TextStyle(fontSize: 18)),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  // For simplicity, player 1 always picks the first available miniature.
                  // In a real app, player 1 would select their miniature before this point.
                  final availableMinis = battleNotifier.getAvailableMiniaturesForSetup();
                  if (availableMinis.isNotEmpty) {
                    battleNotifier.startNewBattleSetup(availableMinis.first);
                    context.go('/battle/setup');
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('No miniatures available to start a battle.')));
                  }
                },
                child: const Text('Setup New Battle'),
              ),
            ],
          ),
        ),
      );
    }

    if (battleState.status == BattleStatus.finished) {
      return Scaffold(
        appBar: AppBar(title: const Text('Battle Over')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Battle Over!',
                style: theme.textTheme.headlineMedium?.copyWith(color: theme.colorScheme.primary),
              ),
              const SizedBox(height: 20),
              Text(
                'Winner: ${battleState.winnerPlayerId ?? 'Unknown'}',
                style: theme.textTheme.headlineSmall,
              ),
              const SizedBox(height: 40),
              ElevatedButton(
                onPressed: () {
                  battleNotifier.endBattle();
                   // Optionally navigate home or to setup
                  context.go('/home');
                },
                child: const Text('End Battle & Go Home'),
              ),
            ],
          ),
        ),
      );
    }

    // Ongoing Battle
    final player1 = battleState.participants.firstWhere((p) => p.playerId == 'player1');
    final player2 = battleState.participants.firstWhere((p) => p.playerId == 'player2');
    final bool isPlayer1Turn = battleState.currentTurnPlayerId == 'player1';

    return Scaffold(
      appBar: AppBar(
        title: Text('Battle Arena - Turn: ${battleState.currentTurnPlayerId}'),
        backgroundColor: theme.colorScheme.surfaceContainerHighest,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Expanded(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(child: _buildParticipantCard(context, player1, isPlayer1Turn)),
                  const SizedBox(width: 16),
                  Expanded(child: _buildParticipantCard(context, player2, !isPlayer1Turn)),
                ],
              ),
            ),
            const SizedBox(height: 20),
            if (battleState.status == BattleStatus.ongoing)
              ElevatedButton.icon(
                icon: const Icon(Icons.bolt), // Sword icon or similar for attack
                label: Text(isPlayer1Turn ? 'Player 1 Attack Player 2' : 'Player 2 Attack Player 1'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  textStyle: theme.textTheme.titleLarge,
                  backgroundColor: theme.colorScheme.primary,
                  foregroundColor: theme.colorScheme.onPrimary,
                ),
                onPressed: () {
                  if (isPlayer1Turn) {
                    battleNotifier.performMockAttack('player1', 'player2');
                  } else {
                    battleNotifier.performMockAttack('player2', 'player1');
                  }
                },
              ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
