import 'package:flutter/material.dart';
import 'package:dnd_miniature_arena_flutter/src/features/collection/domain/miniature_model.dart';
import 'package:go_router/go_router.dart';

class MiniatureCard extends StatelessWidget {
  final Miniature miniature;

  const MiniatureCard({super.key, required this.miniature});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    // Card uses properties from theme.cardTheme by default
    return Card(
      // color: theme.cardTheme.color ?? theme.colorScheme.surfaceVariant, // Example if explicit override needed
      // elevation: theme.cardTheme.elevation, // Inherited
      // shape: theme.cardTheme.shape, // Inherited
      // clipBehavior: theme.cardTheme.clipBehavior ?? Clip.antiAlias, // Inherited
      child: InkWell(
        onTap: () {
          context.go('/collection/detail/${miniature.id}');
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              flex: 3,
              child: Container(
                // Using ClipRRect to ensure image respects card's rounded corners if any
                // The Card's clipBehavior should handle this, but explicit ClipRRect is safer for Image.asset
                child: ClipRRect(
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(theme.cardTheme.shape is RoundedRectangleBorder
                        ? ((theme.cardTheme.shape as RoundedRectangleBorder).borderRadius as BorderRadius).topLeft.x
                        : 12.0), // Default if not RoundedRectangleBorder
                    topRight: Radius.circular(theme.cardTheme.shape is RoundedRectangleBorder
                        ? ((theme.cardTheme.shape as RoundedRectangleBorder).borderRadius as BorderRadius).topRight.x
                        : 12.0),
                  ),
                  child: Image.asset(
                    miniature.imageUrl,
                    fit: BoxFit.cover, // BoxFit.cover to fill the space
                    errorBuilder: (context, error, stackTrace) {
                      return Center(
                        child: Icon(
                          Icons.image_not_supported,
                          size: 48,
                          color: theme.iconTheme.color?.withOpacity(0.5) ?? theme.colorScheme.onSurface.withOpacity(0.5)
                        ),
                      );
                    },
                  ),
                ),
              ),
            ),
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(10.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceAround, // Adjusted for better spacing
                  children: [
                    Text(
                      miniature.name,
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: theme.colorScheme.onSurfaceVariant, // Color for text on card's surface variant
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Column( // Group rarity and set
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                         Text(
                          miniature.rarity,
                          style: theme.textTheme.bodyMedium?.copyWith( // Using bodyMedium for rarity
                            color: _getRarityColor(miniature.rarity, theme),
                            fontWeight: FontWeight.bold, // Make rarity stand out
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
    // Using theme colors for better adaptability if primary/secondary change
    switch (rarity.toLowerCase()) {
      case 'common':
        return theme.colorScheme.onSurface.withOpacity(0.6);
      case 'uncommon':
        return Colors.green.shade400; // Keep specific for now, or map to theme.colorScheme.tertiary etc.
      case 'rare':
        return theme.colorScheme.secondary;
      case 'very rare':
        return theme.colorScheme.primary;
      case 'legendary':
        return Colors.orange.shade500; // Keep specific for now
      default:
        return theme.colorScheme.onSurface.withOpacity(0.6);
    }
  }
}
