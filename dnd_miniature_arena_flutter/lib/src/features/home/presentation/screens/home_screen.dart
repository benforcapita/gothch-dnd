import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HomeScreen extends StatelessWidget {
  final StatefulNavigationShell navigationShell;

  const HomeScreen({super.key, required this.navigationShell});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    // The Scaffold here doesn't have its own AppBar, as AppBars are typically
    // part of the individual tab screens, or a single AppBar would be part of this shell
    // if a global AppBar for all tabs was desired.

    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.collections_bookmark_outlined), activeIcon: Icon(Icons.collections_bookmark), label: 'Collection'),
          BottomNavigationBarItem(icon: Icon(Icons.qr_code_scanner_outlined), activeIcon: Icon(Icons.qr_code_scanner), label: 'Scan'),
          BottomNavigationBarItem(icon: Icon(Icons.explore_outlined), activeIcon: Icon(Icons.explore), label: 'Realms'),
          BottomNavigationBarItem(icon: Icon(Icons.shield_outlined), activeIcon: Icon(Icons.shield), label: 'Battle'), // Changed icon for Battle
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: 'Profile'),
        ],
        currentIndex: navigationShell.currentIndex,
        onTap: (int index) => _onItemTapped(index, context),

        // Utilizing theme properties for BottomNavigationBar
        selectedItemColor: theme.bottomNavigationBarTheme.selectedItemColor ?? theme.colorScheme.primary,
        unselectedItemColor: theme.bottomNavigationBarTheme.unselectedItemColor ?? theme.colorScheme.onSurface.withOpacity(0.7),
        selectedLabelStyle: theme.bottomNavigationBarTheme.selectedLabelStyle ?? TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: theme.colorScheme.primary),
        unselectedLabelStyle: theme.bottomNavigationBarTheme.unselectedLabelStyle ?? TextStyle(fontSize: 12, color: theme.colorScheme.onSurface.withOpacity(0.7)),
        showUnselectedLabels: theme.bottomNavigationBarTheme.showUnselectedLabels ?? true,
        type: theme.bottomNavigationBarTheme.type ?? BottomNavigationBarType.fixed,
        backgroundColor: theme.bottomNavigationBarTheme.backgroundColor ?? theme.colorScheme.surface,
        elevation: theme.bottomNavigationBarTheme.elevation ?? 2.0, // Add elevation from theme or default
      ),
    );
  }

  void _onItemTapped(int index, BuildContext context) {
    navigationShell.goBranch(
      index,
      initialLocation: index == navigationShell.currentIndex,
    );
  }
}
