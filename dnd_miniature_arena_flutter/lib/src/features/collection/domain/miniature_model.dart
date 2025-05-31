class Miniature {
  final String id;
  final String name;
  final String imageUrl; // URL or local asset path
  final String rarity; // e.g., Common, Uncommon, Rare
  final String set; // e.g., Monster Manual, Volo's Guide
  final String description;
  int currentHp; // Temporary for battle setup simplicity as per plan

  Miniature({
    required this.id,
    required this.name,
    required this.imageUrl,
    this.rarity = 'Common',
    this.set = 'Unknown Set',
    this.description = 'No description available.',
    this.currentHp = 10, // Default HP, will be used as initial current HP
  });

   Miniature copyWith({
    String? id,
    String? name,
    String? imageUrl,
    String? rarity,
    String? set,
    String? description,
    int? currentHp,
  }) {
    return Miniature(
      id: id ?? this.id,
      name: name ?? this.name,
      imageUrl: imageUrl ?? this.imageUrl,
      rarity: rarity ?? this.rarity,
      set: set ?? this.set,
      description: description ?? this.description,
      currentHp: currentHp ?? this.currentHp,
    );
  }
}
