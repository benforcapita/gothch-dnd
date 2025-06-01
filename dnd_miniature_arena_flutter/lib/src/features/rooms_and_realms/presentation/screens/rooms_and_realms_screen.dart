import 'package:flutter/material.dart';

class RoomsAndRealmsScreen extends StatelessWidget {
  const RoomsAndRealmsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar( // Uses appBarTheme
        title: const Text('Rooms & Realms'),
        // backgroundColor: theme.appBarTheme.backgroundColor, // Inherited
        // elevation: theme.appBarTheme.elevation, // Inherited
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0), // Consistent screen padding
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Icon(
                Icons.explore_off_outlined, // Changed icon slightly to differentiate
                size: 80,
                color: theme.iconTheme.color?.withOpacity(0.7) ?? theme.colorScheme.secondary, // Use iconTheme or fallback
              ),
              const SizedBox(height: 24.0),
              Text(
                'Rooms & Realms: Coming Soon!',
                style: theme.textTheme.headlineSmall?.copyWith( // Use headlineSmall from theme
                  color: theme.colorScheme.onBackground, // Use onBackground for text on main scaffold bg
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16.0),
              Text(
                'Forge alliances, explore vast digital domains, and embark on epic quests with fellow adventurers. This realm is currently under construction and will unlock new dimensions of play!', // Slightly more engaging text
                style: theme.textTheme.bodyLarge?.copyWith( // Use bodyLarge from theme
                  color: theme.colorScheme.onBackground.withOpacity(0.75), // Adjusted opacity
                  height: 1.5,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32.0),
              Container( // Decorative element
                height: 4,
                width: 100,
                decoration: BoxDecoration(
                  color: theme.colorScheme.secondary.withOpacity(0.4), // Adjusted opacity
                  borderRadius: BorderRadius.circular(2.0)
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
