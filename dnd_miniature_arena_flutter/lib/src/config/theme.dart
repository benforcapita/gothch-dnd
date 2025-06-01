import 'package:flutter/material.dart';

// Color Constants
class AppColors {
  static const Color primary = Color(0xFF4FC3F7);
  static const Color secondary = Color(0xFF29B6F6);
  static const Color tertiary = Color(0xFF0277BD);

  static const Color surface = Color(0xFF1B263B);
  static const Color background = Color(0xFF0D1B2A);

  static const Color onPrimary = Colors.black;
  static const Color onSecondary = Colors.black;
  static const Color onTertiary = Colors.white;

  static const Color onSurface = Color(0xFFFFFFFF);
  static const Color onBackground = Color(0xFFFFFFFF);

  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFFE0E0E0);

  static const Color border = Color(0xFF3E506C);
  static const Color error = Color(0xFFD32F2F);
  static const Color onError = Colors.white;

  // Define opaque colors for containers based on theme colors with opacity
  static const Color primaryContainerOpaque = Color(0x4D4FC3F7); // primary.withOpacity(0.3) -> 0.3 * 255 = 76.5 -> 0x4D
  static const Color secondaryContainerOpaque = Color(0x4D29B6F6); // secondary.withOpacity(0.3)
  static const Color errorContainerOpaque = Color(0x4DD32F2F); // error.withOpacity(0.3)

  // Define onSecondaryContainer if it's used, e.g. for text on secondaryContainerOpaque
  static const Color onSecondaryContainer = Colors.white; // Assuming text on secondary container is white
}

// Typography
const TextTheme appTextTheme = TextTheme(
  displayLarge: TextStyle(fontSize: 57.0, fontWeight: FontWeight.bold, color: AppColors.textPrimary, letterSpacing: -0.25),
  displayMedium: TextStyle(fontSize: 45.0, fontWeight: FontWeight.bold, color: AppColors.textPrimary, letterSpacing: 0.0),
  displaySmall: TextStyle(fontSize: 36.0, fontWeight: FontWeight.bold, color: AppColors.textPrimary, letterSpacing: 0.0),
  headlineLarge: TextStyle(fontSize: 32.0, fontWeight: FontWeight.bold, color: AppColors.textPrimary, letterSpacing: 0.0),
  headlineMedium: TextStyle(fontSize: 28.0, fontWeight: FontWeight.bold, color: AppColors.textPrimary, letterSpacing: 0.0),
  headlineSmall: TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold, color: AppColors.textPrimary, letterSpacing: 0.0),
  titleLarge: TextStyle(fontSize: 22.0, fontWeight: FontWeight.w600, color: AppColors.textPrimary, letterSpacing: 0.15),
  titleMedium: TextStyle(fontSize: 16.0, fontWeight: FontWeight.w500, color: AppColors.textPrimary, letterSpacing: 0.15),
  titleSmall: TextStyle(fontSize: 14.0, fontWeight: FontWeight.w500, color: AppColors.textPrimary, letterSpacing: 0.1),
  bodyLarge: TextStyle(fontSize: 16.0, fontWeight: FontWeight.normal, color: AppColors.textPrimary, letterSpacing: 0.5),
  bodyMedium: TextStyle(fontSize: 14.0, fontWeight: FontWeight.normal, color: AppColors.textSecondary, letterSpacing: 0.25),
  bodySmall: TextStyle(fontSize: 12.0, fontWeight: FontWeight.normal, color: AppColors.textSecondary, letterSpacing: 0.4),
  labelLarge: TextStyle(fontSize: 14.0, fontWeight: FontWeight.w600, color: AppColors.onPrimary, letterSpacing: 0.1),
  labelMedium: TextStyle(fontSize: 12.0, fontWeight: FontWeight.w500, color: AppColors.textPrimary, letterSpacing: 0.5),
  labelSmall: TextStyle(fontSize: 11.0, fontWeight: FontWeight.w500, color: AppColors.textSecondary, letterSpacing: 0.5),
);

// ThemeData
final ThemeData appThemeData = ThemeData(
  brightness: Brightness.dark,
  primaryColor: AppColors.primary,
  scaffoldBackgroundColor: AppColors.background,

  colorScheme: const ColorScheme(
    primary: AppColors.primary,
    secondary: AppColors.secondary,
    tertiary: AppColors.tertiary,
    surface: AppColors.surface,
    background: AppColors.background,
    error: AppColors.error,
    onPrimary: AppColors.onPrimary,
    onSecondary: AppColors.onSecondary,
    onTertiary: AppColors.onTertiary,
    onSurface: AppColors.onSurface,
    onBackground: AppColors.onBackground,
    onError: AppColors.onError,
    brightness: Brightness.dark,
    surfaceContainerHighest: AppColors.surface,
    surfaceVariant: AppColors.surface,
    onSurfaceVariant: AppColors.onSurface,
    primaryContainer: AppColors.primaryContainerOpaque, // Use opaque version
    onPrimaryContainer: AppColors.textPrimary,
    secondaryContainer: AppColors.secondaryContainerOpaque, // Use opaque version
    onSecondaryContainer: AppColors.onSecondaryContainer, // Ensure this is defined in AppColors
    errorContainer: AppColors.errorContainerOpaque, // Use opaque version
    onErrorContainer: AppColors.textPrimary,
  ),

  textTheme: appTextTheme,

  appBarTheme: AppBarTheme(
    backgroundColor: AppColors.surface,
    foregroundColor: AppColors.onSurface,
    elevation: 2.0,
    titleTextStyle: appTextTheme.titleLarge?.copyWith(color: AppColors.onSurface),
    iconTheme: IconThemeData(color: AppColors.onSurface.withOpacity(0.8)),
  ),

  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: AppColors.primary,
      foregroundColor: AppColors.onPrimary,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
      padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
      textStyle: appTextTheme.labelLarge,
    ),
  ),

  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(
      foregroundColor: AppColors.primary,
      textStyle: appTextTheme.labelLarge?.copyWith(color: AppColors.primary), // labelLarge already has onPrimary, this might need adjustment if onPrimary is black
    ),
  ),

  cardTheme: CardThemeData( // Use CardThemeData()
    elevation: 2.0,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
    margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 4.0),
    color: AppColors.surface,
    clipBehavior: Clip.antiAlias,
  ),

  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: AppColors.background.withOpacity(0.5),
    hintStyle: appTextTheme.bodyMedium?.copyWith(color: AppColors.textSecondary.withOpacity(0.7)),
    labelStyle: appTextTheme.bodyLarge?.copyWith(color: AppColors.textSecondary),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8.0),
      borderSide: const BorderSide(color: AppColors.border, width: 1.0),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8.0),
      borderSide: BorderSide(color: AppColors.border.withOpacity(0.7), width: 1.0),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8.0),
      borderSide: const BorderSide(color: AppColors.primary, width: 2.0),
    ),
    errorBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8.0),
      borderSide: const BorderSide(color: AppColors.error, width: 1.0),
    ),
    focusedErrorBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8.0),
      borderSide: const BorderSide(color: AppColors.error, width: 2.0),
    ),
    contentPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
  ),

  iconTheme: IconThemeData(
    color: AppColors.onSurface.withOpacity(0.8),
    size: 24.0,
  ),

  chipTheme: ChipThemeData(
    backgroundColor: AppColors.secondary.withOpacity(0.2),
    labelStyle: appTextTheme.labelMedium?.copyWith(color: AppColors.onSecondaryContainer), // Changed to use defined onSecondaryContainer
    iconTheme: IconThemeData(color: AppColors.secondary, size: 18), // Ensure AppColors.secondary is suitable contrast with AppColors.onSecondaryContainer
    padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 8.0),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
  ),
);
