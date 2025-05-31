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

    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Section
            Container(
              width: double.infinity, // Ensure it takes full width
              padding: const EdgeInsets.all(24.0).copyWith(
                top: MediaQuery.of(context).padding.top + 24.0,
                bottom: 48.0 // Extra padding at the bottom of the header
              ),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    theme.colorScheme.primary.withOpacity(0.8),
                    theme.colorScheme.secondary.withOpacity(0.7),
                    theme.colorScheme.surface.withOpacity(0.6),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.2),
                    spreadRadius: 1,
                    blurRadius: 10,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Welcome back,',
                    style: theme.textTheme.headlineSmall?.copyWith(
                      color: theme.colorScheme.onPrimary, // Text on primary/secondary should be onPrimary
                    ),
                  ),
                  Text(
                    username,
                    style: theme.textTheme.headlineMedium?.copyWith(
                      color: theme.colorScheme.onPrimary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  Chip(
                    avatar: Icon(Icons.star, color: theme.colorScheme.secondary),
                    label: Text(
                      'Level $userLevel Collector',
                      style: theme.textTheme.titleMedium?.copyWith(
                        color: theme.colorScheme.onSecondary, // Text on secondary color
                      ),
                    ),
                    backgroundColor: theme.colorScheme.secondary.withOpacity(0.3),
                    padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
                  )
                ],
              ),
            ),

            // Content Padding
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Stats Section
                  Text(
                    'Your Adventure Stats',
                    style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold, color: theme.colorScheme.onSurface),
                  ),
                  const SizedBox(height: 16.0),
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      StatCard(label: 'Miniatures', value: '0', icon: Icons.collections_bookmark),
                      SizedBox(width: 12), // spacing between cards
                      StatCard(label: 'Battles Won', value: '0', icon: Icons.emoji_events),
                      SizedBox(width: 12), // spacing between cards
                      StatCard(label: 'Win Rate', value: '0%', icon: Icons.show_chart),
                    ],
                  ),
                  const SizedBox(height: 32.0),

                  // Quick Actions Section
                  Text(
                    'Quick Actions',
                     style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold, color: theme.colorScheme.onSurface),
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
                        gradientColors: [theme.colorScheme.tertiary, theme.colorScheme.primary.withOpacity(0.7)],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16.0),
                  Row(
                    children: [
                      QuickActionCard(
                        title: 'My Collection',
                        subtitle: 'View Your Minis',
                        icon: Icons.view_module,
                        onPress: () => context.go('/collection'),
                        gradientColors: [Colors.blue.shade700, Colors.teal.shade400], // Example custom gradient
                      ),
                      const SizedBox(width: 16),
                      QuickActionCard(
                        title: 'Battle History',
                        subtitle: 'Review Past Glories',
                        icon: Icons.history,
                        onPress: () => context.go('/profile'), // Assuming profile shows history
                        gradientColors: [Colors.green.shade600, Colors.blue.shade500], // Example custom gradient
                      ),
                    ],
                  ),
                  const SizedBox(height: 24.0), // Bottom padding
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
