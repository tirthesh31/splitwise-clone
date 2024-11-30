import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/GroupsScreen';
import Colors from '../utils/Colors';

const GroupsScreen = ({ navigation }) => {
  const [groups, setGroups] = useState([
    { id: '1', name: 'Roommates', totalExpense: 1200, members: 3, category: 'Business' },
    { id: '2', name: 'Trip to Goa', totalExpense: 5000, members: 4, category: 'Entertainment' },
  ]);

  const [isAddGroupModalVisible, setAddGroupModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedTab, setSelectedTab] = useState('Business');

  const tabs = ['Business', 'Grocery', 'Bill', 'Entertainment', 'Miscellaneous']; 

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      'Business': 'business',
      'Grocery': 'shopping-cart',
      'Bill': 'receipt',
      'Entertainment': 'local-movies',
      'Miscellaneous': 'more-horiz'
    };
    return categoryIcons[category] || 'category';
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      'Business': '#5D9CEC',
      'Grocery': '#48CFAD',
      'Bill': '#FC6E51',
      'Entertainment': '#ED5565',
      'Miscellaneous': '#AC92EC'
    };
    return categoryColors[category] || '#CCD1D9';
  };

  const renderGroupItem = ({ item }) => {
    const categoryIcon = getCategoryIcon(item.category);
    const categoryColor = getCategoryColor(item.category);

    return (
      <TouchableOpacity 
        style={[
          styles.groupItem, 
          { 
            backgroundColor: categoryColor + '10', 
            borderLeftColor: categoryColor 
          }
        ]}
        onPress={() => navigation.navigate('GroupDetails', { groupId: item.id })}
      >
        <View style={[styles.groupIcon, { backgroundColor: categoryColor + '20' }]}>
          <Icon name={categoryIcon} size={28} color={categoryColor} />
        </View>
        <View style={styles.groupDetails}>
          <Text style={styles.groupName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.groupSubtitle}>
            {item.members} members | ₹{item.totalExpense.toLocaleString()} total
          </Text>
        </View>
        <Icon name="chevron-right" size={24} color="#8E8E93" />
      </TouchableOpacity>
    );
  };

  const addNewGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        id: String(groups.length + 1),
        name: newGroupName,
        totalExpense: 0,
        members: 1,
        category: selectedTab
      };
      setGroups([...groups, newGroup]);
      setNewGroupName('');
      setAddGroupModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Groups</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="search" size={30} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerIcon}
            onPress={() => setAddGroupModalVisible(true)}
          >
            <Icon name="add-circle" size={30} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="groups" size={80} color="#CCD1D9" />
            <Text style={styles.emptyText}>No groups yet</Text>
            <Text style={styles.emptySubtext}>
              Create a group to start tracking expenses
            </Text>
          </View>
        }
      />

      <Modal
        visible={isAddGroupModalVisible}
        transparent={true}
        animationType="slide"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create New Group</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Group Name"
              placeholderTextColor="#8E8E93"
              value={newGroupName}
              onChangeText={setNewGroupName}
            />
            
            <Text style={styles.categoryLabel}>Select Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabContainer}
            >
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tabItem,
                    selectedTab === tab && styles.selectedTabItem
                  ]}
                  onPress={() => setSelectedTab(tab)}
                >
                  <Icon 
                    name={getCategoryIcon(tab)} 
                    size={20} 
                    color={selectedTab === tab ? '#FFF' : '#8E8E93'}
                    style={styles.tabIcon}
                  />
                  <Text 
                    style={[
                      styles.tabText,
                      selectedTab === tab && styles.selectedTabText
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setAddGroupModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.createButton]} 
                onPress={addNewGroup}
              >
                <Text style={styles.modalButtonText}>Create Group</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GroupsScreen;