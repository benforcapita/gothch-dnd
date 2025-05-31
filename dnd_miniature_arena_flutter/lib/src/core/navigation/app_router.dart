import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dnd_miniature_arena_flutter/src/features/auth/application/auth_provider.dart';
import 'package:dnd_miniature_arena_flutter/src/features/auth/presentation/screens/login_screen.dart';
import 'package:dnd_miniature_arena_flutter/src/features/home/presentation/screens/home_screen.dart';

// Import all the new screen widgets
import 'package:dnd_miniature_arena_flutter/src/features/collection/presentation/screens/collection_screen.dart';
import 'package:dnd_miniature_arena_flutter/src/features/collection/presentation/screens/miniature_detail_screen.dart';
import 'package:dnd_miniature_arena_flutter/src/features/scan/presentation/screens/scan_screen.dart';
import 'package:dnd_miniature_arena_flutter/src/features/rooms_and_realms/presentation/screens/rooms_and_realms_screen.dart';
import 'package:dnd_miniature_arena_flutter/src/features/battle/presentation/screens/battle_screen.dart';
import 'package:dnd_miniature_arena_flutter/src/features/battle/presentation/screens/battle_setup_screen.dart';
import 'package:dnd_miniature_arena_flutter/src/features/profile/presentation/screens/profile_screen.dart';

// Define GlobalKey<NavigatorState> for each nested navigator if needed for deep linking later
final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'root');
// final GlobalKey<NavigatorState> _shellNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'shell'); // Not strictly needed for simple shell routes like this one
import 'package:dnd_miniature_arena_flutter/src/features/home/presentation/screens/home_tab_content_screen.dart'; // Import HomeTabContentScreen


GoRouter createAppRouter(Ref ref) {
  // ValueNotifier to bridge Riverpod state to GoRouter's refreshListenable
  final authStateAsyncNotifier = ValueNotifier<AsyncValue<AuthState>>(
    AsyncValue.data(ref.watch(authProvider))
  );

  ref.listen<AuthState>(authProvider, (previous, next) {
     authStateAsyncNotifier.value = AsyncValue.data(next);
  });

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    refreshListenable: authStateAsyncNotifier,
    initialLocation: '/home', // Default to home tab
    routes: <RouteBase>[
      GoRoute(
        path: '/login',
        parentNavigatorKey: _rootNavigatorKey, // Ensure login is outside the shell
        builder: (context, state) => const LoginScreen(),
      ),
      // StatefulShellRoute for bottom navigation
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          // The HomeScreen now acts as the shell for the tabs
          return HomeScreen(navigationShell: navigationShell);
        },
        branches: <StatefulShellBranch>[
          // Branch 1: Home Tab
          StatefulShellBranch(
            // navigatorKey: GlobalKey<NavigatorState>(debugLabel: 'homeTab'), // Optional: separate navigator key for each tab
            routes: <RouteBase>[
              GoRoute(
                path: '/home',
                builder: (BuildContext context, GoRouterState state) => const HomeTabContentScreen(),
              ),
            ],
          ),
          // Branch 2: Collection Tab
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/collection',
                builder: (BuildContext context, GoRouterState state) => const CollectionScreen(),
                routes: <RouteBase>[
                  GoRoute(
                    path: 'detail/:miniatureId',
                    builder: (BuildContext context, GoRouterState state) {
                      final miniatureId = state.pathParameters['miniatureId']!;
                      return MiniatureDetailScreen(miniatureId: miniatureId);
                    },
                  ),
                ],
              ),
            ],
          ),
          // Branch 3: Scan Tab
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/scan',
                builder: (BuildContext context, GoRouterState state) => const ScanScreen(),
              ),
            ],
          ),
          // Branch 4: Realms Tab
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/realms',
                builder: (BuildContext context, GoRouterState state) => const RoomsAndRealmsScreen(),
              ),
            ],
          ),
          // Branch 5: Battle Tab
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/battle',
                builder: (BuildContext context, GoRouterState state) => const BattleScreen(),
                routes: <RouteBase>[
                   GoRoute(
                    path: 'setup', // battle/setup
                    builder: (BuildContext context, GoRouterState state) => const BattleSetupScreen(),
                  ),
                ],
              ),
            ],
          ),
          // Branch 6: Profile Tab
          StatefulShellBranch(
            routes: <RouteBase>[
              GoRoute(
                path: '/profile',
                builder: (BuildContext context, GoRouterState state) => const ProfileScreen(),
              ),
            ],
          ),
        ],
      ),
    ],
    redirect: (BuildContext context, GoRouterState state) {
      final authState = ref.read(authProvider);
      final isAuthenticated = authState.isAuthenticated;
      final isLoading = authState.isLoading;

      final String location = state.uri.toString();
      final bool isLoggingIn = location == '/login';

      if (isLoading) return null;

      if (!isAuthenticated && !isLoggingIn) {
        return '/login';
      }

      if (isAuthenticated && isLoggingIn) {
        return '/home'; // Default to home tab after login
      }

      // If authenticated and at the root path (e.g. from initial load), redirect to /home
      if (isAuthenticated && location == '/') {
        return '/home';
      }

      return null;
    },
  );
}
