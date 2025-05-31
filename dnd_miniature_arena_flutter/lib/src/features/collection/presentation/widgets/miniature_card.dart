import 'package:flutter/material.dart';
import 'package:dnd_miniature_arena_flutter/src/features/collection/domain/miniature_model.dart';
import 'package:go_router/go_router.dart';

class MiniatureCard extends StatelessWidget {
  final Miniature miniature;

  const MiniatureCard({super.key, required this.miniature});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Card(
      elevation: 3.0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
      clipBehavior: Clip.antiAlias, // Ensures the InkWell splash respects border radius
      color: theme.colorScheme.surfaceVariant,
      child: InkWell(
        onTap: () {
          context.go('/collection/detail/${miniature.id}');
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              flex: 3, // Give more space to the image
              child: Container(
                color: theme.colorScheme.surface, // Background for the image area
                child: Image.asset(
                  miniature.imageUrl,
                  fit: BoxFit.contain, // Or BoxFit.cover, depending on desired look
                  errorBuilder: (context, error, stackTrace) {
                    // Fallback for image loading errors
                    return Icon(Icons.image_not_supported, size: 48, color: theme.colorScheme.onSurface.withOpacity(0.5));
                  },
                ),
              ),
            ),
            Expanded(
              flex: 2, // Space for text content
              child: Padding(
                padding: const EdgeInsets.all(10.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Text(
                      miniature.name,
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      miniature.rarity,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: _getRarityColor(miniature.rarity, theme),
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                     Text(
                      miniature.set,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant.withOpacity(0.7),
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getRarityColor(String rarity, ThemeData theme) {
    switch (rarity.toLowerCase()) {
      case 'common':
        return theme.colorScheme.onSurface.withOpacity(0.6);
      case 'uncommon':
        return Colors.green.shade400;
      case 'rare':
        return Colors.blue.shade400;
      case 'very rare':
        return Colors.purple.shade400;
      case 'legendary':
        return Colors.orange.shade400;
      default:
        return theme.colorScheme.onSurface.withOpacity(0.6);
    }
  }
}
