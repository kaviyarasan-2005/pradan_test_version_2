import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

const DashboardScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('Today');
  const slideAnim = useState(new Animated.Value(0))[0];

  const dashboardData = [
    {
      id: '1',
      label: 'Total Submitted',
      icon: 'assignment',
      color: '#4a7744',
      count: 120,
    },
    {
      id: '2',
      label: 'Pending Forms',
      icon: 'hourglass-empty',
      color: '#f4a261',
      count: 45,
    },
    {
      id: '3',
      label: 'Remarks',
      icon: 'comment',
      color: 'black',
      count: 15,
    },
    {
      id: '4',
      label: 'Approved Forms',
      icon: 'check-circle',
      color: '#2a9d8f',
      count: 60,
    },
  ];

  const renderCard = ({ item }: any) => {
    const handleCardPress = () => {
      switch (item.id) {
        case '1':
          router.push('/Verifier/verifiertotalsubmit');
          break;
        case '2':
          router.push('/Verifier/verifierpending');
          break;
        case '3':
          router.push('/Verifier/verifierremarks');
          break;
        case '4':
          router.push('/Verifier/verifierapproved');
          break;
        default:
          break;
      }
    };

    return (
      <TouchableOpacity style={[styles.card, { width: width * 0.42 }]} onPress={handleCardPress}>
        <MaterialIcons name={item.icon} size={40} color={item.color} />
        <Text style={styles.count}>{item.count}</Text>
        <Text style={styles.cardLabel}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/pradan_trans.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Pressable onPress={() => router.replace('/Verifier/verifierprofile')} style={({ pressed }) => [styles.profileCard]}>
        <Image
          source={require('../../assets/images/PROFILE.jpg')}
          style={styles.profileImage}
        />
        <View style={styles.profileText}>
          <Text style={styles.profileName}>KAVIYARASAN </Text>
          <Text style={styles.profileDesignation}>Verifier</Text>
          <Text style={styles.profileEmail}>Kaviyarasan@pradan.net</Text>
        </View>
      </Pressable>

      <View style={styles.dashboardHeader}>
        <Text style={styles.dashboardTitle}>Dashboard</Text>
      </View>

      <FlatList
        data={dashboardData}
        numColumns={2}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 10 }}
        style={styles.flatList}
      />
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.02,
  },
  logo: {
    margin: width * 0.02,
    width: width * 0.6,
    height: height * 0.1,
    marginBottom: height * 0.02,
    alignSelf: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: height * 0.02,
    padding: width * 0.04,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 100,
    marginRight: 12,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: width * 0.05,  // Increased font size
    fontWeight: 'bold',
    color: '#134e13',
  },
  profileDesignation: {
    fontSize: width * 0.045,  // Increased font size
    color: '#555',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: width * 0.045,  // Increased font size
    color: '#777',
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.02,
    marginTop: height * 0.02,
    marginLeft: width * 0.02,
  },
  dashboardTitle: {
    fontSize: width * 0.06,  // Increased font size
    fontWeight: 'bold',
    color: '#134e13',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: height * 0.015,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: width * 0.02,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  count: {
    fontSize: width * 0.06,  // Increased font size
    fontWeight: 'bold',
    marginTop: height * 0.01,
    color: '#333',
  },
  cardLabel: {
    marginTop: height * 0.01,
    fontSize: width * 0.04,  // Increased font size
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  flatList: {
    flex: 1,
  }
});