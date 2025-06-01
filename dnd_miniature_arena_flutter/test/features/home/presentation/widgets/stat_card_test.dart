import 'package:dnd_miniature_arena_flutter/src/features/home/presentation/widgets/stat_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dnd_miniature_arena_flutter/src/config/theme.dart'; // For appThemeData

void main() {
  testWidgets('StatCard displays label, value, and icon', (WidgetTester tester) async {
    const testLabel = 'Miniatures';
    const testValue = '123';
    const testIcon = Icons.shield_outlined; // Using an outlined icon as in recent updates

    // Build our widget and trigger a frame.
    await tester.pumpWidget(
      MaterialApp(
        theme: appThemeData, // Apply the actual app theme to the test environment
        home: const Scaffold(
          body: Center( // Center the card to avoid overflow if it's larger than expected
            child: StatCard(
              label: testLabel,
              value: testValue,
              icon: testIcon,
            ),
          ),
        ),
      ),
    );

    // Verify that the label, value, and icon are displayed.
    expect(find.text(testLabel), findsOneWidget);
    expect(find.text(testValue), findsOneWidget);
    expect(find.byIcon(testIcon), findsOneWidget);

    // Additionally, verify some theme properties if needed, e.g., icon color
    final iconWidget = tester.widget<Icon>(find.byIcon(testIcon));
    // Note: Direct color comparison can be tricky due to Theme and ColorScheme.
    // This is a basic check; more complex checks might involve evaluating Theme.of(context).
    // For this test, presence is the main goal.
    // expect(iconWidget.color, appThemeData.colorScheme.primary); // Example, if color is directly set
  });
}
