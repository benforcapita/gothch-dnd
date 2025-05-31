import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dnd_miniature_arena_flutter/src/features/collection/application/miniature_provider.dart';
import 'package:dnd_miniature_arena_flutter/src/features/collection/domain/miniature_model.dart';

class MiniatureDetailScreen extends ConsumerWidget {
  final String miniatureId;

  const MiniatureDetailScreen({super.key, required this.miniatureId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final miniatureAsyncValue = ref.watch(miniatureByIdProvider(miniatureId));
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(miniatureAsyncValue.when(
          data: (miniature) => miniature?.name ?? 'Detail',
          loading: () => 'Loading...',
          error: (e, st) => 'Error',
        )),
        backgroundColor: theme.colorScheme.surfaceContainerHighest,
        elevation: 2.0,
      ),
      body: miniatureAsyncValue.when(
        data: (miniature) {
          if (miniature == null) {
            return const Center(child: Text('Miniature not found.'));
          }
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Hero( // Optional: Add Hero animation if image is also in MiniatureCard
                    tag: 'miniatureImage_${miniature.id}',
                    child: Container(
                      height: 250,
                      width: 250,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12.0),
                        image: DecorationImage(
                          image: AssetImage(miniature.imageUrl),
                          fit: BoxFit.contain,
                        ),
                         boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.15),
                            spreadRadius: 2,
                            blurRadius: 8,
                            offset: const Offset(0, 4),
                          )
                        ]
                      ),
                      child: Image.asset(
                        miniature.imageUrl,
                        fit: BoxFit.contain,
                        errorBuilder: (context, error, stackTrace) {
                          return Icon(Icons.image_not_supported, size: 100, color: theme.colorScheme.onSurface.withOpacity(0.5));
                        },
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24.0),
                _buildDetailItem(theme, 'Name', miniature.name),
                _buildDetailItem(theme, 'Rarity', miniature.rarity,
                  valueColor: _getRarityColor(miniature.rarity, theme)),
                _buildDetailItem(theme, 'Set', miniature.set),
                const SizedBox(height: 16.0),
                Text(
                  'Description:',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: theme.colorScheme.onSurface,
                  ),
                ),
                const SizedBox(height: 8.0),
                Text(
                  miniature.description,
                  style: theme.textTheme.bodyLarge?.copyWith(
                    color: theme.colorScheme.onSurface.withOpacity(0.85),
                    height: 1.5, // Line height
                  ),
                ),
                // TODO: Add more fields like stats, abilities etc.
                // e.g., _buildDetailItem(theme, 'HP', miniature.stats?.hp ?? 'N/A'),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(
          child: Text('Error loading miniature: ${e.toString()}',
          style: TextStyle(color: theme.colorScheme.error)),
        ),
      ),
    );
  }

  Widget _buildDetailItem(ThemeData theme, String label, String value, {Color? valueColor}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '$label: ',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: theme.colorScheme.onSurface,
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: theme.textTheme.titleMedium?.copyWith(
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
        return Colors.green.shade600;
      case 'rare':
        return Colors.blue.shade600;
      case 'very rare':
        return Colors.purple.shade600;
      case 'legendary':
        return Colors.orange.shade600;
      default:
        return theme.colorScheme.onSurface.withOpacity(0.7);
    }
  }
}
