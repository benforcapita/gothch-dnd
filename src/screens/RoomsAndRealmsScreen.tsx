import { useGetQuestsQuery } from '@/store/api';
import { addGold, selectUserGold } from '@/store/slices/userSlice';
import { Quest } from '@/types';
import { colors } from '@/utils/theme';
import React from 'react';
import { View, Text, StyleSheet, Button, FlatList, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

const RoomsAndRealmsScreen: React.FC = () => {
  const userGold = useSelector(selectUserGold);
  const dispatch = useDispatch();
  const { data: questsData, isLoading, error } = useGetQuestsQuery();

  const handleCompleteQuest = (goldReward: number) => {
    dispatch(addGold(goldReward));
  };

  const renderQuestItem = ({ item }: { item: Quest }) => (
    <View style={styles.questItemContainer}>
      <Text style={styles.questTitle}>{item.title}</Text>
      <Text style={styles.questDescription}>{item.description}</Text>
      <Text style={styles.questReward}>Reward: {item.goldReward} Gold</Text>
      <Button title="Complete Quest" onPress={() => handleCompleteQuest(item.goldReward)} color={colors.primary} />
    </View>
  );

  let content;
  if (isLoading) {
    content = <ActivityIndicator size="large" color={colors.primary} />;
  } else if (error) {
    content = <Text style={styles.errorText}>Error loading quests. Please try again later.</Text>;
  } else if (questsData && questsData.data && questsData.data.length > 0) {
    content = (
      <FlatList
        data={questsData.data}
        renderItem={renderQuestItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    );
  } else {
    content = <Text style={styles.questText}>No quests available at the moment.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rooms and Realms Screen</Text>
      <Text style={styles.goldText}>Current Gold: {userGold}</Text>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20, // Added padding for better layout
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10, // Adjusted margin
  },
  goldText: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 20, // Adjusted margin
  },
  questText: { // Re-purposed for 'no quests' message
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error, // Assuming colors.error is defined
    marginTop: 20,
  },
  list: {
    width: '100%',
    paddingHorizontal: 15,
  },
  questItemContainer: {
    backgroundColor: colors.surface, // Assuming colors.surface is defined
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border, // Assuming colors.border is defined
  },
  questTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  questDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  questReward: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 10,
  },
});

export default RoomsAndRealmsScreen;
