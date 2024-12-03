import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  TextInput, 
  ScrollView,
  Alert 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/GroupsDetail';
import { getDatabase, ref, push, set, onValue, update,get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import Colors from "../utils/Colors";

const GroupDetails = ({ route, navigation }) => {
  const { group,userId } = route.params;
  const auth = getAuth();
  const db = getDatabase();

  // State for expenses and members
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [updatedMembers, setUpdatedMembers] = useState([]);
  // Modal states
  const [isAddExpenseModalVisible, setAddExpenseModalVisible] = useState(false);
  const [isAddMemberModalVisible, setAddMemberModalVisible] = useState(false);
  
  // New expense and member states
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    paidBy: auth.currentUser.displayName || 'You'
  });
  const [newMember, setNewMember] = useState({
    email: ''
  });

  // Fetch group data on component mount
  useEffect(() => {
    const groupRef = ref(db, `Groups/${group.id}`);
    setUpdatedMembers(group.members);
    // Listen for expenses changes
    const expensesRef = ref(db, `Groups/${group.id}/expenses`);
    const unsubscribeExpenses = onValue(expensesRef, (snapshot) => {
      const expensesData = snapshot.val();
      const loadedExpenses = expensesData 
        ? Object.keys(expensesData).map(key => ({
            id: key,
            ...expensesData[key]
          })) 
        : [];
      setExpenses(loadedExpenses);
    });

    // Listen for members changes
    const membersRef = ref(db, `Groups/${group.id}/members`);
    // Modify the members fetching in useEffect
    const unsubscribeMembers = onValue(membersRef, async (snapshot) => {
      const membersData = snapshot.val();
      if (membersData) {
        const loadedMembers = [];
        for (const memberKey in membersData) {
          const memberRef = ref(db, `users/${membersData[memberKey].id}`);
          try {
            const memberSnapshot = await get(memberRef);
            if (memberSnapshot.exists()) {
              const memberData = memberSnapshot.val();
              
              // Calculate total paid
              
              const totalPaid = membersData[memberData?.email.replace(/\./g, '_')]?.paid || 0;
              
              // Calculate total owed to others
              let totalOwed = 0;
              for (const otherMemberKey in membersData) {
                if (otherMemberKey !== memberKey) {
                  const owesKey = `${memberKey}_owes_${otherMemberKey}`;
                  totalOwed += Math.abs(parseFloat(membersData[memberKey][owesKey] || 0));
                }
              }

              loadedMembers.push({
                ...memberData,
                id: membersData[memberKey].id,
                totalPaid,
                totalOwed
              });
            }
          } catch (error) {
            console.error("Error fetching member details:", error);
          }
        }
        
        setMembers(loadedMembers);
        setUpdatedMembers(loadedMembers);
      }
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeExpenses();
      unsubscribeMembers();
    };
  }, [group.id]);

  // Calculate total expense
  const calculateTotalExpense = () => {
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount || 0), 0);
  };

  
  
  const addNewExpense = () => {
    if (!newExpense.description || !newExpense.amount) {
      Alert.alert('Invalid Input', 'Please fill in all fields');
      return;
    }
  
    const expensesRef = ref(db, `Groups/${group.id}/expenses`);
    const newExpenseRef = push(expensesRef);
    const amount = parseFloat(newExpense.amount);
  
    const groupMembersRef = ref(db, `Groups/${group.id}/members`);
    const updates = {};
  
    const numberOfMembers = updatedMembers.length;
    const splitAmount = amount / numberOfMembers;
    console.log(JSON.stringify(updatedMembers));
    
    updatedMembers.forEach((member) => {
      // Update the paid amount for the user who paid the expense
      if (member.id === userId) {
        // Use update to increment the paid amount
        updates[`${member.id}/paid`] = (member.totalPaid || 0) + amount;
      }
  
      // Calculate how much each member owes
      updatedMembers.forEach((otherMember) => {
        if (otherMember.id !== member.id) {
          const owesKey = `${member.id}_owes_${otherMember.id}`;
          
          if (member.id === userId) {
            // The person who paid reduces their owed amount to others
            // Use update to modify the existing value
            updates[`${member.id}/${owesKey}`] = 
              ((member.totalOwed || 0) - splitAmount).toFixed(2);
          } else {
            // Other members increase their owed amount to the person who paid
            if(otherMember.id === userId){
              // Use update to modify the existing value
              updates[`${member.id}/${owesKey}`] = 
                ((member.totalOwed || 0) + splitAmount).toFixed(2);
            }
          }
        }
      });
    });
  
    // Add the new expense
    const expenseData = {
      description: newExpense.description,
      amount: amount,
      paidBy: newExpense.paidBy,
      date: new Date().toISOString().split('T')[0],
      addedBy: userId
    };
  
    // Use push to create a new expense entry
    push(expensesRef, expenseData)
      .then(() => {
        // Update members with the calculated balances
        return update(groupMembersRef, updates);
      })
      .then(() => {
        setNewExpense({ description: '', amount: '', paidBy: auth.currentUser.displayName || 'You' });
        setAddExpenseModalVisible(false);
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to add expense or update member balances: ' + error.message);
      });
  };
  

  // Add new member
  const addNewMember = () => {
    if (!newMember.email) {
      Alert.alert('Invalid Input', 'Please fill in all fields');
      return;
    }
    const newUserId = newMember.email.replace(/\./g, '_');
    const membersRef = ref(db, `Groups/${group.id}/members/${newUserId}`);
    
    
    set(membersRef, {
      id: newUserId,
      addedBy: userId
    }).then(() => {
      setAddMemberModalVisible(false);
    }).catch((error) => {
      Alert.alert('Error', 'Failed to add member: ' + error.message);
    });
  };

  // Function to render expense item
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
      <Text style={styles.expenseAmount}>₹{item.amount? item.amount.toLocaleString() : '0'}</Text>
    </View>
  );

  // Function to render member item
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
          <Text style={styles.memberName}>{item.firstName} {item.lastName}</Text>
          <View style={styles.memberBalanceContainer}>
            <Text style={[styles.memberPaid, { color: '#48CFAD' }]}>
              Paid: ₹{(item.totalPaid || 0).toLocaleString()}
            </Text>
            <Text style={[styles.memberOwed, { color: '#ED5565' }]}>
              Owes: ₹{(item.totalOwed || 0).toLocaleString()}
            </Text>
          </View>
          {isInProfit ? (
            <Text style={[styles.memberPaid, { color: '#48CFAD' }]}>
              Will receive: ₹{(((item.totalPaid - item.totalOwed)/members.length)*(members.length - 1)).toLocaleString()}
            </Text>
          ) : (
            <Text style={[styles.memberOwed, { color: '#ED5565' }]}>
              Needs to pay: ₹{(item.totalOwed - item.totalPaid).toLocaleString()}
            </Text>
          )}
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={30} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{group.name}</Text>
        <View style={styles.headerIconContainer}>
          <TouchableOpacity 
            onPress={() => setAddMemberModalVisible(true)}
          >
            <Icon name="person-add" size={30} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setAddExpenseModalVisible(true)}
          >
            <Icon name="add-circle" size={30} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Total Expense Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Expense</Text>
          <Text style={styles.summaryAmount}>
            ₹{calculateTotalExpense() ? calculateTotalExpense().toLocaleString() : '0'}
          </Text>
        </View>
      </View>

      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
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

      {/* Add Member Modal */}
      <Modal
        visible={isAddMemberModalVisible}
        transparent={true}
        animationType="slide"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Member</Text>
            <TextInput
              style={styles.input}
              placeholder="Member Email"
              placeholderTextColor="#8E8E93"
              keyboardType="email-address"
              value={newMember.email}
              onChangeText={(text) => setNewMember({...newMember, email: text})}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setAddMemberModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.addButton]} 
                onPress={addNewMember}
              >
                <Text style={[styles.modalButtonText, { color: 'white' }]}>Add Member</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Expense Modal (modified from previous implementation) */}
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