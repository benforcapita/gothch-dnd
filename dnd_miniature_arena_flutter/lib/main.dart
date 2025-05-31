import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart'; // Import ProviderScope
import 'package:dnd_miniature_arena_flutter/src/app.dart';

void main() {
  runApp(
    const ProviderScope( // Wrap with ProviderScope
      child: MyApp(),
    ),
  );
}
