import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dnd_miniature_arena_flutter/src/features/auth/application/auth_provider.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  LoginScreenState createState() => LoginScreenState();
}

class LoginScreenState extends ConsumerState<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final theme = Theme.of(context);

    ref.listen<AuthState>(authProvider, (previous, next) {
      if (next.errorMessage != null && next.errorMessage!.isNotEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(next.errorMessage!),
            backgroundColor: theme.colorScheme.error,
            behavior: SnackBarBehavior.floating, // Optional: for a floating SnackBar
          ),
        );
        // It's good practice to have a way to clear the error message in the provider
        // after it has been shown, to prevent it from re-appearing on unrelated rebuilds.
        // For example: ref.read(authProvider.notifier).clearErrorMessage();
      }
    });

    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [theme.colorScheme.background, theme.colorScheme.surface.withOpacity(0.8)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  stops: const [0.0, 0.7],
                ),
              ),
            ),
          ),
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0), // Consistent screen padding
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  SizedBox(height: MediaQuery.of(context).size.height * 0.05), // Reduced top spacing a bit
                  Text(
                    'D&D Miniature Arena',
                    textAlign: TextAlign.center,
                    style: theme.textTheme.headlineLarge?.copyWith( // Using a more prominent style
                      color: theme.colorScheme.primary,
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  Text(
                    'Your digital tabletop companion awaits!',
                    textAlign: TextAlign.center,
                    style: theme.textTheme.titleMedium?.copyWith( // Slightly larger subtitle
                      color: theme.colorScheme.onSurface.withOpacity(0.8),
                    ),
                  ),
                  const SizedBox(height: 40.0), // Adjusted spacing

                  TextFormField(
                    controller: _emailController,
                    decoration: const InputDecoration( // Uses global inputDecorationTheme
                      labelText: 'Email',
                      hintText: 'Enter your email',
                    ),
                    keyboardType: TextInputType.emailAddress,
                    style: theme.textTheme.bodyLarge?.copyWith(color: theme.colorScheme.onSurface), // Ensure text color is right
                    enabled: !authState.isLoading,
                  ),
                  const SizedBox(height: 16.0),

                  TextFormField(
                    controller: _passwordController,
                    decoration: const InputDecoration( // Uses global inputDecorationTheme
                      labelText: 'Password',
                      hintText: 'Enter your password',
                    ),
                    obscureText: true,
                    style: theme.textTheme.bodyLarge?.copyWith(color: theme.colorScheme.onSurface),
                    enabled: !authState.isLoading,
                  ),
                  const SizedBox(height: 24.0),

                  if (authState.isLoading)
                    const Center(child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 16.0), // Add padding to CircularProgressIndicator
                      child: CircularProgressIndicator(),
                    ))
                  else
                    ElevatedButton(
                      // Style comes from elevatedButtonTheme in theme.dart
                      onPressed: () {
                        if (_emailController.text.isNotEmpty && _passwordController.text.isNotEmpty) {
                          ref.read(authProvider.notifier).login(
                                _emailController.text,
                                _passwordController.text,
                              );
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Please enter email and password')),
                          );
                        }
                      },
                      child: const Text('Login'),
                    ),
                  const SizedBox(height: 12.0),

                  TextButton(
                    // Style comes from textButtonTheme in theme.dart
                    onPressed: authState.isLoading
                        ? null
                        : () => ref.read(authProvider.notifier).guestLogin(),
                    child: const Text('Continue as Guest'),
                  ),
                  const SizedBox(height: 36.0),

                  Text(
                    'Manage your collection, engage in battles, and more!',
                    textAlign: TextAlign.center,
                    style: theme.textTheme.bodyMedium?.copyWith( // Using bodyMedium
                       color: theme.colorScheme.onSurface.withOpacity(0.7),
                    ),
                  ),
                  SizedBox(height: MediaQuery.of(context).size.height * 0.05),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
