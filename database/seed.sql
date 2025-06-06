-- Seed data for Gothic D&D App

-- Insert sample quests
INSERT INTO quests (title, description, gold_reward, experience_reward) VALUES
('First Steps', 'Complete your first quest and begin your journey', 50, 100),
('Gold Collector', 'Accumulate 100 gold pieces to prove your worth', 25, 75),
('Battle Ready', 'Win your first battle against a worthy opponent', 75, 150),
('Miniature Master', 'Collect 5 different miniatures for your army', 100, 200),
('Dungeon Explorer', 'Explore the dark depths of the ancient dungeon', 150, 250),
('Dragon Slayer', 'Defeat the mighty dragon that terrorizes the land', 500, 750),
('Treasure Hunter', 'Find and collect rare treasures hidden throughout the realm', 200, 300),
('Guild Member', 'Join a guild and participate in group activities', 100, 150);

-- Insert sample miniatures
INSERT INTO miniatures (name, description, rarity, attack, defense, health, image_url) VALUES
-- Common miniatures
('Goblin Warrior', 'A small but fierce goblin armed with crude weapons', 'common', 2, 1, 3, null),
('Skeleton Archer', 'An undead archer with deadly aim', 'common', 3, 1, 2, null),
('Orc Berserker', 'A wild orc that fights with reckless abandon', 'common', 4, 1, 4, null),
('Human Guard', 'A well-trained human soldier', 'common', 2, 3, 3, null),

-- Uncommon miniatures
('Elven Ranger', 'A skilled elven archer with nature magic', 'uncommon', 4, 2, 4, null),
('Dwarf Cleric', 'A holy dwarf with healing and protective magic', 'uncommon', 2, 4, 5, null),
('Dark Knight', 'A fallen knight corrupted by dark magic', 'uncommon', 5, 3, 4, null),
('Ice Mage', 'A powerful mage who commands the power of ice', 'uncommon', 6, 1, 3, null),

-- Rare miniatures
('Fire Dragon Wyrmling', 'A young dragon with devastating fire breath', 'rare', 7, 4, 6, null),
('Lich Sorcerer', 'An undead spellcaster with immense magical power', 'rare', 8, 2, 5, null),
('Angel Guardian', 'A divine being with protective powers', 'rare', 6, 6, 7, null),

-- Epic miniatures
('Demon Lord', 'A powerful demon from the depths of hell', 'epic', 10, 6, 10, null),
('Ancient Wizard', 'A legendary wizard with centuries of knowledge', 'epic', 12, 4, 8, null),

-- Legendary miniatures
('Dragon Emperor', 'The most powerful dragon in existence', 'legendary', 15, 10, 20, null),
('Death Knight Champion', 'An unstoppable undead warrior', 'legendary', 14, 8, 15, null);

-- Insert sample achievements
INSERT INTO achievements (name, description, icon, requirement_type, requirement_value) VALUES
('First Collection', 'Add your first miniature to the collection', 'collections-bookmark', 'miniatures_collected', 1),
('Battle Veteran', 'Win 10 battles', 'emoji-events', 'battles_won', 10),
('Legendary Hunter', 'Collect a legendary miniature', 'star', 'legendary_collected', 1),
('Gold Hoarder', 'Accumulate 1000 gold pieces', 'monetization-on', 'gold_accumulated', 1000),
('Quest Master', 'Complete 20 quests', 'assignment-turned-in', 'quests_completed', 20),
('Dragon Slayer', 'Defeat 5 dragon-type miniatures', 'pets', 'dragons_defeated', 5),
('Collector Supreme', 'Collect 50 different miniatures', 'collections', 'miniatures_collected', 50),
('Battle Champion', 'Win 100 battles', 'military-tech', 'battles_won', 100),
('Rare Finder', 'Collect 10 rare or higher miniatures', 'diamond', 'rare_collected', 10),
('Experience Master', 'Reach level 50', 'trending-up', 'level_reached', 50);

-- Insert a sample user for testing
INSERT INTO users (username, email, password_hash, level, experience, gold) VALUES
('testuser', 'test@example.com', '$2b$10$example_hash_here', 5, 1250, 350);

-- Get the user ID for further insertions
-- Note: In a real application, you would handle this programmatically

-- Insert user preferences for the test user
INSERT INTO user_preferences (user_id, sound_enabled, vibration_enabled, notifications) VALUES
(1, true, true, true);

-- Insert some miniatures for the test user
INSERT INTO user_miniatures (user_id, miniature_id) VALUES
(1, 1), -- Goblin Warrior
(1, 2), -- Skeleton Archer
(1, 5), -- Elven Ranger
(1, 9); -- Fire Dragon Wyrmling

-- Insert some completed quests for the test user
INSERT INTO user_completed_quests (user_id, quest_id, completed_at) VALUES
(1, 1, '2024-01-15 10:30:00'),
(1, 2, '2024-01-18 14:20:00'),
(1, 3, '2024-01-20 16:45:00'),
(1, 4, '2024-01-22 09:15:00');

-- Insert some achievements for the test user
INSERT INTO user_achievements (user_id, achievement_id, unlocked_at) VALUES
(1, 1, '2024-01-15 10:30:00'), -- First Collection
(1, 4, '2024-01-18 14:20:00'); -- Gold Hoarder (partial progress)

-- Insert some battle records for the test user
INSERT INTO battles (user_id, opponent_name, user_miniature_id, opponent_miniature_id, result, gold_earned, experience_earned, battle_date) VALUES
(1, 'Shadow Goblin', 1, 2, 'won', 25, 50, '2024-01-16 12:00:00'),
(1, 'Orc Champion', 5, 3, 'won', 35, 75, '2024-01-19 15:30:00'),
(1, 'Dark Wizard', 9, 8, 'lost', 0, 25, '2024-01-21 18:45:00'),
(1, 'Skeleton Lord', 2, 1, 'won', 40, 80, '2024-01-23 11:15:00'); 