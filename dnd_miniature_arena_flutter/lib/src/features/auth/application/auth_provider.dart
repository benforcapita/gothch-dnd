import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dnd_miniature_arena_flutter/src/core/models/user_model.dart';

// State class for auth
class AuthState {
  final User? user;
  final bool isAuthenticated;
  final bool isLoading;

  AuthState({this.user, this.isAuthenticated = false, this.isLoading = false});

  AuthState copyWith({User? user, bool? isAuthenticated, bool? isLoading}) {
    return AuthState(
      user: user ?? this.user,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class AuthNotifier extends Notifier<AuthState> {
  @override
  AuthState build() {
    return AuthState(); // Initial state: not authenticated, no user, not loading
  }

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true);
    // Simulate network request
    await Future.delayed(const Duration(seconds: 1));
    // Mock user data
    // In a real app, here you would handle errors and unsuccessful logins
    final user = User(id: '1', username: 'MockUser', email: email);
    state = AuthState(user: user, isAuthenticated: true, isLoading: false);
  }

  Future<void> guestLogin() async {
    state = state.copyWith(isLoading: true);
    await Future.delayed(const Duration(seconds: 1));
    final guestUser = User(id: 'guest', username: 'Guest Adventurer', email: 'guest@example.com');
    state = AuthState(user: guestUser, isAuthenticated: true, isLoading: false);
  }

  Future<void> logout() async {
    state = state.copyWith(isLoading: true);
    await Future.delayed(const Duration(milliseconds: 500)); // Simulate quick network call
    state = AuthState(isLoading: false); // Reset to initial state
  }
}

final authProvider = NotifierProvider<AuthNotifier, AuthState>(AuthNotifier.new);
