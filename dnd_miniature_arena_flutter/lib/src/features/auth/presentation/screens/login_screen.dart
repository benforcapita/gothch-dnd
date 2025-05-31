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
    final theme = Theme.of(context); // Access theme for colors and text styles

    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [theme.colorScheme.background, theme.colorScheme.surface],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  stops: const [0.0, 0.7], // Adjust stops to match RN version if specific
                ),
              ),
            ),
          ),
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  SizedBox(height: MediaQuery.of(context).size.height * 0.1), // ~10% of screen height

                  // Header
                  Text(
                    'D&D Miniature Arena',
                    textAlign: TextAlign.center,
                    style: theme.textTheme.headlineMedium?.copyWith(
                      color: theme.colorScheme.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  Text(
                    'Your digital tabletop companion awaits!',
                    textAlign: TextAlign.center,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: theme.colorScheme.onSurface.withOpacity(0.8),
                    ),
                  ),
                  const SizedBox(height: 48.0), // Spacing like spacing.xxl

                  // Login Form
                  TextFormField(
                    controller: _emailController,
                    decoration: InputDecoration(
                      labelText: 'Email',
                      hintText: 'Enter your email',
                      border: const OutlineInputBorder(),
                      focusedBorder: OutlineInputBorder(
                        borderSide: BorderSide(color: theme.colorScheme.primary),
                      ),
                      labelStyle: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.8)),
                      hintStyle: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.5)),
                    ),
                    keyboardType: TextInputType.emailAddress,
                    style: TextStyle(color: theme.colorScheme.onSurface),
                    enabled: !authState.isLoading,
                  ),
                  const SizedBox(height: 16.0), // Spacing like spacing.md
                  TextFormField(
                    controller: _passwordController,
                    decoration: InputDecoration(
                      labelText: 'Password',
                      hintText: 'Enter your password',
                      border: const OutlineInputBorder(),
                      focusedBorder: OutlineInputBorder(
                        borderSide: BorderSide(color: theme.colorScheme.primary),
                      ),
                      labelStyle: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.8)),
                      hintStyle: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.5)),
                    ),
                    obscureText: true,
                    style: TextStyle(color: theme.colorScheme.onSurface),
                    enabled: !authState.isLoading,
                  ),
                  const SizedBox(height: 24.0), // Spacing like spacing.lg

                  if (authState.isLoading)
                    const Center(child: CircularProgressIndicator())
                  else
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: theme.colorScheme.primary,
                        foregroundColor: theme.colorScheme.onPrimary, // Text color on button
                        padding: const EdgeInsets.symmetric(vertical: 16.0),
                        textStyle: theme.textTheme.labelLarge,
                      ),
                      onPressed: () {
                        // Basic validation, can be expanded
                        if (_emailController.text.isNotEmpty && _passwordController.text.isNotEmpty) {
                          ref.read(authProvider.notifier).login(
                                _emailController.text,
                                _passwordController.text,
                              );
                        } else {
                          // Optional: Show a snackbar for empty fields
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Please enter email and password')),
                          );
                        }
                      },
                      child: const Text('Login'),
                    ),
                  const SizedBox(height: 16.0),

                  // Guest Login Button
                  TextButton(
                    style: TextButton.styleFrom(
                      foregroundColor: theme.colorScheme.primary,
                      padding: const EdgeInsets.symmetric(vertical: 12.0),
                    ),
                    onPressed: authState.isLoading
                        ? null
                        : () => ref.read(authProvider.notifier).guestLogin(),
                    child: const Text('Continue as Guest'),
                  ),
                  const SizedBox(height: 48.0), // Spacing like spacing.xxl

                  // Features Section
                  Text(
                    'Start Your Adventure',
                    textAlign: TextAlign.center,
                    style: theme.textTheme.titleLarge?.copyWith(
                       color: theme.colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 16.0),
                  _buildFeatureItem(context, Icons.shield, 'Battle & Track: Engage in tactical combat.'),
                  _buildFeatureItem(context, Icons.camera_alt, 'Scan Minis: Bring your collection to life.'),
                  _buildFeatureItem(context, Icons.group, 'Join Rooms: Connect with fellow adventurers.'),
                  _buildFeatureItem(context, Icons.explore, 'Explore Realms: Discover new worlds.'),

                  SizedBox(height: MediaQuery.of(context).size.height * 0.05), // Bottom padding
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureItem(BuildContext context, IconData icon, String text) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: theme.colorScheme.primary.withOpacity(0.8), size: 20),
          const SizedBox(width: 12.0),
          Expanded(
            child: Text(
              text,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurface.withOpacity(0.8),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
