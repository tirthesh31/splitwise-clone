import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Switch,ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/ProfileScreen';

const ProfileScreen = ({ route, navigation }) => {
  const [email] = useState(route.params?.email || 'tirthesh@gmail.com');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const profileOptions = [
    { 
      icon: 'edit', 
      title: 'Edit Profile', 
      color: '#5D9CEC',
      onPress: () => navigation.navigate('EditProfile') 
    },
    { 
      icon: 'account-balance-wallet', 
      title: 'Payment Methods', 
      color: '#48CFAD',
      onPress: () => navigation.navigate('PaymentMethods') 
    },
    { 
      icon: 'settings', 
      title: 'App Settings', 
      color: '#FC6E51',
      onPress: () => navigation.navigate('AppSettings') 
    },
    { 
      icon: 'logout', 
      title: 'Logout', 
      color: '#ED5565',
      onPress: () => navigation.replace('Login') 
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <ScrollView
        vertical
      >
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: 'https://ui-avatars.com/api/?name=Tirthesh' }} 
            style={styles.profileImage} 
          />
          <TouchableOpacity style={styles.editProfileButton}>
            <Icon name="camera-alt" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>Tirthesh</Text>
        <Text style={styles.userEmail}>{email}</Text>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingsList}>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#5D9CEC20' }]}>
                <Icon name="dark-mode" size={24} color="#5D9CEC" />
              </View>
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch 
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#E0E0E0", true: "#5D9CEC" }}
              thumbColor={darkMode ? "#FFF" : "#F5F5F5"}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#48CFAD20' }]}>
                <Icon name="notifications" size={24} color="#48CFAD" />
              </View>
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch 
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#E0E0E0", true: "#48CFAD" }}
              thumbColor={notifications ? "#FFF" : "#F5F5F5"}
            />
          </View>
        </View>
      </View>

      <View style={styles.optionsSection}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.optionsList}>
          {profileOptions.map((option, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.optionItem}
              onPress={option.onPress}
            >
              <View style={styles.optionContent}>
                <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
                  <Icon name={option.icon} size={24} color={option.color} />
                </View>
                <Text style={styles.optionText}>{option.title}</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#8E8E93" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;