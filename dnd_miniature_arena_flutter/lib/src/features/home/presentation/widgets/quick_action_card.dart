import 'package:flutter/material.dart';

class QuickActionCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final VoidCallback onPress;
  final List<Color> gradientColors;

  const QuickActionCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.onPress,
    required this.gradientColors,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    // CardTheme properties like elevation, shape, margin are used by default.
    // The color is overridden by the Container's BoxDecoration for the gradient.
    return Expanded(
      child: AspectRatio(
        aspectRatio: 1.2,
        child: Card(
          // elevation: theme.cardTheme.elevation, // Inherited
          // shape: theme.cardTheme.shape, // Inherited
          // margin: theme.cardTheme.margin, // Inherited
          clipBehavior: Clip.antiAlias, // Ensures gradient respects rounded corners
          child: InkWell(
            onTap: onPress,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: gradientColors,
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              padding: const EdgeInsets.all(16.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(icon, size: 36.0, color: theme.colorScheme.onPrimary.withOpacity(0.95)), // Assuming gradient is dark enough for onPrimary
                  const Spacer(),
                  Text(
                    title,
                    style: theme.textTheme.titleLarge?.copyWith( // Using titleLarge for more emphasis
                      color: theme.colorScheme.onPrimary, // Text on gradient
                    ),
                  ),
                  Text(
                    subtitle,
                    style: theme.textTheme.bodyMedium?.copyWith( // Using bodyMedium
                      color: theme.colorScheme.onPrimary.withOpacity(0.85), // Text on gradient
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
