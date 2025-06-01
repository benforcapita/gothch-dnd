import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:permission_handler/permission_handler.dart';

class ScanScreen extends ConsumerStatefulWidget {
  const ScanScreen({super.key});

  @override
  ScanScreenState createState() => ScanScreenState();
}

class ScanScreenState extends ConsumerState<ScanScreen> {
  PermissionStatus? _cameraPermissionStatus;
  String? _scannedQrCodeData;
  final MobileScannerController _scannerController = MobileScannerController(
    // Consider adjusting settings if needed, e.g., for faster detection or specific barcode formats
    // detectionTimeout: const Duration(milliseconds: 100), // Example
  );
  bool _isCameraStarted = false;

  @override
  void initState() {
    super.initState();
    _requestCameraPermission();
  }

  Future<void> _requestCameraPermission() async {
    final status = await Permission.camera.request();
    if (mounted) {
      setState(() {
        _cameraPermissionStatus = status;
        if (status.isGranted) {
          _startCamera();
        }
      });
    }
  }

  void _startCamera() {
    // _isCameraStarted flag already tracks if we believe the camera is/should be active.
    // The controller's start() method can be called multiple times; it will do nothing if already started.
    if (mounted && (_cameraPermissionStatus?.isGranted ?? false)) {
       _scannerController.start().then((_) {
        if(mounted) setState(() => _isCameraStarted = true);
      }).catchError((error) {
        debugPrint("Error starting camera: $error");
        if(mounted) setState(() => _isCameraStarted = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to start camera: $error'), backgroundColor: Theme.of(context).colorScheme.error),
        );
      });
    }
  }


  @override
  void dispose() {
    _scannerController.dispose();
    super.dispose();
  }

  void _handleBarcodeDetection(BarcodeCapture capture) {
    final List<Barcode> barcodes = capture.barcodes;
    if (barcodes.isNotEmpty) {
      final Barcode barcode = barcodes.first;
      if (barcode.rawValue != null && barcode.rawValue!.isNotEmpty) {
        if (mounted && _isCameraStarted) { // Process only if camera is supposed to be active
          _scannerController.stop(); // Stop the physical camera first
          setState(() {
            _scannedQrCodeData = barcode.rawValue;
            _isCameraStarted = false;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Scanned: ${barcode.rawValue}')), // Uses default SnackBar theme
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar( // Uses appBarTheme
        title: const Text('Scan Miniature QR Code'),
      ),
      body: Center( // Ensure content is centered if it doesn't fill screen
        child: _buildBody(context, theme),
      ),
    );
  }

  Widget _buildBody(BuildContext context, ThemeData theme) {
    if (_cameraPermissionStatus == null) {
      return const CircularProgressIndicator();
    }

    if (!_cameraPermissionStatus!.isGranted) {
      return Padding(
        padding: const EdgeInsets.all(24.0), // Consistent padding
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch, // Stretch buttons
          children: [
            Icon(Icons.no_photography_outlined, size: 60, color: theme.iconTheme.color?.withOpacity(0.6)),
            const SizedBox(height: 16),
            Text('Camera permission denied.', textAlign: TextAlign.center, style: theme.textTheme.titleLarge),
            const SizedBox(height: 8),
            Text('To scan QR codes, please grant camera access.', textAlign: TextAlign.center, style: theme.textTheme.bodyMedium),
            const SizedBox(height: 24),
            ElevatedButton( // Uses elevatedButtonTheme
              onPressed: _requestCameraPermission,
              child: const Text('Re-request Permission'),
            ),
            const SizedBox(height: 12),
            TextButton( // Uses textButtonTheme
              onPressed: openAppSettings,
              child: const Text('Open App Settings'),
            ),
          ],
        ),
      );
    }

    // Permission granted
    return Column(
      children: [
        Expanded(
          flex: 3,
          child: Container( // Added a background to the scanner area
            color: theme.colorScheme.background.withOpacity(0.9), // Use theme color
            child: Stack(
              alignment: Alignment.center,
              children: [
                if (_isCameraStarted)
                  MobileScanner(
                    controller: _scannerController,
                    onDetect: _handleBarcodeDetection,
                    errorBuilder: (context, error, child) {
                      return Center(child: Text('Scanner Error: ${error.toString()}', style: theme.textTheme.bodyLarge?.copyWith(color: theme.colorScheme.error)));
                    },
                  )
                else if (_scannedQrCodeData == null && !_isCameraStarted)
                   Center(child: Text("Camera is currently off.", style: theme.textTheme.titleMedium?.copyWith(color: theme.colorScheme.onBackground.withOpacity(0.7)))),

                if (_isCameraStarted)
                  Container( // Scanning area indicator
                    width: MediaQuery.of(context).size.width * 0.75,
                    height: MediaQuery.of(context).size.width * 0.55,
                    decoration: BoxDecoration(
                      border: Border.all(color: theme.colorScheme.primary.withOpacity(0.8), width: 4),
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
              ],
            ),
          ),
        ),
        Expanded(
          flex: 2,
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly, // Better spacing for content
              crossAxisAlignment: CrossAxisAlignment.stretch, // Stretch buttons
              children: [
                Text(
                  _isCameraStarted ? 'Point camera at a QR code' : (_scannedQrCodeData != null ? 'Scan Complete!' : 'Press "Start Scan"'),
                  style: theme.textTheme.titleLarge?.copyWith(color: theme.colorScheme.onBackground), // Use onBackground
                  textAlign: TextAlign.center,
                ),
                if (_scannedQrCodeData != null)
                  Card( // Uses cardTheme
                    elevation: 4, // Slightly more elevation for scanned data
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        children: [
                          Text('Scanned Data:', style: theme.textTheme.titleMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
                          const SizedBox(height: 8),
                          SelectableText(_scannedQrCodeData!, style: theme.textTheme.bodyLarge?.copyWith(color: theme.colorScheme.onSurfaceVariant, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ),
                ElevatedButton.icon( // Uses elevatedButtonTheme, but can be customized
                  icon: Icon(_isCameraStarted ? Icons.stop_circle_outlined : Icons.play_circle_outline),
                  label: Text(_isCameraStarted ? 'Stop Scan' : 'Start New Scan'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _isCameraStarted ? theme.colorScheme.errorContainer : theme.colorScheme.primary,
                    foregroundColor: _isCameraStarted ? theme.colorScheme.onErrorContainer : theme.colorScheme.onPrimary,
                    padding: const EdgeInsets.symmetric(vertical: 12), // Consistent padding
                  ),
                  onPressed: () {
                    if (_isCameraStarted) {
                      _scannerController.stop();
                      if (mounted) setState(() => _isCameraStarted = false);
                    } else {
                       if (mounted) {
                         setState(() {
                           _scannedQrCodeData = null;
                         });
                       }
                      _startCamera();
                    }
                  },
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
