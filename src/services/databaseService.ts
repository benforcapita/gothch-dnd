import pool from '../../database/config';
import { Quest, User, Achievement, Miniature } from '../types';

export class DatabaseService {
  // User operations
  static async getUserById(userId: number): Promise<User | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [userId]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw error;
    }
  }

  static async updateUserGold(userId: number, goldAmount: number): Promise<void> {
    try {
      await pool.query(
        'UPDATE users SET gold = gold + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [goldAmount, userId]
      );
    } catch (error) {
      console.error('Error updating user gold:', error);
      throw error;
    }
  }

  static async updateUserExperience(userId: number, expAmount: number): Promise<void> {
    try {
      await pool.query(
        'UPDATE users SET experience = experience + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [expAmount, userId]
      );
    } catch (error) {
      console.error('Error updating user experience:', error);
      throw error;
    }
  }

  // Quest operations
  static async getAllQuests(): Promise<Quest[]> {
    try {
      const result = await pool.query(
        'SELECT id, title, description, gold_reward as "goldReward", experience_reward as "experienceReward", is_active as "isActive" FROM quests WHERE is_active = true ORDER BY created_at'
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching quests:', error);
      throw error;
    }
  }

  static async getCompletedQuests(userId: number): Promise<any[]> {
    try {
      const result = await pool.query(`
        SELECT 
          q.id,
          q.title,
          q.description,
          q.gold_reward as "goldReward",
          ucq.completed_at as "completedAt"
        FROM user_completed_quests ucq
        JOIN quests q ON ucq.quest_id = q.id
        WHERE ucq.user_id = $1
        ORDER BY ucq.completed_at DESC
      `, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching completed quests:', error);
      throw error;
    }
  }

  static async completeQuest(userId: number, questId: number): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Check if quest is already completed
      const existingResult = await client.query(
        'SELECT id FROM user_completed_quests WHERE user_id = $1 AND quest_id = $2',
        [userId, questId]
      );
      
      if (existingResult.rows.length > 0) {
        throw new Error('Quest already completed');
      }

      // Get quest rewards
      const questResult = await client.query(
        'SELECT gold_reward, experience_reward FROM quests WHERE id = $1',
        [questId]
      );
      
      if (questResult.rows.length === 0) {
        throw new Error('Quest not found');
      }

      const { gold_reward, experience_reward } = questResult.rows[0];

      // Add completed quest record
      await client.query(
        'INSERT INTO user_completed_quests (user_id, quest_id) VALUES ($1, $2)',
        [userId, questId]
      );

      // Update user gold and experience
      await client.query(
        'UPDATE users SET gold = gold + $1, experience = experience + $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [gold_reward, experience_reward, userId]
      );

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error completing quest:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Miniature operations
  static async getAllMiniatures(): Promise<Miniature[]> {
    try {
      const result = await pool.query(`
        SELECT 
          id,
          name,
          description,
          rarity,
          attack,
          defense,
          health,
          image_url as "imageUrl"
        FROM miniatures
        ORDER BY 
          CASE rarity 
            WHEN 'common' THEN 1
            WHEN 'uncommon' THEN 2
            WHEN 'rare' THEN 3
            WHEN 'epic' THEN 4
            WHEN 'legendary' THEN 5
          END,
          name
      `);
      return result.rows;
    } catch (error) {
      console.error('Error fetching miniatures:', error);
      throw error;
    }
  }

  static async getUserMiniatures(userId: number): Promise<Miniature[]> {
    try {
      const result = await pool.query(`
        SELECT 
          m.id,
          m.name,
          m.description,
          m.rarity,
          m.attack,
          m.defense,
          m.health,
          m.image_url as "imageUrl",
          um.acquired_at as "acquiredAt"
        FROM user_miniatures um
        JOIN miniatures m ON um.miniature_id = m.id
        WHERE um.user_id = $1
        ORDER BY um.acquired_at DESC
      `, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching user miniatures:', error);
      throw error;
    }
  }

  static async addMiniatureToUser(userId: number, miniatureId: number): Promise<void> {
    try {
      await pool.query(
        'INSERT INTO user_miniatures (user_id, miniature_id) VALUES ($1, $2) ON CONFLICT (user_id, miniature_id) DO NOTHING',
        [userId, miniatureId]
      );
    } catch (error) {
      console.error('Error adding miniature to user:', error);
      throw error;
    }
  }

  // Achievement operations
  static async getUserAchievements(userId: number): Promise<Achievement[]> {
    try {
      const result = await pool.query(`
        SELECT 
          a.id,
          a.name,
          a.description,
          a.icon,
          ua.unlocked_at as "unlockedAt"
        FROM user_achievements ua
        JOIN achievements a ON ua.achievement_id = a.id
        WHERE ua.user_id = $1
        ORDER BY ua.unlocked_at DESC
      `, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      throw error;
    }
  }

  // User preferences
  static async getUserPreferences(userId: number): Promise<any> {
    try {
      const result = await pool.query(
        'SELECT sound_enabled as "soundEnabled", vibration_enabled as "vibrationEnabled", notifications FROM user_preferences WHERE user_id = $1',
        [userId]
      );
      return result.rows[0] || {
        soundEnabled: true,
        vibrationEnabled: true,
        notifications: true
      };
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  }

  static async updateUserPreferences(userId: number, preferences: any): Promise<void> {
    try {
      await pool.query(`
        INSERT INTO user_preferences (user_id, sound_enabled, vibration_enabled, notifications)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          sound_enabled = $2,
          vibration_enabled = $3,
          notifications = $4,
          updated_at = CURRENT_TIMESTAMP
      `, [userId, preferences.soundEnabled, preferences.vibrationEnabled, preferences.notifications]);
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  // Battle operations
  static async getBattleRecord(userId: number): Promise<{ won: number; lost: number; total: number }> {
    try {
      const result = await pool.query(`
        SELECT 
          COUNT(CASE WHEN result = 'won' THEN 1 END) as won,
          COUNT(CASE WHEN result = 'lost' THEN 1 END) as lost,
          COUNT(*) as total
        FROM battles 
        WHERE user_id = $1
      `, [userId]);
      
      return {
        won: parseInt(result.rows[0].won) || 0,
        lost: parseInt(result.rows[0].lost) || 0,
        total: parseInt(result.rows[0].total) || 0
      };
    } catch (error) {
      console.error('Error fetching battle record:', error);
      throw error;
    }
  }

  // Collection statistics
  static async getCollectionStats(userId: number): Promise<{ count: number; byRarity: Record<string, number> }> {
    try {
      const [countResult, rarityResult] = await Promise.all([
        pool.query('SELECT COUNT(*) as count FROM user_miniatures WHERE user_id = $1', [userId]),
        pool.query(`
          SELECT 
            m.rarity,
            COUNT(*) as count
          FROM user_miniatures um
          JOIN miniatures m ON um.miniature_id = m.id
          WHERE um.user_id = $1
          GROUP BY m.rarity
        `, [userId])
      ]);

      const byRarity: Record<string, number> = {};
      rarityResult.rows.forEach(row => {
        byRarity[row.rarity] = parseInt(row.count);
      });

      return {
        count: parseInt(countResult.rows[0].count) || 0,
        byRarity
      };
    } catch (error) {
      console.error('Error fetching collection stats:', error);
      throw error;
    }
  }
} 