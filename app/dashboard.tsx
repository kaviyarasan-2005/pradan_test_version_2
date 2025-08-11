import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import axios from "axios";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from 'react-native-pager-view';
import {
  moderateScale,
  scale,
  verticalScale
} from 'react-native-size-matters';
import { DashbdStore } from "../storage/DashbdStore";
import { FormStatus_todayCount, FormStatus_totalCount, useFormStore } from "../storage/useFormStore";
import { useUserStore } from "../storage/userDatastore";
const url = Constants.expoConfig.extra.API_URL;

const DashboardScreen: React.FC = () => {
  const { width, height } = Dimensions.get('window'); 
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('Today');
  const slideAnim = useState(new Animated.Value(0))[0];
  const [pageIndex, setPageIndex] = useState(0);
  const {user} = useUserStore();
  const {setData,resetData ,data} = useFormStore();
 const { setForms, dashbdforms } = DashbdStore();
 const {setUser} = useUserStore();

  const { setStatus_totalCount, resetStatus_totalCount, status_total } = FormStatus_totalCount(); //global Zustand store for total count of forms
  const {setStatus_todayCount, resetStatus_todayCount, status_today } = FormStatus_todayCount(); //global Zustand store for today's count of forms
  
  const pageTexts = [
    'Dashboard(Pre)',
    'Dashboard(Post)'
  ];

  const fetchDashboardData = async (userId: number) => {
    try {
      const dashborad_status_count_response_total = await axios.get(`${url}/api/dashboard/getTotalFormsStatusCount`,{params: {
        user_id: user?.id,
      }});
      const dashborad_status_count_response_today = await axios.get(`${url}/api/dashboard/getTodayFormsStatusCount`,{params: {
        user_id: user?.id,
      }});

      //  axios.get(${url}/api/dashboard/getpreviewformsData, { params: { user_id: user?.id } })
      // .then(response => {
      //   const response_total = response.data;
      //   // console.log(response_total);
      //   setForms(response_total);
      // })
      // .catch(error => {
      //   console.error('Error fetching forms:', error);
      // });

      setUser("user_id",user?.id);
     // console.log("Dashboard Status Count:", dashborad_status_count_response_today.data);

     //convert the array of objects to a map for easy access
      const statusCountMap_total = Object.fromEntries(
        dashborad_status_count_response_total.data.map(item => [item.status, item.count])
      );

      const statusCountMap_today = Object.fromEntries(
        dashborad_status_count_response_today.data.map(item => [item.status, item.count])
      );
      
      //Refer the documentation[1] for the status codes and the corresponding status names
      setStatus_totalCount({
        totalCount_pre: statusCountMap_total[1]+statusCountMap_total[2]+statusCountMap_total[3]+statusCountMap_total[4],
        pendingCount_pre: statusCountMap_total[1]+statusCountMap_total[2],
        rejectedCount_pre: statusCountMap_total[3],
        approvedCount_pre: statusCountMap_total[4],
        totalCount_post: statusCountMap_total[6]+statusCountMap_total[7]+statusCountMap_total[8]+statusCountMap_total[9],
        pendingCount_post: statusCountMap_total[7]+statusCountMap_total[6],
        changerequestedCount_post: statusCountMap_total[8],
        approvedCount_post: statusCountMap_total[9],
        hasfetched_total: true,
      });

      setStatus_todayCount({
        totalCount_pre: statusCountMap_today[1]+statusCountMap_today[2]+statusCountMap_today[3]+statusCountMap_today[4],
        pendingCount_pre: statusCountMap_today[1]+statusCountMap_today[2],
        rejectedCount_pre: statusCountMap_today[3],
        approvedCount_pre: statusCountMap_today[4],
        totalCount_post: statusCountMap_today[6]+statusCountMap_today[7]+statusCountMap_today[8]+statusCountMap_today[9],
        pendingCount_post: statusCountMap_today[7]+statusCountMap_today[6],
        changerequestedCount_post: statusCountMap_today[8],
        approvedCount_post: statusCountMap_today[9],
        hasfetched_total: true,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }

  useEffect(() => {
   console.log("backed");
    // console.log(JSON.stringify(data) + "dash data bf");
    resetData();
    // console.log(JSON.stringify(data) + "dash data  af");
    if (user?.id) {
      fetchDashboardData(user?.id);
    }
    return () => {
      resetStatus_todayCount();
      resetStatus_totalCount();
    };
  }, [user?.id]);


useFocusEffect(
  React.useCallback(() => {
    const onBackPress = () => {
      if (modalVisible) {
        setModalVisible(false);  
        return true; 
      }

      BackHandler.exitApp(); 
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backHandler.remove();
  }, [modalVisible]) 
);

  if ((status_total?.totalCount_pre === 0 && !status_total?.hasfetched_total)) {
    return <ActivityIndicator />;
  }

  const dashboardDatapre_total = [
    {
      id: '1',
      label: 'Total Submitted',
      icon: 'assignment',
      color: '#4a7744',
      count: status_total.totalCount_pre,
    },
    {
      id: '2',
      label: 'Pending Forms',
      icon: 'hourglass-empty',
      color: '#f4a261',
      count: status_total.pendingCount_pre,
    },
    {
      id: '3',
      label: 'Rejected Forms',
      icon: 'cancel',
      color: '#e63946',
      count: status_total.rejectedCount_pre,
    },
    {
      id: '4',
      label: 'Approved Forms',
      icon: 'check-circle',
      color: '#2a9d8f',
      count: status_total.approvedCount_pre,
    },
  ];

  const dashboardDatapost_total = [
    {
      id: '1',
      label: 'Total Submitted',
      icon: 'assignment',
      color: '#4a7744',
      count: status_total.totalCount_post,
    },
    {
      id: '2',
      label: 'Pending Forms',
      icon: 'hourglass-empty',
      color: '#f4a261',
      count: status_total.pendingCount_post,
    },
    {
      id: '3',
      label: 'Rejected Forms',
      icon: 'cancel',
      color: '#e63946',
      count: status_total.changerequestedCount_post,
    },
    {
      id: '4',
      label: 'Approved Forms',
      icon: 'check-circle',
      color: '#2a9d8f',
      count: status_total.approvedCount_post,
    },
  ];

  const dashboardDatapre_today = [
    {
      id: '1',
      label: 'Total Submitted',
      icon: 'assignment',
      color: '#4a7744',
      count: status_today.totalCount_pre,
    },
    {
      id: '2',
      label: 'Pending Forms',
      icon: 'hourglass-empty',
      color: '#f4a261',
      count: status_today.pendingCount_pre,
    },
    {
      id: '3',
      label: 'Rejected Forms',
      icon: 'cancel',
      color: '#e63946',
      count: status_today.rejectedCount_pre,
    },
    {
      id: '4',
      label: 'Approved Forms',
      icon: 'check-circle',
      color: '#2a9d8f',
      count: status_today.approvedCount_pre,
    },
  ];

  const dashboardDatapost_today = [
    {
      id: '1',
      label: 'Total Submitted',
      icon: 'assignment',
      color: '#4a7744',
      count: status_today.totalCount_post,
    },
    {
      id: '2',
      label: 'Pending Forms',
      icon: 'hourglass-empty',
      color: '#f4a261',
      count: status_today.pendingCount_post,
    },
    {
      id: '3',
      label: 'Rejected Forms',
      icon: 'cancel',
      color: '#e63946',
      count: status_today.changerequestedCount_post,
    },
    {
      id: '4',
      label: 'Approved Forms',
      icon: 'check-circle',
      color: '#2a9d8f',
      count: status_today.approvedCount_post,
    },
  ];

  // const dashboardData = [
  //   {
  //     id: '1',
  //     label: 'Total Submitted',
  //     icon: 'assignment',
  //     color: '#4a7744',
  //     count: 120,
  //   },
  //   {
  //     id: '2',
  //     label: 'Pending Forms',
  //     icon: 'hourglass-empty',
  //     color: '#f4a261',
  //     count: 45,
  //   },
  //   {
  //     id: '3',
  //     label: 'Rejected Forms',
  //     icon: 'cancel',
  //     color: '#e63946',
  //     count: 15,
  //   },
  //   {
  //     id: '4',
  //     label: 'Approved Forms',
  //     icon: 'check-circle',
  //     color: '#2a9d8f',
  //     count: 60,
  //   },
  // ];

  const currentData = useMemo(() => {
    //console.log("Page Index:", pageIndex);
    // console.log("Active Tab:", activeTab);
    if (pageIndex === 0) {
      return activeTab === 'Today'
        ? dashboardDatapre_today
        : dashboardDatapre_total;
    } else {
      return activeTab === 'Today'
        ? dashboardDatapost_today
        : dashboardDatapost_total;
    }
  }, [pageIndex, activeTab]);


   const toggleTab = (tab: string) => {
      setActiveTab(tab);
      Animated.timing(slideAnim, {
        toValue: tab === 'Today' ? 0 : 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    };
    const interpolatedTranslate = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, width * 0.2],
    });
     const renderCard = ({ item }: any) => {
        const handleCardPress = () => {
          switch (item.id) {
            
            case '1':
              // console.log(JSON.stringify(dashbdforms));
              router.push('/prefd/totalSubmit');       
            break;
            case '2':
              router.push('/prefd/pending');
              break;
            case '3':
              router.push('/prefd/rejected');
              break;
            case '4':
              router.push('/prefd/approved');
              break;
            default:
              break;
          }
        };
        return(
            <TouchableOpacity style={styles.card} onPress={handleCardPress}>
              <MaterialIcons name={item.icon} size={width * 0.08} color={item.color} />
              <Text style={styles.count}>{item.count}</Text>
              <Text style={styles.cardLabel}>{item.label}</Text>
            </TouchableOpacity>
            );
          };
  const router = useRouter();
  const [showFormModal, setShowFormModal] = useState(false);

const renderCard2 = ({ item }: any) => {
    const handleCardPress = () => {
      switch (item.id) {
        case '1':
          router.push('/postfd/totalsubmit');
          break;
        case '2': 
          router.push('/postfd/pending');
          break;
        case '3':
          router.push('/postfd/remarks');
          break;
        case '4':
          router.push('/postfd/approved');
          break;
        default:
          break;
      }
    };
    return(
    <TouchableOpacity style={styles.card} onPress={handleCardPress}>
      <MaterialIcons name={item.icon} size={width * 0.08} color={item.color} />
      <Text style={styles.count}>{item.count}</Text>
      <Text style={styles.cardLabel}>{item.label}</Text>
    </TouchableOpacity>
    );
  };
  return (
      <SafeAreaView style={styles.container}>
       
                 <StatusBar
              backgroundColor="rgba(55, 51, 51, 1)"
              barStyle="light-content" 
            />
        <Image
          source={require("../assets/images/pradan_trans.png")}
          style={styles.logo}
          resizeMode="contain"
        />
  
        <Pressable onPress={() => router.replace('/profile')} style={({ pressed }) => [styles.profileCard]}>
          <Image
            source={require('../assets/images/PROFILE.jpg')}
            style={styles.profileImage}
          />
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileDesignation}>{user?.role}</Text>
            <Text style={styles.profileEmail}>{user?.username}</Text>
          </View>
        </Pressable>
  
        <View style={styles.dashboardHeader}>
           <Text style={styles.dashboardTitle}>
          {pageTexts[pageIndex]}
        </Text>
  
          <View style={styles.slideToggleContainer}>
            <Animated.View
              style={[styles.slideHighlight, { transform: [{ translateX: interpolatedTranslate }] }]}
            />
            <Pressable
              style={styles.slideButton}
              onPress={() => toggleTab('Today')}
            >
              <Text style={[styles.slideText, activeTab === 'Today' && styles.activeText]}>
                Today
              </Text>
            </Pressable>
            <Pressable
              style={styles.slideButton}
              onPress={() => toggleTab('Total')}
            >
              <Text style={[styles.slideText, activeTab === 'Total' && styles.activeText]}>
                Total
              </Text>
            </Pressable>
          </View>
        </View>
        <PagerView style={styles.pagerView} initialPage={0}
         onPageSelected={(e) => setPageIndex(e.nativeEvent.position)}>
        <View>
          <FlatList
        key='1'
          data={currentData}
          numColumns={2}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
        </View>
     <View>
         <FlatList
        key='2'
          data={currentData   }
          numColumns={2}
          renderItem={renderCard2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
     </View>
        </PagerView>

        
      {/* Dots indicator */}
      <View style={styles.dotContainer}>
        {pageIndex === 0 ? (
          <View style={styles.activeDot} />
        ) : (
          <View style={styles.inactiveDot} />
        )}
        {pageIndex === 1 ? (
          <View style={styles.activeDot} />
        ) : (
          <View style={styles.inactiveDot} />
        )}
      </View>    


        <Pressable
          style={styles.newFormButton}
          onPress={() => {
            setModalVisible(true)
            resetData();}
          }
        >
          <MaterialIcons name="add-circle-outline" size={width * 0.10} color="#fff" />
          <Text style={styles.newFormText}>New Form</Text>
        </Pressable>
        <TouchableOpacity
        style={styles.draftButton}
        onPress={() => {
          resetData();
          router.push("/draft");
        }}
      >
        <MaterialIcons name="insert-drive-file" size={width * 0.10} color="#fff" />
        <Text style={styles.newFormText}>Draft</Text>
      </TouchableOpacity>
        
  
        <Modal visible={modalVisible} transparent animationType="slide">
  <Pressable
    style={styles.modalBackground}
    onPress={() => setModalVisible(false)}  // close modal when background pressed
  >
    <Pressable
      style={styles.modalContainer}
      onPress={(e) => e.stopPropagation()}  // prevent closing when clicking inside the container
    >
      <Text style={styles.modalHeader}>Choose a Form</Text>

      <Pressable
        style={styles.optionButton}
        onPress={() => {
          setModalVisible(false);
          router.push({pathname:"/prefd/basicDetails",params:{fromland:"true", frompond :"false",fromplantation:"false"}});
        }}
      >
        <Text style={styles.optionText}>Land Development Form</Text>
      </Pressable>

      <Pressable
        style={styles.optionButton}
        onPress={() => {
          setModalVisible(false);
          router.push({pathname:"/prefd/basicDetails",params:{fromland:"false", frompond :"true",fromplantation:"false"}});
        }}
      >
        <Text style={styles.optionText}>Pond Construction Form</Text>
      </Pressable>

      <Pressable
        style={styles.optionButton}
        onPress={() => {
          setModalVisible(false);
          router.push({pathname:"/prefd/basicDetails",params:{fromland:"false", frompond :"false",fromplantation:"true"}});
        }}
      >
        <Text style={styles.optionText}>Plantation Form</Text>
      </Pressable>

      <Pressable
        style={[styles.optionButton, styles.cancelButton]}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
      {/* <Pressable
        style={[styles.optionButton, styles.cancelButton]}
        onPress={() =>{ setModalVisible(false)
              router.push("/Verifier/verifierdashboard");
        }}
      >
        <Text style={styles.cancelText}>Verifier</Text>
      </Pressable> */}
    </Pressable>
  </Pressable>
</Modal>

      </SafeAreaView>
    );
  };
  
  export default DashboardScreen;

  const styles = StyleSheet.create({  
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(10),
  },
  pagerView: {
    flex: 1,
  },
  logo: {
    margin: moderateScale(10),               // smooth scaling
    width: scale(220),                       // horizontal scaling for image width
    height: verticalScale(80),               // vertical scaling for image height
    marginBottom: verticalScale(12),         // vertical spacing
    alignSelf: 'center',
  },
    profileCard: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      marginBottom: verticalScale(8),           // vertical scaling for spacing
      padding: moderateScale(10),                // smooth padding scaling
      borderRadius: moderateScale(12),          // scaling border radius
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: moderateScale(5),           // scaling shadow blur
      shadowOffset: { width: 0, height: verticalScale(2) },  // vertical scaling for shadow offset
      elevation: 4,
    },
    profileImage: {
      width: scale(55),                        // scale the width
      height: scale(55),                       // scale the height
      borderRadius: scale(100),                // rounded image with scaling
      marginRight: scale(12),                  // horizontal margin scaling
    },
    profileText: {
      flex: 1,
    },
    profileName: {
      fontSize: moderateScale(16),             // moderate scaling for font size
      fontWeight: 'bold',
      color: '#134e13',
    },
    profileDesignation: {
      fontSize: moderateScale(14),             // moderate scaling for font size
      color: '#555',
      marginBottom: verticalScale(2),          // vertical scaling for spacing
    },
    profileEmail: {
      fontSize: moderateScale(13),             // moderate scaling for font size
      color: '#777',
    },
    dashboardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: verticalScale(15),          // vertical scaling for spacing
      marginTop: verticalScale(20),             // vertical scaling for top margin
      marginLeft: scale(10),                    // horizontal scaling for left margin
    },
    dashboardTitle: {
      fontSize: moderateScale(20),              // moderate scaling for font size
      fontWeight: 'bold',
      color: '#134e13',
    },
    slideToggleContainer: {
      flexDirection: 'row',
      backgroundColor: '#e6f0e6',
      borderRadius: moderateScale(10),          // moderate scaling for border radius
      overflow: 'hidden',
      marginRight: scale(10),                   // horizontal scaling for right margin
      width: scale(150),                        // scaling width of the container
      height: verticalScale(30),                // vertical scaling for height
      position: 'relative',
    },
    slideButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    slideText: {
      // fontFamily:"Courier",
      fontSize: moderateScale(14),             // moderate scaling for font size
      fontWeight: 'bold',
      color: '#134e13',
    },
    activeText: {
      color: '#fff',
    },
    slideHighlight: {
      position: 'absolute',
      width: scale(80),                       // scaled width for the highlight
      height: '100%',
      backgroundColor: '#134e13',
      borderRadius: moderateScale(10),        // scaling border radius
      zIndex: 0,
    },
    row: {
      justifyContent: 'space-between',
      marginBottom: verticalScale(0),        // vertical scaling for margin
      paddingTop:scale(8),
    },
  card: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(14),             // smooth scaling for rounded corners
    paddingVertical: verticalScale(20),          // vertical scaling
    paddingHorizontal: scale(12),              // horizontal scaling
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: scale(5),                  // horizontal margin
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),              // scale shadow blur
    shadowOffset: {
      width: 0,
      height: verticalScale(0),                  // scale shadow height
    },
    elevation: 5,
  },
  count: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    marginTop: verticalScale(10),
    color: '#333',
  },
  cardLabel: {
    marginTop: verticalScale(5),
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  
  newFormButton: {
    backgroundColor: '#134e13',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(15),
    borderRadius: moderateScale(10),
    position: 'absolute',
    bottom: verticalScale(30),
    left: scale(20),
    zIndex: 10, // Ensure it's above the separator
  },
  
  draftButton: {
    backgroundColor: '#FFA500',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(34),
    borderRadius: moderateScale(10),
    position: 'absolute',
    bottom: verticalScale(30),
    right: scale(20),
    zIndex: 10,
  },
  

  
  newFormText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    padding: scale(24),
    height: '50%',
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#134e13',
    marginBottom: verticalScale(18),
  },
  optionButton: {
    backgroundColor: '#134e13',
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(14),
    width: '100%',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: scale(6),
    shadowOffset: { width: 0, height: verticalScale(3) },
  },
  optionText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#dcdcdc',
  },
  cancelText: {
    color: '#333333',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#e6e6e6',
    marginVertical: verticalScale(16),
    zIndex: 1,  // Keep it at lower zIndex so it's below the New Form button
  }, 
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: verticalScale(100),
  },
  activeDot: {
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
    backgroundColor: '#134e13',
    margin: scale(5),
  },
  inactiveDot: {
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
    backgroundColor: '#ddd',
    margin: scale(5),
  },
  });