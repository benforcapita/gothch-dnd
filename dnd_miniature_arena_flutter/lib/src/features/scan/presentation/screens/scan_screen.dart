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
    // Detection speed can be normal, fast, or noDuplicates.
    // detectionSpeed: DetectionSpeed.normal,
    // facing: CameraFacing.back,
    // torchEnabled: false,
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
    if (!_scannerController.isStarting && mounted) {
       _scannerController.start().then((_) {
        if(mounted) setState(() => _isCameraStarted = true);
      }).catchError((error) {
        // Handle any errors during camera start, though MobileScannerController usually manages this.
        debugPrint("Error starting camera: $error");
        if(mounted) setState(() => _isCameraStarted = false);
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
        if (mounted) {
          setState(() {
            _scannedQrCodeData = barcode.rawValue;
            _isCameraStarted = false; // Stop camera by UI logic
          });
          _scannerController.stop(); // Stop the physical camera
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Scanned: ${barcode.rawValue}')),
          );
          // In a real app, you might want to process _scannedQrCodeData here
          // e.g., ref.read(miniatureProvider.notifier).addMiniatureFromQrData(_scannedQrCodeData!);
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan Miniature QR Code'),
        backgroundColor: theme.colorScheme.surfaceContainerHighest,
      ),
      body: Center(
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
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Camera permission denied.', textAlign: TextAlign.center),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _requestCameraPermission,
              child: const Text('Re-request Permission'),
            ),
            const SizedBox(height: 8),
            TextButton(
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
          child: Stack(
            alignment: Alignment.center,
            children: [
              if (_isCameraStarted)
                MobileScanner(
                  controller: _scannerController,
                  onDetect: _handleBarcodeDetection,
                  errorBuilder: (context, error, child) {
                    // Consider more user-friendly error display
                    return Center(child: Text('Scanner Error: ${error.toString()}', style: TextStyle(color: theme.colorScheme.error)));
                  },
                )
              else if (_scannedQrCodeData == null) // Show only if no data scanned yet and camera not started (e.g. initial state or after stop)
                 Center(child: Text("Camera stopped or not started.", style: theme.textTheme.titleMedium)),

              // Overlay for scanning area indicator
              if (_isCameraStarted)
                Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: theme.colorScheme.primary.withOpacity(0.7), width: 3),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  width: MediaQuery.of(context).size.width * 0.7,
                  height: MediaQuery.of(context).size.width * 0.5, // Rectangular scan area
                ),
            ],
          ),
        ),
        Expanded(
          flex: 2,
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  _isCameraStarted ? 'Point camera at a QR code' : (_scannedQrCodeData != null ? 'Scan Complete!' : 'Press "Start Scan"'),
                  style: theme.textTheme.titleMedium,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                if (_scannedQrCodeData != null)
                  Card(
                    elevation: 2,
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        children: [
                          Text('Scanned Data:', style: theme.textTheme.titleSmall),
                          const SizedBox(height: 8),
                          SelectableText(_scannedQrCodeData!, style: theme.textTheme.bodyLarge),
                        ],
                      ),
                    ),
                  ),
                const SizedBox(height: 20),
                ElevatedButton.icon(
                  icon: Icon(_isCameraStarted ? Icons.stop_circle_outlined : Icons.play_circle_outline),
                  label: Text(_isCameraStarted ? 'Stop Scan' : 'Start Scan'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _isCameraStarted ? theme.colorScheme.errorContainer : theme.colorScheme.primaryContainer,
                    foregroundColor: _isCameraStarted ? theme.colorScheme.onErrorContainer : theme.colorScheme.onPrimaryContainer,
                  ),
                  onPressed: () {
                    if (_isCameraStarted) {
                      _scannerController.stop();
                      if (mounted) setState(() => _isCameraStarted = false);
                    } else {
                       if (mounted) {
                         setState(() {
                           _scannedQrCodeData = null; // Clear previous scan data before starting new scan
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
