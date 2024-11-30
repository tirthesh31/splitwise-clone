import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  TextInput, 
  ScrollView 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/GroupsDetail';

const GroupDetails = ({ route, navigation }) => {
  const { groupId, groupName } = route.params;

  const [expenses, setExpenses] = useState([
    {
      id: '1',
      description: 'Groceries',
      amount: 1200,
      paidBy: 'You',
      date: '2024-02-15'
    },
    {
      id: '2',
      description: 'Dinner',
      amount: 800,
      paidBy: 'Rohan',
      date: '2024-02-10'
    }
  ]);

  const [members, setMembers] = useState([
    { id: '1', name: 'You', totalPaid: 1200, totalOwed: 600 },
    { id: '2', name: 'Rohan', totalPaid: 800, totalOwed: 1200 },
    { id: '3', name: 'Sarah', totalPaid: 500, totalOwed: 400 }
  ]);

  const [isAddExpenseModalVisible, setAddExpenseModalVisible] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    paidBy: 'You'
  });

  const calculateTotalExpense = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseIconContainer}>
        <Icon 
          name="receipt" 
          size={24} 
          color="#5D9CEC" 
          style={styles.expenseIcon}
        />
      </View>
      <View style={styles.expenseDetails}>
        <Text style={styles.expenseDescription} numberOfLines={1}>
          {item.description}
        </Text>
        <Text style={styles.expenseSubtitle}>
          Paid by {item.paidBy} on {item.date}
        </Text>
      </View>
      <Text style={styles.expenseAmount}>₹{item.amount.toLocaleString()}</Text>
    </View>
  );

  const renderMemberItem = ({ item }) => {
    const isInProfit = item.totalPaid > item.totalOwed;
    const balanceColor = isInProfit ? '#48CFAD' : '#ED5565';

    return (
      <View style={styles.memberItem}>
        <View style={styles.memberIconContainer}>
          <Icon 
            name="person" 
            size={24} 
            color={balanceColor} 
            style={styles.memberIcon}
          />
        </View>
        <View style={styles.memberDetails}>
          <Text style={styles.memberName}>{item.name}</Text>
          <View style={styles.memberBalanceContainer}>
            <Text style={[styles.memberPaid, { color: '#48CFAD' }]}>
              Paid: ₹{item.totalPaid.toLocaleString()}
            </Text>
            <Text style={[styles.memberOwed, { color: '#ED5565' }]}>
              Owes: ₹{item.totalOwed.toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={[styles.memberBalanceStatus, { backgroundColor: balanceColor + '20' }]}>
          <Icon 
            name={isInProfit ? "arrow-upward" : "arrow-downward"} 
            color={balanceColor} 
            size={20} 
          />
        </View>
      </View>
    );
  };

  const addNewExpense = () => {
    if (newExpense.description && newExpense.amount) {
      const expense = {
        id: String(expenses.length + 1),
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        paidBy: newExpense.paidBy,
        date: new Date().toISOString().split('T')[0]
      };
      setExpenses([...expenses, expense]);
      setNewExpense({ description: '', amount: '', paidBy: 'You' });
      setAddExpenseModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{groupName}</Text>
        <TouchableOpacity 
          onPress={() => setAddExpenseModalVisible(true)}
          style={styles.addButton}
        >
          <Icon name="add-circle" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Total Expense Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Expense</Text>
          <Text style={styles.summaryAmount}>
            ₹{calculateTotalExpense().toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Expenses List */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Expenses</Text>
          <FlatList
            data={expenses}
            renderItem={renderExpenseItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Members List */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Members</Text>
          <FlatList
            data={members}
            renderItem={renderMemberItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Add Expense Modal */}
      <Modal
        visible={isAddExpenseModalVisible}
        transparent={true}
        animationType="slide"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Expense</Text>
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#8E8E93"
              value={newExpense.description}
              onChangeText={(text) => setNewExpense({...newExpense, description: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              placeholderTextColor="#8E8E93"
              keyboardType="numeric"
              value={newExpense.amount}
              onChangeText={(text) => setNewExpense({...newExpense, amount: text})}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setAddExpenseModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.addButton]} 
                onPress={addNewExpense}
              >
                <Text style={[styles.modalButtonText, { color: 'white' }]}>Add Expense</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GroupDetails;
