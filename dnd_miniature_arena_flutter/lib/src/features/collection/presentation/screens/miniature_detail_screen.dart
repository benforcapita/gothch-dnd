import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dnd_miniature_arena_flutter/src/features/collection/application/miniature_provider.dart';
import 'package:dnd_miniature_arena_flutter/src/features/collection/domain/miniature_model.dart'; // Ensure Miniature model is imported

class MiniatureDetailScreen extends ConsumerWidget {
  final String miniatureId;

  const MiniatureDetailScreen({super.key, required this.miniatureId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // miniatureByIdProvider returns Miniature?, not AsyncValue<Miniature?>
    // So, we don't use .when here directly for AsyncValue states (loading, error).
    // Those would be handled if miniatureByIdProvider itself was an AsyncNotifierProvider.
    // For now, it's a simple Provider that synchronously looks up from another provider's state.
    final Miniature? miniature = ref.watch(miniatureByIdProvider(miniatureId));
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(miniature?.name ?? 'Miniature Details'),
      ),
      body: miniature == null
          ? Center( // Handle null case (not found or if provider list is initially empty)
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.search_off, size: 48),
                  const SizedBox(height: 16),
                  Text('Miniature not found.', style: theme.textTheme.titleLarge),
                ],
              ),
            )
          : SingleChildScrollView( // Miniature is not null here
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Card(
                    clipBehavior: Clip.antiAlias,
                    child: Hero(
                      tag: 'miniatureImage_${miniature.id}',
                      child: Image.asset(
                        miniature.imageUrl,
                        height: 300,
                        fit: BoxFit.contain,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            height: 300,
                            alignment: Alignment.center,
                            child: Icon(
                              Icons.image_not_supported,
                              size: 100,
                              color: theme.iconTheme.color?.withOpacity(0.5)
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 24.0),

                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildDetailItem(theme, 'Name', miniature.name, style: theme.textTheme.headlineSmall),
                          const Divider(),
                          _buildDetailItem(theme, 'Rarity', miniature.rarity,
                            valueColor: _getRarityColor(miniature.rarity, theme),
                            style: theme.textTheme.titleLarge),
                          const Divider(),
                          _buildDetailItem(theme, 'Set', miniature.set, style: theme.textTheme.titleMedium),
                          const Divider(),
                          _buildDetailItem(theme, 'HP', miniature.currentHp.toString(), style: theme.textTheme.titleMedium),
                          const SizedBox(height: 16.0),
                          Text(
                            'Description:',
                            style: theme.textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: theme.colorScheme.onSurface,
                            ),
                          ),
                          const SizedBox(height: 8.0),
                          Text(
                            miniature.description,
                            style: theme.textTheme.bodyLarge?.copyWith(
                              color: theme.colorScheme.onSurface.withOpacity(0.85),
                              height: 1.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24.0),
                ],
              ),
            ),
    );
  }

  Widget _buildDetailItem(ThemeData theme, String label, String value, {Color? valueColor, TextStyle? style}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '$label: ',
            style: (style ?? theme.textTheme.titleMedium)?.copyWith(
              fontWeight: FontWeight.bold,
              color: theme.colorScheme.onSurface.withOpacity(0.9),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: (style ?? theme.textTheme.titleMedium)?.copyWith(
                color: valueColor ?? theme.colorScheme.onSurface.withOpacity(0.85),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Color _getRarityColor(String rarity, ThemeData theme) {
    switch (rarity.toLowerCase()) {
      case 'common':
        return theme.colorScheme.onSurface.withOpacity(0.7);
      case 'uncommon':
        return Colors.green.shade500;
      case 'rare':
        return theme.colorScheme.secondary;
      case 'very rare':
        return theme.colorScheme.primary;
      case 'legendary':
        return Colors.orange.shade600;
      default:
        return theme.colorScheme.onSurface.withOpacity(0.7);
    }
  }
}
