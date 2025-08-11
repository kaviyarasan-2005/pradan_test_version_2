import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import axios from "axios";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Alert, BackHandler, Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Card,
  Divider,
  IconButton,
  Text,
  TextInput,
} from 'react-native-paper';
import { useUserStore } from "../storage/userDatastore";

const url = Constants.expoConfig.extra.API_URL;
const { width, height } = Dimensions.get('window');

export default function Profile() {


  const scrollRef = useRef(null);
  const router = useRouter();
  const { user, logout } = useUserStore();
  //const navigation = useNavigation();
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  
useFocusEffect(
  React.useCallback(() => {
    const onBackPress = () => {
      router.push('/dashboard');
      return true; 
    };

 const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

return () => backHandler.remove(); 

  }, [])
);
  const handleChangePassword = async () => {
    const storedPassword = await AsyncStorage.getItem("password");
  
    if (oldPassword !== storedPassword) {
      Alert.alert("Error", "Old password is incorrect.");
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
  
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords and Confirm Password do not match.");
          scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
      //console.log("Username",await AsyncStorage.getItem("username"));
      const username = user?.username;
      //console.log("axios started");
      const response = await axios.put(`${url}/api/users/changePassword`, {
      username,
     oldPassword,
      newPassword,
    });
    //console.log("Password change:",response.data); // Log the response data

    if(response.data === 1){
     //await AsyncStorage.setItem("password", newPassword);
     Alert.alert("Success", "Password changed successfully.");
    }

    setShowPasswordFields(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  
  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    logout(); // Clear user data from Zustand stor
    router.replace("/");
  };

  return (
    <ScrollView 
           ref={scrollRef}
        contentContainerStyle={styles.scrollContainer}
        scrollEnabled={showPasswordFields}
    
    style={styles.container}>
      {/* Header */}
      <View style={styles.headerBox}>
      <TouchableOpacity onPress={() => {
    router.push('/dashboard'); // or whatever fallback screen you prefer
}}>
          <IconButton icon="arrow-left"size={width * .06} iconColor="#fff" style={styles.backIcon}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Card */}
        <Card style={styles.card}>
     <Card.Content style={styles.profileSection}>
        <Image
          source={require("../assets/images/PROFILE.jpg")}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>{user?.role}</Text>
        </View>
      </Card.Content>

      <Divider style={{ marginVertical: 12 }} />

        <View style={styles.infoSection}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.username}</Text>
          <Divider style={styles.itemDivider} />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Mobile</Text>
          <Text style={styles.value}>{user?.mobile}</Text>
          <Divider style={styles.itemDivider} />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Date of Joining</Text>
          <Text style={styles.value}>{user?.date_of_joining}</Text>
          <Divider style={styles.itemDivider} />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{user?.location}</Text>
          <Divider style={styles.itemDivider} />
        </View>


        {/* Change Password */}
        <TouchableOpacity onPress={() => setShowPasswordFields(!showPasswordFields)}>
          <Text style={styles.changePassword}>Change Password</Text>
        </TouchableOpacity>

        {showPasswordFields && (
          <>
            <View style={styles.passwordBox}>
            <TextInput
            placeholder="Old Password"
            secureTextEntry={!showOldPass}
            value={oldPassword}
            onChangeText={setOldPassword}
                                          right={
                  <TextInput.Icon
                    icon={showOldPass ? 'eye-off' : 'eye'}
                    onPress={() => setShowOldPass(!showOldPass)}
                    size={width * .06}
                  />
                } style={styles.input}
/>


            <TextInput
                placeholder="New Password"
                secureTextEntry={!showNewPass}
                value={newPassword}
                onChangeText={setNewPassword}
                                                          right={
                  <TextInput.Icon
                    icon={showOldPass ? 'eye-off' : 'eye'}
                    onPress={() => setShowOldPass(!showOldPass)}
                    size={width * .06}
                  />
                }              style={styles.input}
/>

            <TextInput
                  placeholder="Confirm New Password"
                  secureTextEntry={!showConfirmPass}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  right={
                  <TextInput.Icon
                    icon={showOldPass ? 'eye-off' : 'eye'}
                    onPress={() => setShowOldPass(!showOldPass)}
                    size={width * .06}
                                      />
                } style={styles.input}
                />

            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleChangePassword}>
            <Text style={styles.submitBtnText}>Submit</Text>
            </TouchableOpacity>

          </>
        )}
        </Card>
      

      {/* Logout */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContainer: {
    paddingBottom: height * 0.05,
  },
  headerBox: {
    backgroundColor: '#1B5E20',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: height * 0.01,
    paddingBottom: height * 0.02,
    paddingHorizontal: width * 0.04,
    elevation: 4,
  },
  backIcon: {
    marginRight: width * 0.02,
    paddingTop: height * 0.011,
  },
  headerTitle: {
    color: '#fff',
    paddingTop: height * 0.01,
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  card: {
    margin: width * 0.04,
    borderRadius: width * 0.05,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    backgroundColor: '#fff',
    elevation: 3,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: width * 0.2,
    width: width * 0.2,
    borderRadius: width * 0.1,
    marginRight: width * 0.04,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  role: {
    fontSize: width * 0.035,
    color: '#4CAF50',
    fontWeight: '500',
    marginTop: height * 0.002,
  },
  infoSection: {
    marginTop: height * 0.015,
  },
  itemBlock: {
    marginBottom: height * 0.018,
  },
  label: {
    fontSize: width * 0.04,
    color: '#1B5E20',
    marginBottom: height * 0.003,
  },
  value: {
    fontSize: width * 0.042,
    color: '#333',
    fontWeight: '500',
  },
  itemDivider: {
    marginTop: height * 0.012,
  },
  changePassword: {
    marginTop: height * 0.032,
    color: '#1B5E20',
    fontWeight: 'bold',
    textAlign: 'right',
    fontSize: width * 0.037,
  },
  passwordBox: {
    marginTop: height * 0.035,
  },
  input: {
    marginBottom: height * 0.015,
    backgroundColor: '#fff',
    padding: width * 0.03,
    borderRadius: width * 0.02,
    fontSize: width * 0.04,
  },
  submitBtn: {
    backgroundColor: '#1B5E20',
    borderRadius: width * 0.02,
    marginTop: height * 0.01,
    paddingVertical: height * 0.016,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: width * 0.03,  // Adjust for readabilityhh
    fontWeight: 'bold',
  },
  logoutButton: {
    marginHorizontal: width * 0.04,
    marginTop: height * 0.03,
    backgroundColor: '#1B5E20',
    borderRadius: width * 0.025,
    paddingVertical: height * 0.02,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: width * 0.03,  // Adjust for readabili
    fontWeight: 'bold',
  },
});