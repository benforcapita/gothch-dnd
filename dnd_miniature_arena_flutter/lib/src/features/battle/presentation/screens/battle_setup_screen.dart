import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dnd_miniature_arena_flutter/src/features/battle/application/battle_provider.dart';
import 'package:dnd_miniature_arena_flutter/src/features/battle/domain/battle_models.dart';
import 'package:dnd_miniature_arena_flutter/src/features/collection/domain/miniature_model.dart';
import 'package:go_router/go_router.dart';

class BattleSetupScreen extends ConsumerWidget {
  const BattleSetupScreen({super.key});

  Widget _buildParticipantSetupCard(BuildContext context, String title, BattleParticipant? participant, {Miniature? staticMiniature}) {
    final theme = Theme.of(context);
    final mini = participant?.miniature ?? staticMiniature;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text(title, style: theme.textTheme.headlineSmall?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
            const SizedBox(height: 12),
            if (mini != null) ...[
              Image.asset(mini.imageUrl, height: 80, fit: BoxFit.contain, errorBuilder: (c,o,s) => Icon(Icons.error_outline, size: 80, color: theme.iconTheme.color)),
              const SizedBox(height: 8),
              Text(mini.name, style: theme.textTheme.titleMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant, fontWeight: FontWeight.bold)),
              Text('HP: ${mini.currentHp}', style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant.withOpacity(0.8))),
            ] else ...[
              Icon(Icons.person_search_outlined, size: 80, color: theme.iconTheme.color?.withOpacity(0.6)),
              const SizedBox(height: 8),
              Text("Choose Opponent", style: theme.textTheme.titleMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant.withOpacity(0.8))),
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
    final availableOpponents = battleNotifier.getAvailableMiniaturesForSetup();
    final theme = Theme.of(context);

    if (battleState == null || battleState.status != BattleStatus.setup || battleState.participants.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('Setup Battle')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.warning_amber_rounded, size: 60, color: theme.colorScheme.error),
                const SizedBox(height: 16),
                Text('Battle setup not initiated or Player 1 missing.', style: theme.textTheme.titleLarge, textAlign: TextAlign.center),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () {
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
        ),
      );
    }

    final player1Participant = battleState.participants.firstWhere((p) => p.playerId == 'player1'); // This will throw if not found, which is fine if logic ensures P1 is always there in setup state.
    BattleParticipant? player2Participant;
    try {
      player2Participant = battleState.participants.firstWhere((p) => p.playerId == 'player2');
    } catch (e) {
      player2Participant = null; // Not found
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Setup Your Battle'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildParticipantSetupCard(context, "Player 1", player1Participant),
            const SizedBox(height: 16),
            Divider(color: theme.colorScheme.outline.withOpacity(0.5)),
            const SizedBox(height: 16),

            Text('Select Opponent (Player 2):', style: theme.textTheme.titleLarge?.copyWith(color: theme.colorScheme.onBackground, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),

            if (player2Participant != null)
              _buildParticipantSetupCard(context, "Player 2", player2Participant)
            else
              Expanded(
                child: ListView.builder(
                  itemCount: availableOpponents.length,
                  itemBuilder: (context, index) {
                    final mini = availableOpponents[index];
                    if (mini.id == player1Participant.miniature.id) return const SizedBox.shrink();

                    return Card(
                      margin: const EdgeInsets.symmetric(vertical: 6.0),
                      child: ListTile(
                        leading: Image.asset(mini.imageUrl, width: 50, height: 50, fit: BoxFit.contain, errorBuilder: (c,o,s) => Icon(Icons.image_not_supported, size: 50)),
                        title: Text(mini.name, style: theme.textTheme.titleMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
                        subtitle: Text('HP: ${mini.currentHp} - ${mini.description.substring(0, mini.description.length > 25 ? 25 : mini.description.length)}...', style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant.withOpacity(0.7))),
                        onTap: () {
                          battleNotifier.addParticipantToSetup(mini, 'player2');
                        },
                        selected: player2Participant?.miniature.id == mini.id,
                        selectedTileColor: theme.colorScheme.primaryContainer.withOpacity(0.5),
                      ),
                    );
                  },
                ),
              ),

            const Spacer(),

            ElevatedButton(
              onPressed: (player2Participant != null) // Simplified check, player1 is guaranteed if we are in this UI block
                  ? () {
                      battleNotifier.confirmBattleSetup();
                      context.go('/battle');
                    }
                  : null,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16.0),
                // textStyle: theme.elevatedButtonTheme.style?.textStyle?.copyWith(fontSize: 18) // This was the problematic line
                // Instead, grab the base textStyle and apply modifications if needed, or rely on the theme's default.
                // If elevatedButtonTheme.textStyle is already good, no need to override.
                // If specific size is needed:
                textStyle: theme.textTheme.labelLarge?.copyWith(fontSize: 18, color: theme.colorScheme.onPrimary),
              ),
              child: const Text('Start Battle!'),
            ),
          ],
        ),
      ),
    );
  }
}
