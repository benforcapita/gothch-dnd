import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dnd_miniature_arena_flutter/src/features/battle/application/battle_provider.dart';
import 'package:dnd_miniature_arena_flutter/src/features/battle/domain/battle_models.dart';
import 'package:dnd_miniature_arena_flutter/src/features/collection/domain/miniature_model.dart'; // For Miniature type
import 'package:go_router/go_router.dart';

class BattleSetupScreen extends ConsumerWidget {
  const BattleSetupScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final battleState = ref.watch(battleProvider);
    final battleNotifier = ref.read(battleProvider.notifier);
    final availableOpponents = battleNotifier.getAvailableMiniaturesForSetup();
    final theme = Theme.of(context);

    if (battleState == null || battleState.status != BattleStatus.setup) {
      // This screen should ideally only be reached when a battle is being set up.
      // If not, offer to start a new setup.
      return Scaffold(
        appBar: AppBar(title: const Text('Setup Battle')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('No battle setup in progress.'),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  // For simplicity, let's assume player 1 always picks the first available miniature.
                  // In a real app, player 1 would select their miniature before reaching this screen.
                  if (availableOpponents.isNotEmpty) {
                    battleNotifier.startNewBattleSetup(availableOpponents.first);
                  } else {
                     ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('No miniatures available to start a battle.'))
                     );
                  }
                },
                child: const Text('Start New Battle Setup'),
              ),
            ],
          ),
        ),
      );
    }

    final player1Participant = battleState.participants.firstWhere((p) => p.playerId == 'player1', orElse: () => throw Exception("Player 1 not found in setup"));
    final player2Participant = battleState.participants.firstWhere((p) => p.playerId == 'player2', orElse: () => null);


    return Scaffold(
      appBar: AppBar(
        title: const Text('Setup Your Battle'),
        backgroundColor: theme.colorScheme.surfaceContainerHighest,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Player 1 Display
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    Text('Player 1', style: theme.textTheme.headlineSmall),
                    const SizedBox(height: 8),
                    Image.asset(player1Participant.miniature.imageUrl, height: 80, errorBuilder: (c,o,s) => Icon(Icons.error, size: 80)),
                    const SizedBox(height: 8),
                    Text(player1Participant.miniature.name, style: theme.textTheme.titleMedium),
                    Text('HP: ${player1Participant.currentHp}', style: theme.textTheme.bodyMedium),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Player 2 Selection / Display
            Text('Select Opponent (Player 2):', style: theme.textTheme.titleLarge),
            const SizedBox(height: 12),
            if (player2Participant != null)
              Card(
                elevation: 2,
                color: theme.colorScheme.secondaryContainer,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      Text('Player 2', style: theme.textTheme.headlineSmall?.copyWith(color: theme.colorScheme.onSecondaryContainer)),
                      const SizedBox(height: 8),
                      Image.asset(player2Participant.miniature.imageUrl, height: 80, errorBuilder: (c,o,s) => Icon(Icons.error, size: 80)),
                      const SizedBox(height: 8),
                      Text(player2Participant.miniature.name, style: theme.textTheme.titleMedium?.copyWith(color: theme.colorScheme.onSecondaryContainer)),
                      Text('HP: ${player2Participant.currentHp}', style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSecondaryContainer)),
                    ],
                  ),
                ),
              )
            else
              Expanded( // Allow list to take available space
                child: ListView.builder(
                  itemCount: availableOpponents.length,
                  itemBuilder: (context, index) {
                    final mini = availableOpponents[index];
                    // Avoid selecting player1's chosen mini as opponent if it's in the list
                    if (mini.id == player1Participant.miniature.id && battleState.participants.length == 1) return const SizedBox.shrink();

                    return Card(
                      margin: const EdgeInsets.symmetric(vertical: 4.0),
                      child: ListTile(
                        leading: Image.asset(mini.imageUrl, width: 40, height: 40, errorBuilder: (c,o,s) => Icon(Icons.error, size: 40)),
                        title: Text(mini.name),
                        subtitle: Text('HP: ${mini.currentHp}, Desc: ${mini.description.substring(0, mini.description.length > 30 ? 30 : mini.description.length)}...'),
                        onTap: () {
                          battleNotifier.addParticipantToSetup(mini, 'player2');
                        },
                      ),
                    );
                  },
                ),
              ),

            const Spacer(), // Push button to bottom

            ElevatedButton(
              onPressed: (player1Participant != null && player2Participant != null)
                  ? () {
                      battleNotifier.confirmBattleSetup();
                      context.go('/battle');
                    }
                  : null, // Disabled if not all participants selected
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16.0),
                backgroundColor: theme.colorScheme.primary,
                foregroundColor: theme.colorScheme.onPrimary,
              ),
              child: const Text('Start Battle!', style: TextStyle(fontSize: 18)),
            ),
          ],
        ),
      ),
    );
  }
}
