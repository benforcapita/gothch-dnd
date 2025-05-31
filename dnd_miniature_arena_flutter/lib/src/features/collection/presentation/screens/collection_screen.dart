import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dnd_miniature_arena_flutter/src/features/collection/application/miniature_provider.dart';
import 'package:dnd_miniature_arena_flutter/src/features/collection/presentation/widgets/miniature_card.dart';
// Removed unused import 'package:dnd_miniature_arena_flutter/src/features/collection/domain/miniature_model.dart';

class CollectionScreen extends ConsumerWidget {
  const CollectionScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final miniatures = ref.watch(miniatureProvider);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Miniatures'),
        backgroundColor: theme.colorScheme.surfaceContainerHighest, // Or theme.appBarTheme.backgroundColor
        elevation: 2.0,
      ),
      body: miniatures.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.info_outline, size: 48, color: theme.colorScheme.onSurface.withOpacity(0.5)),
                  const SizedBox(height: 16),
                  Text(
                    'No miniatures in your collection yet.',
                    style: theme.textTheme.titleMedium?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.7)),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Start by scanning some!', // TODO: Add a button to navigate to scan screen
                    style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.5)),
                  ),
                ],
              ),
            )
          : GridView.builder(
              padding: const EdgeInsets.all(12.0),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2, // Number of columns
                childAspectRatio: 0.75, // Aspect ratio of the cards (width / height)
                crossAxisSpacing: 12.0, // Horizontal spacing
                mainAxisSpacing: 12.0,  // Vertical spacing
              ),
              itemCount: miniatures.length,
              itemBuilder: (context, index) {
                final miniature = miniatures[index];
                return MiniatureCard(miniature: miniature);
              },
            ),
      // TODO: Add a FloatingActionButton to add miniatures manually or navigate to scan screen
      // floatingActionButton: FloatingActionButton(
      //   onPressed: () {
      //     // Example: context.go('/scan');
      //     // Or show a dialog to add manually
      //   },
      //   child: const Icon(Icons.add),
      //   backgroundColor: theme.colorScheme.primary,
      //   foregroundColor: theme.colorScheme.onPrimary,
      // ),
    );
  }
}
