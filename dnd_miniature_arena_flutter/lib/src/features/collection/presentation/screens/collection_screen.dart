import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dnd_miniature_arena_flutter/src/features/collection/application/miniature_provider.dart';
import 'package:dnd_miniature_arena_flutter/src/features/collection/presentation/widgets/miniature_card.dart';

class CollectionScreen extends ConsumerWidget {
  const CollectionScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final miniatures = ref.watch(miniatureProvider);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar( // Uses appBarTheme from global theme
        title: const Text('My Miniatures Collection'), // Slightly more descriptive title
      ),
      body: miniatures.isEmpty
          ? Center(
              child: Padding( // Added padding around the empty state message
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.info_outline, size: 60, color: theme.iconTheme.color?.withOpacity(0.6)), // Use iconTheme
                    const SizedBox(height: 20),
                    Text(
                      'Your collection is empty.', // Simplified message
                      style: theme.textTheme.headlineSmall?.copyWith(color: theme.colorScheme.onBackground.withOpacity(0.8)),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Scan your miniatures or add them manually to see them here.', // Updated placeholder text
                      style: theme.textTheme.bodyLarge?.copyWith(color: theme.colorScheme.onBackground.withOpacity(0.6)),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton.icon( // Uses elevatedButtonTheme
                      icon: const Icon(Icons.qr_code_scanner),
                      label: const Text('Scan First Mini'),
                      onPressed: () {
                        // Assuming '/scan' route is set up in go_router
                        // context.go('/scan');
                        // For now, as go_router isn't directly available without context.go from a widget that has it,
                        // this button is illustrative. In a real app, ensure context is available or use a callback.
                         ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Navigate to Scan Screen (placeholder action)'))
                        );
                      },
                    )
                  ],
                ),
              ),
            )
          : GridView.builder(
              padding: const EdgeInsets.all(16.0), // Consistent screen padding
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.70, // Adjusted for potentially more text in card
                crossAxisSpacing: 16.0,
                mainAxisSpacing: 16.0,
              ),
              itemCount: miniatures.length,
              itemBuilder: (context, index) {
                final miniature = miniatures[index];
                return MiniatureCard(miniature: miniature); // MiniatureCard already reviewed
              },
            ),
      // Example for a FAB, would use theme.floatingActionButtonTheme if defined
      // floatingActionButton: FloatingActionButton(
      //   onPressed: () => context.go('/scan'),
      //   child: const Icon(Icons.add_a_photo_outlined),
      // ),
    );
  }
}
