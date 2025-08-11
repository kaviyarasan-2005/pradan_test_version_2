import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, BackHandler, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useDraftStore } from '../storage/DraftStore';
import { useFormStore } from '../storage/useFormStore';
const { height, width } = Dimensions.get('window');
export default function DraftsScreen() {
  const router = useRouter();
  const { setData } = useFormStore();
  const { drafts, loadDrafts, clearDrafts } = useDraftStore(); 

  useEffect(() => {
    loadDrafts(); 
  }, []);

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

  const openDraft = (item) => {
    setData("user_id",item.user_id);
    setData("basicDetails", item.basicDetails);
    setData("landOwnership", item.landOwnership);
    setData("landDevelopment", item.landDevelopment);
    setData("bankDetails", item.bankDetails);
    setData("id", item.id);
    setData("formType",item.formType)
    // setData("form_type", item.formType);
    // setData("formStatus", item.formStatus);
    // setData("fundStatus", item.fundStatus);

    const pathMap = {
      1: "/landform/Preview",
      2: "/pondform/Preview",
      3: "/plantationform/Preview",
    };
      console.log(item.formType + "  name  ");
    router.push({
      
      pathname: pathMap[item.formType],//
      params: { fromdraft: "true" },
    });
  };

  const uploadAllDrafts = async () => {
    try {
      await clearDrafts(); 
      Alert.alert("Success", "All drafts uploaded to submitted forms");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to upload drafts");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
              <IconButton
                icon="arrow-left"
                size={width * .05}
               onPress={() => router.back()}
                iconColor="#fff"
              />
              <Text style={styles.title}>DRAFT</Text>
            </View> 
 <View  style={styles.separator} />
<FlatList
  data={[...drafts].reverse()}  // show most recent drafts at top
  keyExtractor={(item, index) => `${index}`}
  contentContainerStyle={{ padding: width * 0.005, paddingTop: height * 0.04 }}
  renderItem={({ item }) => (
    <TouchableOpacity
      onPress={() => openDraft(item)}
      style={styles.card} 
    >
      <Text style={styles.name}>
        {item.basicDetails?.name?.trim() || "Unnamed Draft"}
      </Text>

      <View style={styles.rightContainer}>
        <Text style={styles.rightText}>
          <Text style={styles.label}>Form: </Text>
          {parseInt(item.formType) === 1
            ? 'LAND'
            : parseInt(item.formType) === 2
            ? 'POND'
            : parseInt(item.formType) === 3
            ? 'PLANTATION'
            : 'UNKNOWN'}
        </Text>
      </View>

      {item.savedAt && (
        <Text style={{ color: 'gray', fontSize: 12 }}>
          Saved on: {new Date(item.savedAt).toLocaleString()}
        </Text>
      )}
    </TouchableOpacity>
  )}
/>




      {/* {drafts.length > 0 && (
  <Button title="Clear All Drafts" onPress={uploadAllDrafts} />

      )} */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1B5E20',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: height * 0.01,
    paddingBottom: height * 0.01,
    paddingHorizontal: width * 0.04,
    elevation: 4,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    width: '100%',
  },
  title: {
    color: '#fff',
    fontSize: height * 0.022, // Responsive font size
    fontWeight: 'bold',
    marginLeft: -width * 0.01,
    flex: 1,
    textAlign: 'left',
  },
  separator: {
    height: 0,
    backgroundColor: '#ddd',
    marginTop: height * 0.06, // Space below fixed header
  },
  scrollView: {
    marginTop: height * 0.06,
    paddingHorizontal: width * 0.04,
  },
  noResults: {
    textAlign: 'center',
    fontSize: height * 0.022,
    color: '#888',
  },
card: {
  marginHorizontal: width * 0.04,
  marginVertical: height * 0.01,
  backgroundColor: '#F5F5F5',
  elevation: 5,
  borderRadius: width * 0.025,
  padding: height * 0.015,
},

  bioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftContainer: {
    flex: 1.2,
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 0.9,
    alignItems: 'flex-start',
  },
  name: {
    fontSize: height * 0.022,
    fontWeight: 'bold',
    color: '#388E3C',
  },
  rightText: {
    fontSize: height * 0.018,
    color: '#555',
    textAlign: 'left',
    width: '100%',
    marginBottom: height * 0.005,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
});