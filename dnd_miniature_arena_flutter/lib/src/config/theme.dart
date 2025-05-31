import 'package:flutter/material.dart';

// Color Constants
const Color primaryColor = Color(0xFF4FC3F7);
const Color secondaryColor = Color(0xFF29B6F6);
const Color tertiaryColor = Color(0xFF0277BD);
const Color surfaceColor = Color(0xFF1B263B);
const Color backgroundColor = Color(0xFF0D1B2A);
const Color onSurfaceTextColor = Color(0xFFFFFFFF);
const Color textSecondaryColor = Color(0xFFE0E0E0);
const Color borderColor = Color(0xFF3E506C);

// Typography (Placeholders)
const TextTheme appTextTheme = TextTheme(
  displayLarge: TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold, color: onSurfaceTextColor),
  displayMedium: TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold, color: onSurfaceTextColor),
  bodyLarge: TextStyle(fontSize: 16.0, color: onSurfaceTextColor),
  bodyMedium: TextStyle(fontSize: 14.0, color: textSecondaryColor),
  labelLarge: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold, color: onSurfaceTextColor),
);

// ThemeData
final ThemeData appThemeData = ThemeData(
  brightness: Brightness.dark,
  primaryColor: primaryColor,
  scaffoldBackgroundColor: backgroundColor,
  colorScheme: const ColorScheme(
    primary: primaryColor,
    secondary: secondaryColor,
    tertiary: tertiaryColor,
    surface: surfaceColor,
    background: backgroundColor,
    error: Colors.red, // Placeholder
    onPrimary: onSurfaceTextColor,
    onSecondary: onSurfaceTextColor,
    onSurface: onSurfaceTextColor,
    onBackground: onSurfaceTextColor,
    onError: Colors.black, // Placeholder
    brightness: Brightness.dark,
  ),
  textTheme: appTextTheme,
  appBarTheme: AppBarTheme(
    backgroundColor: surfaceColor,
    foregroundColor: onSurfaceTextColor,
    titleTextStyle: appTextTheme.displayMedium,
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: primaryColor,
      foregroundColor: onSurfaceTextColor,
      textStyle: appTextTheme.labelLarge,
    ),
  ),
  inputDecorationTheme: InputDecorationTheme(
    border: OutlineInputBorder(
      borderSide: BorderSide(color: borderColor),
    ),
    focusedBorder: OutlineInputBorder(
      borderSide: BorderSide(color: primaryColor),
    ),
    labelStyle: TextStyle(color: textSecondaryColor),
  ),
  // Add other theme properties as needed
);
