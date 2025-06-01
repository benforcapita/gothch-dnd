import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dnd_miniature_arena_flutter/src/features/auth/application/auth_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final authState = ref.watch(authProvider);
    final user = authState.user;

    return Scaffold(
      appBar: AppBar( // Uses appBarTheme
        title: const Text('Profile & Settings'), // Expanded title
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0), // Consistent screen padding
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch, // Stretch elements like button
          children: [
            if (user != null) ...[
              Card( // Uses cardTheme
                // elevation: theme.cardTheme.elevation, // Inherited
                // shape: theme.cardTheme.shape, // Inherited
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    children: [
                      CircleAvatar(
                        radius: 50,
                        backgroundColor: theme.colorScheme.primaryContainer,
                        child: Text(
                          user.username.isNotEmpty ? user.username[0].toUpperCase() : 'U', // 'U' for User as fallback
                          style: theme.textTheme.displaySmall?.copyWith(color: theme.colorScheme.onPrimaryContainer), // Larger text for initial
                        ),
                      ),
                      const SizedBox(height: 16.0),
                      Text(
                        user.username,
                        style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold, color: theme.colorScheme.onSurfaceVariant),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 8.0),
                      Text(
                        user.email,
                        style: theme.textTheme.titleMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant.withOpacity(0.8)),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 32.0),
              ElevatedButton.icon( // Uses elevatedButtonTheme, but overridden for destructive action
                icon: const Icon(Icons.logout),
                label: const Text('Logout'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.colorScheme.errorContainer,
                  foregroundColor: theme.colorScheme.onErrorContainer,
                  minimumSize: const Size(double.infinity, 50),
                  padding: const EdgeInsets.symmetric(vertical: 12.0),
                  textStyle: theme.textTheme.labelLarge?.copyWith(fontWeight: FontWeight.bold), // Use labelLarge from theme
                ),
                onPressed: () async {
                  final confirmLogout = await showDialog<bool>(
                    context: context,
                    builder: (BuildContext dialogContext) => AlertDialog( // AlertDialog also uses DialogTheme from global theme (if defined)
                      title: Text('Confirm Logout', style: theme.textTheme.titleLarge?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
                      content: Text('Are you sure you want to log out?', style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
                      actions: <Widget>[
                        TextButton( // Uses textButtonTheme
                          child: const Text('Cancel'),
                          onPressed: () {
                            Navigator.of(dialogContext).pop(false);
                          },
                        ),
                        TextButton( // Uses textButtonTheme
                          style: TextButton.styleFrom(foregroundColor: theme.colorScheme.error), // Override for destructive action
                          child: const Text('Logout'),
                          onPressed: () {
                            Navigator.of(dialogContext).pop(true);
                          },
                        ),
                      ],
                    ),
                  );

                  if (confirmLogout == true) {
                    await ref.read(authProvider.notifier).logout();
                  }
                },
              ),
            ] else ...[
              Center( // Fallback if user is somehow null (should be handled by router)
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.person_off_outlined, size: 60, color: theme.iconTheme.color?.withOpacity(0.6)),
                    const SizedBox(height: 16),
                    Text('Not logged in.', style: theme.textTheme.titleLarge),
                    const SizedBox(height: 16),
                    ElevatedButton( // Uses elevatedButtonTheme
                      onPressed: () {
                         // context.go('/login'); // This navigation should ideally be handled by router redirect
                      },
                      child: const Text('Go to Login'),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 48.0),
            Card( // Uses cardTheme
              elevation: 0, // Flat card for placeholder text
              color: theme.colorScheme.surfaceVariant.withOpacity(0.3), // Subtler background
              child: Padding(
                padding: const EdgeInsets.all(20.0), // Increased padding
                child: Text(
                  "More profile information, app settings, and user stats (like battle history, miniatures collected) will be displayed here in future updates.",
                  style: theme.textTheme.bodyLarge?.copyWith(color: theme.colorScheme.onSurfaceVariant.withOpacity(0.9)), // Use bodyLarge
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
