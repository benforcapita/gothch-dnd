import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:dnd_miniature_arena_flutter/src/core/models/user_model.dart';
import 'package:dnd_miniature_arena_flutter/src/core/services/dio_client.dart'; // Import dioClient

// State class for auth
class AuthState {
  final User? user;
  final bool isAuthenticated;
  final bool isLoading;
  final String? errorMessage;

  AuthState({
    this.user,
    this.isAuthenticated = false,
    this.isLoading = false,
    this.errorMessage,
  });

  AuthState copyWith({
    User? user,
    bool? isAuthenticated,
    bool? isLoading,
    String? errorMessage, // Allow clearing the error message by passing null
    bool forceErrorMessageToNull = false, // Helper to explicitly set errorMessage to null
  }) {
    return AuthState(
      user: user ?? this.user,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: forceErrorMessageToNull ? null : errorMessage ?? this.errorMessage,
    );
  }
}

class AuthNotifier extends Notifier<AuthState> {
  final _secureStorage = const FlutterSecureStorage();

  @override
  AuthState build() {
    // Initial state is loading while checking stored token
    _checkInitialAuthStatus();
    // Return an initial loading state. _checkInitialAuthStatus will update it.
    return AuthState(isLoading: true);
  }

  Future<void> _checkInitialAuthStatus() async {
    final token = await _secureStorage.read(key: 'auth_token');
    if (token != null && token.isNotEmpty) {
      try {
        // Set token for dioClient for this check
        dioClient.options.headers['Authorization'] = 'Bearer $token';

        final response = await dioClient.get('/users/me'); // Mock validate token

        final userData = response.data as Map<String, dynamic>;
        final user = User(
          id: userData['id'],
          username: userData['username'],
          email: userData['email'],
        );
        // If successful, update state and keep token in dioClient headers
        state = AuthState(user: user, isAuthenticated: true, isLoading: false);
      } catch (e) {
        // Token invalid or API error
        await _secureStorage.delete(key: 'auth_token');
        dioClient.options.headers.remove('Authorization'); // Clear header
        state = AuthState(isLoading: false, errorMessage: 'Session expired. Please login again.');
      }
    } else {
      // No token found, ensure headers are clear and set initial non-authenticated state
      dioClient.options.headers.remove('Authorization');
      state = AuthState(isLoading: false);
    }
  }

  Future<void> login(String email, String password) async {
    // Clear previous error, set loading
    state = state.copyWith(isLoading: true, forceErrorMessageToNull: true);
    try {
      final response = await dioClient.post('/auth/login', data: {'email': email, 'password': password});
      final token = response.data['token'] as String;
      final userData = response.data['user'] as Map<String, dynamic>;
      final user = User(id: userData['id'], username: userData['username'], email: userData['email']);

      await _secureStorage.write(key: 'auth_token', value: token);
      dioClient.options.headers['Authorization'] = 'Bearer $token'; // Set for subsequent requests

      state = AuthState(user: user, isAuthenticated: true, isLoading: false);
    } on DioException catch (e) {
      state = AuthState(isLoading: false, errorMessage: e.response?.data?['message']?.toString() ?? 'Login failed: Server error');
    } catch (e) {
      state = AuthState(isLoading: false, errorMessage: 'An unexpected error occurred during login.');
    }
  }

  Future<void> guestLogin() async {
    state = state.copyWith(isLoading: true, forceErrorMessageToNull: true);
    // Clear any stored token or API auth headers for guest session
    await _secureStorage.delete(key: 'auth_token');
    dioClient.options.headers.remove('Authorization');

    await Future.delayed(const Duration(milliseconds: 500)); // Simulate quick "setup"
    final guestUser = User(id: 'guest', username: 'Guest Adventurer', email: 'guest@example.com');
    state = AuthState(user: guestUser, isAuthenticated: true, isLoading: false);
  }

  Future<void> logout() async {
    state = state.copyWith(isLoading: true, forceErrorMessageToNull: true);
    await _secureStorage.delete(key: 'auth_token');
    dioClient.options.headers.remove('Authorization');
    // Simulate API logout if exists, for now just clear local state
    await Future.delayed(const Duration(milliseconds: 300)); // Simulate network call
    state = AuthState(isLoading: false); // Clears user and isAuthenticated
  }
}

final authProvider = NotifierProvider<AuthNotifier, AuthState>(AuthNotifier.new);
