import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dnd_miniature_arena_flutter/src/features/auth/application/auth_provider.dart';
import 'package:dnd_miniature_arena_flutter/src/features/home/presentation/widgets/stat_card.dart';
import 'package:dnd_miniature_arena_flutter/src/features/home/presentation/widgets/quick_action_card.dart';
import 'package:go_router/go_router.dart';

class HomeTabContentScreen extends ConsumerWidget {
  const HomeTabContentScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final authState = ref.watch(authProvider);
    final username = authState.user?.username ?? 'Adventurer';
    const userLevel = 5; // Mock level

    return Scaffold( // Ensuring it has its own Scaffold if it's the direct content of a route
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Section
            Container(
              width: double.infinity,
              padding: EdgeInsets.fromLTRB(24.0, MediaQuery.of(context).padding.top + 24.0, 24.0, 32.0), // Adjusted padding
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    theme.colorScheme.primary.withOpacity(0.9),
                    theme.colorScheme.secondary.withOpacity(0.8),
                    theme.colorScheme.surface.withOpacity(0.7), // Blending into a themed surface color
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                // No redundant shadows if the AppBar in parent Scaffold (if any) has one.
                // If this is a top-level screen content, a shadow might be desired.
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Welcome back,',
                    style: theme.textTheme.headlineSmall?.copyWith(
                      color: theme.colorScheme.onPrimary, // Ensure contrast on gradient
                    ),
                  ),
                  Text(
                    username,
                    style: theme.textTheme.displaySmall?.copyWith( // More prominent username
                      color: theme.colorScheme.onPrimary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  Chip( // Uses chipTheme from global theme
                    avatar: Icon(Icons.star, color: theme.chipTheme.iconTheme?.color ?? theme.colorScheme.secondary), // Use chipTheme icon color
                    label: Text(
                      'Level $userLevel Collector',
                    ),
                    // backgroundColor is from chipTheme
                    // labelStyle is from chipTheme
                  )
                ],
              ),
            ),

            // Content Padding for sections below header
            Padding(
              padding: const EdgeInsets.all(16.0), // Consistent screen edge padding
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Stats Section
                  Text(
                    'Your Adventure Stats',
                    style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold, color: theme.colorScheme.onBackground), // Use onBackground for text on main scaffold bg
                  ),
                  const SizedBox(height: 16.0),
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      StatCard(label: 'Miniatures', value: '0', icon: Icons.collections_bookmark_outlined),
                      SizedBox(width: 12),
                      StatCard(label: 'Battles Won', value: '0', icon: Icons.emoji_events_outlined),
                      SizedBox(width: 12),
                      StatCard(label: 'Win Rate', value: '0%', icon: Icons.show_chart_outlined),
                    ],
                  ),
                  const SizedBox(height: 32.0),

                  // Quick Actions Section
                  Text(
                    'Quick Actions',
                     style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold, color: theme.colorScheme.onBackground),
                  ),
                  const SizedBox(height: 16.0),
                  Row(
                    children: [
                      QuickActionCard(
                        title: 'Scan Mini',
                        subtitle: 'Add to Collection',
                        icon: Icons.qr_code_scanner,
                        onPress: () => context.go('/scan'),
                        gradientColors: [theme.colorScheme.primary, theme.colorScheme.secondary],
                      ),
                      const SizedBox(width: 16),
                      QuickActionCard(
                        title: 'Start Battle',
                        subtitle: 'Test Your Might',
                        icon: Icons.sports_martial_arts,
                        onPress: () => context.go('/battle'),
                        gradientColors: [theme.colorScheme.tertiary, theme.colorScheme.secondary.withOpacity(0.8)],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16.0),
                  Row(
                    children: [
                      QuickActionCard(
                        title: 'My Collection',
                        subtitle: 'View Your Minis',
                        icon: Icons.view_module_outlined,
                        onPress: () => context.go('/collection'),
                        gradientColors: [theme.colorScheme.secondary, theme.colorScheme.tertiary.withOpacity(0.7)],
                      ),
                      const SizedBox(width: 16),
                      QuickActionCard(
                        title: 'Battle History',
                        subtitle: 'Past Encounters', // Slightly changed subtitle
                        icon: Icons.history_edu_outlined,
                        onPress: () => context.go('/profile'),
                        gradientColors: [theme.colorScheme.surface, theme.colorScheme.secondary.withOpacity(0.5)], // Using surface for a different feel
                      ),
                    ],
                  ),
                  const SizedBox(height: 24.0),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
