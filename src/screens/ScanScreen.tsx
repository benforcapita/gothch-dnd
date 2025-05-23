import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  Vibration,
} from 'react-native';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { colors, spacing, typography, shadows } from '../utils/theme';
import { addToCollection } from '../store/slices/miniatureSlice';
import { incrementCollectibles, addExperience } from '../store/slices/userSlice';
import type { MainTabParamList, QRMiniatureData, Miniature } from '../types';

type ScanScreenNavigationProp = BottomTabNavigationProp<MainTabParamList, 'Scan'>;

const ScanScreen: React.FC = () => {
  const navigation = useNavigation<ScanScreenNavigationProp>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [scannedData, setScannedData] = useState<QRMiniatureData | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarCodeScannerResult) => {
    setScanned(true);
    Vibration.vibrate(100);

    try {
      const miniatureData: QRMiniatureData = JSON.parse(data);
      
      if (miniatureData.miniature_type === 'dnd_miniature') {
        setScannedData(miniatureData);
        setShowModal(true);
      } else {
        Alert.alert(
          'Invalid QR Code',
          'This QR code is not for a D&D miniature.',
          [{ text: 'OK', onPress: () => setScanned(false) }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Invalid QR Code',
        'Could not read the QR code data. Please try again.',
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    }
  };

  const addMiniatureToCollection = () => {
    if (scannedData) {
      // Convert QR data to Miniature format
      const miniatureForCollection: Miniature = {
        id: scannedData.id,
        name: scannedData.name,
        source: scannedData.source,
        challenge_rating: scannedData.challenge_rating,
        size: scannedData.size,
        type: scannedData.creature_type,
        stats: scannedData.stats,
        actions: scannedData.actions,
        rarity: scannedData.rarity,
        collection_series: scannedData.collection_series,
        print_batch: scannedData.print_batch,
        verification_hash: scannedData.verification_hash,
        level: scannedData.challenge_rating || 1,
        isFavorited: false,
        acquired_at: new Date().toISOString(),
        times_used_in_battle: 0,
      };

      // Dispatch to Redux store
      dispatch(addToCollection(miniatureForCollection));
      dispatch(incrementCollectibles());
      dispatch(addExperience(50)); // Award 50 XP for scanning a miniature

      setShowModal(false);
      setScanned(false);

      Alert.alert(
        'Success!',
        `${scannedData.name} has been added to your collection!`,
        [
          {
            text: 'View Collection',
            onPress: () => navigation.navigate('Collection'),
          },
          {
            text: 'Scan Another',
            onPress: () => {},
          },
        ]
      );
    }
  };

  const MiniaturePreviewModal: React.FC = () => (
    <Modal
      visible={showModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Miniature Found!</Text>
            <TouchableOpacity
              onPress={() => {
                setShowModal(false);
                setScanned(false);
              }}
            >
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {scannedData && (
            <View style={styles.miniatureInfo}>
              <LinearGradient
                colors={[colors.surface, colors.card]}
                style={styles.miniatureCard}
              >
                <Text style={styles.miniatureName}>{scannedData.name}</Text>
                <Text style={styles.miniatureSubtitle}>
                  {scannedData.size} {scannedData.creature_type}
                </Text>
                <Text style={styles.miniatureDetails}>
                  Challenge Rating: {scannedData.challenge_rating || 'N/A'}
                </Text>
                <Text style={styles.miniatureRarity}>
                  Rarity: {scannedData.rarity}
                </Text>
              </LinearGradient>
            </View>
          )}

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setShowModal(false);
                setScanned(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.addButton]}
              onPress={addMiniatureToCollection}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.addButtonGradient}
              >
                <Text style={styles.addButtonText}>Add to Collection</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="camera-alt" size={64} color={colors.textMuted} />
        <Text style={styles.message}>No access to camera</Text>
        <Text style={styles.submessage}>
          Please enable camera access in your device settings to scan QR codes.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.camera}
      />
      
      {/* Overlay UI */}
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Scan</Text>
          <Text style={styles.subtitle}>
            Scan the QR code on the miniature's packaging to add it to your collection.
          </Text>
        </View>

        {/* Scanning Frame */}
        <View style={styles.scanningArea}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            
            {!scanned && (
              <View style={styles.scanningLine}>
                <LinearGradient
                  colors={[colors.primary, 'transparent']}
                  style={styles.scanningLineGradient}
                />
              </View>
            )}
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Position the QR code within the frame
          </Text>
        </View>

        {/* Rescan Button */}
        {scanned && (
          <TouchableOpacity
            style={styles.rescanButton}
            onPress={() => setScanned(false)}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.rescanButtonGradient}
            >
              <Icon name="refresh" size={24} color={colors.text} />
              <Text style={styles.rescanButtonText}>Scan Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      <MiniaturePreviewModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: 'rgba(15, 15, 35, 0.9)',
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  scanningArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.primary,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanningLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
  },
  scanningLineGradient: {
    flex: 1,
    height: 2,
  },
  instructions: {
    backgroundColor: 'rgba(15, 15, 35, 0.9)',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  instructionText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  rescanButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    ...shadows.medium,
  },
  rescanButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rescanButtonText: {
    ...typography.button,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  message: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  submessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    margin: spacing.lg,
    maxWidth: '90%',
    width: '100%',
    ...shadows.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
  },
  miniatureInfo: {
    marginBottom: spacing.lg,
  },
  miniatureCard: {
    padding: spacing.lg,
    borderRadius: 12,
  },
  miniatureName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  miniatureSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  miniatureDetails: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  miniatureRarity: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cancelButton: {
    backgroundColor: colors.card,
    padding: spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.textSecondary,
  },
  addButton: {
    ...shadows.small,
  },
  addButtonGradient: {
    padding: spacing.md,
    alignItems: 'center',
  },
  addButtonText: {
    ...typography.button,
    color: colors.text,
  },
});

export default ScanScreen; 