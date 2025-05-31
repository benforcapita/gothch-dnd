import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dnd_miniature_arena_flutter/src/features/collection/domain/miniature_model.dart';

class MiniatureNotifier extends Notifier<List<Miniature>> {
  @override
  List<Miniature> build() {
    // Load initial mock miniatures
    return _loadMockMiniatures();
  }

  List<Miniature> _loadMockMiniatures() {
    // Using the generic placeholder image for all mock miniatures
    const String placeholderImageUrl = 'assets/images/placeholder_mini.png';
    return [
      Miniature(id: '1', name: 'Goblin', imageUrl: placeholderImageUrl, rarity: 'Common', set: 'Monster Manual', description: 'A small, green, mischievous creature, always looking for trouble or treasure.'),
      Miniature(id: '2', name: 'Orc Chieftain', imageUrl: placeholderImageUrl, rarity: 'Uncommon', set: 'Monster Manual', description: 'A fierce leader of an orc tribe, adorned with battle scars and crude trophies.'),
      Miniature(id: '3', name: 'Beholder', imageUrl: placeholderImageUrl, rarity: 'Rare', set: 'Monster Manual', description: 'A floating orb of flesh with a large central eye and many smaller eyestalks, each capable of emitting a different magical ray.'),
      Miniature(id: '4', name: 'Young Red Dragon', imageUrl: placeholderImageUrl, rarity: 'Very Rare', set: 'Monster Manual', description: 'A fearsome red dragon, not yet adult but already possessing a fiery breath and a treasure hoard.'),
      Miniature(id: '5', name: 'Skeleton Archer', imageUrl: placeholderImageUrl, rarity: 'Common', set: 'Undead Horde', description: 'An animated skeleton warrior, armed with a bow and quiver of arrows.'),
      Miniature(id: '6', name: 'Mind Flayer', imageUrl: placeholderImageUrl, rarity: 'Rare', set: 'Underdark Encounters', description: 'An aberration with psionic powers, capable of controlling minds and devouring brains.'),
    ];
  }

  void addMiniature(Miniature miniature) {
    // In a real app, this might involve API calls, database updates, etc.
    state = [...state, miniature];
  }

  Miniature? getMiniatureById(String id) {
    try {
      return state.firstWhere((mini) => mini.id == id);
    } catch (e) {
      // This happens if no element satisfies the test.
      return null; // Not found
    }
  }
}

final miniatureProvider = NotifierProvider<MiniatureNotifier, List<Miniature>>(MiniatureNotifier.new);

// Provider to get a single miniature by ID
// This is efficient as it only rebuilds widgets that watch this specific miniature
// and only when that miniature's data (or its existence) changes.
final miniatureByIdProvider = Provider.family<Miniature?, String>((ref, id) {
  // Watch the list of miniatures. If the list changes, this provider will re-evaluate.
  final miniatures = ref.watch(miniatureProvider);
  try {
    return miniatures.firstWhere((mini) => mini.id == id);
  } catch (e) {
    return null; // Not found
  }
});
