import React, { useState,useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/GroupsScreen';
import Colors from '../utils/Colors';
import { database } from '../utils/firebase'; // Adjust path as needed
import { ref, push, set,onValue } from 'firebase/database';
import { auth } from '../utils/firebase'; // To get the current user's info if needed

const GroupsScreen = ({ navigation,route }) => {
  const { userId } = route.params;
  const [groups, setGroups] = useState();

  const [isAddGroupModalVisible, setAddGroupModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedTab, setSelectedTab] = useState('Business');

  const tabs = ['Business', 'Grocery', 'Bill', 'Entertainment', 'Miscellaneous']; 

  useEffect(() => {
    const groupsRef = ref(database, 'Groups');
    
    // Listen for changes in the Groups data
    const unsubscribe = onValue(groupsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const groupList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        })).filter((group) => {
          
          const members = Array.isArray(group.members) ? group.members : Object.values(group.members);
          return members.some((member) => member.id === userId);
        });        
        
        setGroups(groupList);
      } else {
        setGroups([]);
      }
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, []);

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
        onPress={() => navigation.navigate('GroupDetails', { group: item, userId:userId })}
      >
        <View style={[styles.groupIcon, { backgroundColor: categoryColor + '20' }]}>
          <Icon name={categoryIcon} size={28} color={categoryColor} />
        </View>
        <View style={styles.groupDetails}>
          <Text style={styles.groupName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.groupSubtitle}>
            {item.createdBy}
          </Text>
        </View>
        <Icon name="chevron-right" size={24} color="#8E8E93" />
      </TouchableOpacity>
    );
  };

  const addNewGroup = () => {
    if (newGroupName.trim()) {
      const newGroupRef = push(ref(database, 'Groups')); // Create a unique key in Groups
      const newGroupData = {
        name: newGroupName,
        members: [
          {
            id: userId || 'anonymous', // Add current user's ID if available
          },
        ],
        createdBy: userId || 'anonymous',
        createdAt: new Date().toISOString(),
        category: selectedTab,
      };
  
      // Write to the database
      set(newGroupRef, newGroupData)
        .then(() => {
          setNewGroupName('');
          setAddGroupModalVisible(false);
        })
        .catch((error) => {
          console.error('Error adding group:', error);
          alert('Failed to create group. Please try again.');
        });
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