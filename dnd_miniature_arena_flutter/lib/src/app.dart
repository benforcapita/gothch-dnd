import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart'; // Import Riverpod
import 'package:dnd_miniature_arena_flutter/src/config/theme.dart';
import 'package:dnd_miniature_arena_flutter/src/core/navigation/app_router.dart'; // Import createAppRouter function

class MyApp extends ConsumerWidget { // Change to ConsumerWidget
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) { // Add WidgetRef
    final appRouter = createAppRouter(ref); // Create/get router instance, passing ref

    return MaterialApp.router(
      title: 'D&D Miniature Arena',
      theme: appThemeData,
      routerConfig: appRouter, // Use the router instance
    );
  }
}
