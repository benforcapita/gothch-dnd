import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import 'package:dnd_miniature_arena_flutter/src/features/auth/application/auth_provider.dart';
import 'package:dnd_miniature_arena_flutter/src/core/models/user_model.dart';
import 'package:dnd_miniature_arena_flutter/src/core/services/dio_client.dart';
import 'auth_provider_test.mocks.dart';
import 'package:flutter/services.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  Map<String, String?> mockStorage = {};

  setUpAll(() {
    const MethodChannel channel = MethodChannel('plugins.it_nomads.com/flutter_secure_storage');
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger.setMockMethodCallHandler(channel, (MethodCall methodCall) async {
      switch (methodCall.method) {
        case 'read':
          return mockStorage[methodCall.arguments['key']];
        case 'write':
          mockStorage[methodCall.arguments['key']] = methodCall.arguments['value'];
          return null;
        case 'delete':
          mockStorage.remove(methodCall.arguments['key']);
          return null;
        default:
          return null;
      }
    });
  });

  tearDownAll(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger.setMockMethodCallHandler(
      const MethodChannel('plugins.it_nomads.com/flutter_secure_storage'), null);
  });

  late ProviderContainer container;

  setUp(() {
    dioClient.options.headers.remove('Authorization');
    mockStorage.clear();
    container = ProviderContainer();
  });

  tearDown(() {
    container.dispose();
  });

  group('AuthProvider Unit Tests', () {

    test('Initial state settles to unauthenticated if no token', () async {
      // Arrange: Provider is created in setUp. _checkInitialAuthStatus is called.
      // Mock Secure Storage's 'read' will return null.

      // Act: Initial isLoading state is set by build()
      expect(container.read(authProvider).isLoading, isTrue, reason: "Should be loading initially.");

      // Wait for async operations in _checkInitialAuthStatus to complete.
      // Using Future.delayed(Duration.zero) to allow microtasks to run.
      await Future.delayed(Duration.zero);

      // Assert
      final finalState = container.read(authProvider);
      expect(finalState.isLoading, isFalse, reason: "isLoading should be false after initial check.");
      expect(finalState.isAuthenticated, isFalse, reason: "isAuthenticated should be false if no token.");
      expect(finalState.user, isNull, reason: "User should be null if no token.");
      expect(finalState.errorMessage, isNull, reason: "Error message should be null.");
    }, timeout: Timeout(const Duration(seconds: 2))); // Added timeout for safety with async ops

    test('Login success updates state correctly', () async {
      // Arrange: Wait for initial state to settle
      await Future.delayed(Duration.zero); // Allow _checkInitialAuthStatus to run
      if (container.read(authProvider).isLoading) { // If still loading, wait a bit more
         await Future.delayed(const Duration(milliseconds: 50));
      }

      // Act
      await container.read(authProvider.notifier).login('test@example.com', 'password');

      // Assert
      final finalState = container.read(authProvider);
      expect(finalState.isAuthenticated, isTrue);
      expect(finalState.user?.email, 'test@example.com');
      expect(finalState.user?.username, 'test');
      expect(finalState.isLoading, isFalse);
      expect(finalState.errorMessage, isNull);
      expect(dioClient.options.headers['Authorization'], startsWith('Bearer mock_jwt_token_from_api_for_test@example.com'));
      expect(mockStorage['auth_token'], startsWith('mock_jwt_token_from_api_for_test@example.com'));
    });

    test('Login failure (empty email) updates state with error message', () async {
      // Arrange: Wait for initial state to settle
      await Future.delayed(Duration.zero);
      if (container.read(authProvider).isLoading) {
         await Future.delayed(const Duration(milliseconds: 50));
      }

      // Act
      await container.read(authProvider.notifier).login('', 'password');

      // Assert
      final finalState = container.read(authProvider);
      expect(finalState.isAuthenticated, isFalse);
      expect(finalState.user, isNull);
      expect(finalState.isLoading, isFalse);
      expect(finalState.errorMessage, 'Email cannot be empty');
    });

    test('Logout clears auth state, dioClient header, and secure storage', () async {
      // Arrange: Login first & ensure initial state is settled
      await Future.delayed(Duration.zero);
      if (container.read(authProvider).isLoading) {
         await Future.delayed(const Duration(milliseconds: 50));
      }
      await container.read(authProvider.notifier).login('testlogout@example.com', 'password');

      final loggedInState = container.read(authProvider);
      expect(loggedInState.isAuthenticated, isTrue, reason: "Pre-condition: User should be logged in.");

      // Act
      await container.read(authProvider.notifier).logout();

      // Assert
      final finalState = container.read(authProvider);
      expect(finalState.isAuthenticated, isFalse);
      expect(finalState.user, isNull);
      expect(finalState.isLoading, isFalse);
      expect(finalState.errorMessage, isNull);
      expect(dioClient.options.headers['Authorization'], isNull, reason: "Dio header should be cleared.");
      expect(mockStorage['auth_token'], isNull, reason: "Token should be cleared from mock storage.");
    });

    test('Guest login updates state correctly and clears secure storage/Dio header', () async {
      // Arrange
      mockStorage['auth_token'] = 'some_initial_token';
      dioClient.options.headers['Authorization'] = 'Bearer some_initial_token';
      await Future.delayed(Duration.zero);
       if (container.read(authProvider).isLoading) {
         await Future.delayed(const Duration(milliseconds: 50));
      }

      // Act
      await container.read(authProvider.notifier).guestLogin();

      // Assert
      final finalState = container.read(authProvider);
      expect(finalState.isAuthenticated, isTrue);
      expect(finalState.user?.id, 'guest');
      expect(finalState.user?.username, 'Guest Adventurer');
      expect(finalState.isLoading, isFalse);
      expect(finalState.errorMessage, isNull);
      expect(dioClient.options.headers['Authorization'], isNull);
      expect(mockStorage['auth_token'], isNull);
    });
  });
}
