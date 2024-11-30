import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format, parseISO } from 'date-fns';
import styles from '../styles/ActivityScreen';
import Colors from '../utils/Colors';

const ActivityScreen = () => {
  const [activities, setActivities] = useState([
    {
      id: '1',
      type: 'expense',
      group: 'Roommates',
      amount: 500,
      description: 'Grocery shopping',
      date: '2024-02-15',
    },
    {
      id: '2',
      type: 'settlement',
      group: 'Trip to Goa',
      amount: 1200,
      description: 'Settled with Rohan',
      date: '2024-02-10',
    },
    {
      id: '3',
      type: 'invitation',
      group: 'Family Trip',
      description: 'Added to new group',
      date: '2024-02-05',
    }
  ]);

  const renderActivityItem = ({ item, index }) => {
    const getActivityDetails = () => {
      switch(item.type) {
        case 'expense':
          return { 
            icon: 'attach-money', 
            color: '#FF6B6B', 
            title: `Expense in ${item.group}`,
            amountPrefix: '-'
          };
        case 'settlement':
          return { 
            icon: 'check-circle', 
            color: '#4ECB71', 
            title: `Settled with ${item.description.split(' ')[2]}`,
            amountPrefix: '+'
          };
        case 'invitation':
          return { 
            icon: 'group-add', 
            color: '#5D9CEC', 
            title: `Invited to ${item.group}`,
            amountPrefix: ''
          };
        default:
          return { 
            icon: 'notifications', 
            color: '#CCD1D9', 
            title: 'Notification',
            amountPrefix: ''
          };
      }
    };

    const { icon, color, title, amountPrefix } = getActivityDetails();

    return (
      <Animated.View 
        style={[
          styles.activityItem, 
          { 
            backgroundColor: color + '10', 
            borderLeftColor: color, 
            transform: [{ 
              scale: new Animated.Value(0.9) 
            }]
          }
        ]}
      >
        <View style={[styles.activityIcon, { backgroundColor: color + '20' }]}>
          <Icon name={icon} size={28} color={color} />
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityTitle} numberOfLines={1}>
            {title}
          </Text>
          {item.amount !== undefined && (
            <Text style={[styles.activityAmount, { color }]}>
              {amountPrefix} ₹{item.amount.toLocaleString()}
            </Text>
          )}
          <Text style={styles.activityDate}>
            {format(parseISO(item.date), 'MMM dd, yyyy')}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Activities</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter-list" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={activities}
        renderItem={renderActivityItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="inbox" size={80} color="#CCD1D9" />
            <Text style={styles.emptyText}>No recent activities</Text>
            <Text style={styles.emptySubtext}>Your recent transactions will appear here</Text>
          </View>
        }
      />
    </View>
  );
};

export default ActivityScreen;