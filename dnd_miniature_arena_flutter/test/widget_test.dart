import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dnd_miniature_arena_flutter/src/app.dart';
import 'package:dnd_miniature_arena_flutter/src/features/auth/application/auth_provider.dart';
import 'package:dnd_miniature_arena_flutter/src/features/auth/presentation/screens/login_screen.dart';
import 'package:dnd_miniature_arena_flutter/src/core/models/user_model.dart';

// A mock AuthNotifier that starts in an unauthenticated state
class MockAuthNotifier extends AuthNotifier {
  // If AuthNotifier has a constructor that takes Ref, this mock needs to handle it too.
  // Assuming AuthNotifier has a no-arg constructor or its Ref is not strictly needed for `build`.
  // If it uses `ref` in `build` for other providers, this mock might need more setup
  // or those providers would also need to be mocked/overridden.

  @override
  AuthState build() {
    // Override _checkInitialAuthStatus to do nothing and set a defined unauthenticated state.
    // This bypasses the async _checkInitialAuthStatus for synchronous testing of initial UI.
    return AuthState(isAuthenticated: false, isLoading: false, user: null);
  }

  // Override other methods like login/logout to do nothing or update state predictably for tests
  @override
  Future<void> login(String email, String password) async {
    // For widget tests focusing on UI reaction to state changes, you can simulate them here.
    // For this smoke test, we are mostly interested in the initial state.
    // state = AuthState(isAuthenticated: true, user: User(id: 'mock', username: 'Mock', email: email), isLoading: false);
  }

  @override
  Future<void> guestLogin() async {
    // state = AuthState(isAuthenticated: true, user: User(id: 'guest', username: 'Guest', email: 'guest@example.com'), isLoading: false);
  }

  @override
  Future<void> logout() async {
    // state = AuthState(isAuthenticated: false, isLoading: false);
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('App smoke test - initial screen is LoginScreen when unauthenticated', (WidgetTester tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          // Corrected override: use a no-arg factory if MockAuthNotifier() takes no args.
          // AuthNotifier.new is the default way NotifierProvider creates the notifier.
          authProvider.overrideWith(() => MockAuthNotifier()),
        ],
        child: const MyApp(),
      ),
    );

    // pumpAndSettle is important to allow GoRouter to process redirects based on the auth state.
    await tester.pumpAndSettle();

    expect(find.byType(LoginScreen), findsOneWidget, reason: "Should show LoginScreen when unauthenticated by mock.");
    expect(find.text('D&D Miniature Arena'), findsOneWidget, reason: "LoginScreen title should be present.");
    expect(find.byType(MyApp), findsOneWidget);
  });
}
