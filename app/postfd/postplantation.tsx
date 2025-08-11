import { useFormStore } from '@/storage/useFormStore';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Buffer } from 'buffer';
import Constants from 'expo-constants';
import * as Crypto from 'expo-crypto';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

const BasicDetailsForm = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const { submittedForms, data } = useFormStore();
const [files, setFiles] = useState({});
const url = Constants.expoConfig.extra.API_URL; // Place after `const { width, height }`

  const selectedForm = useMemo(() => {
    const matched = submittedForms.find(
      (form) => String(form?.basicDetails?.form_id) === String(id)
    );
    return matched || data;
  }, [id, submittedForms, data]);

  const basicDetails = selectedForm?.basicDetails || {};
  const landOwnership = selectedForm?.landOwnership || {};
  const landDevelopment = selectedForm?.landDevelopment || {};
  const bankDetails=selectedForm?.bankDetails||{};

  const [formData, setFormData] = useState({
    name: basicDetails.name || '',
    fatherSpouse: basicDetails.fatherSpouse || '',
    code: basicDetails.idCardNumber || '',
    hamlet: basicDetails.hamlet || '',
    panchayat: basicDetails.panchayat || '',
    revenueVillage: landOwnership.revenueVillage || '',
    block: basicDetails.block || '',
    district: basicDetails.district || '',
    totalArea: landOwnership.totalArea || 'null',
    pradanContribution: landDevelopment.pradanContribution || '',
    farmerContribution: landDevelopment.farmerContribution || '',
    // totalAmount: '',
    // measuredBy: '',
  });

  const [isEditable, setIsEditable] = useState(true);

  const [plantations, setPlantations] = useState([
    { type: '', number: '', price: '' },
  ]);

  const [otherExpenses, setOtherExpenses] = useState('');
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.back();
        return true; 
      };
  
   const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
  return () => backHandler.remove(); 
  
    }, [])
  );
  const [submitting, setSubmitting] = React.useState(false);
  useEffect(() => {
    const totalAmount = (
      parseFloat(formData.pradanContribution || 0) +
      parseFloat(formData.farmerContribution || 0)
    ).toFixed(2);
    setFormData((prev) => ({ ...prev, totalAmount }));
  }, [formData.pradanContribution, formData.farmerContribution]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };
const handleFilePick = async (key: string) => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/jpeg', 'image/png'],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (!result.canceled) {
      setFiles((prev) => ({ ...prev, [key]: result.assets[0] }));
    }
  } catch (error) {
    console.error('File pick error:', error);
  }
};
const canapprove = () => {
  // const status = selectedForm?.bankDetails?.status;
  const status =9;
  return  status === 9;
};

const handleSubmit = async () => {
if(submitting){
return;
}
    const {  totalArea,pradanContribution, farmerContribution } = formData;

      const passbookFile = files['pf_passbook'];
    
    //  plantation type,number,price acces by index
      if (   !plantations[0].number|| !plantations[0].price|| !plantations[0].type ||!otherExpenses||!totalArea||!pradanContribution || !farmerContribution || !passbookFile) {
        Alert.alert("Missing Data", "Enter all data");
        return;

      }

  try {
    setSubmitting(true);
 const totalNos = plantations.reduce(
      (sum, item) => sum + (Number(item.number) || 0),
      0
    );


    const plantationTypes = plantations.map((item) => item.type.trim()).filter(Boolean).join(',');
    const plantationNumbers = plantations.map((item) => item.number).join(',');
    const plantationPrices = plantations.map((item) => item.price).join(',');
    const updatedForm = {
      form_id: basicDetails.form_id || id,
      ...selectedForm,
      landOwnership: {
        ...selectedForm.landOwnership,
        totalArea: formData.totalArea,
      },
      landDevelopment: {
        ...selectedForm.landDevelopment,
        pradanContribution: formData.pradanContribution,
        farmerContribution: formData.farmerContribution,
        totalEstimate: formData.totalAmount,
      },
      bankDetails: {
        ...selectedForm.bankDetails,
        pf_passbook: { ...selectedForm.bankDetails?.pf_passbook || {} },
      },
      plantations: {
        plantationTypes,
        plantationNumbers,
        plantationPrices,
        otherExpenses,
      totalExpenses: totalExpenses.toFixed(2),
      total_nos: totalNos.toString()
,
      },
      
    };

    const file = files['pf_passbook'];
    if (file) {
      const ext = file.name?.split('.').pop();
      const mimeMap = {
        pdf: 'application/pdf',
        jpg: 'image/jpeg',
        png: 'image/png',
        jpeg: 'image/jpeg',
      };
      const mimeType = mimeMap[ext] || 'application/octet-stream';

      const randomBytes = await Crypto.getRandomBytesAsync(16);
      const secureName = [...randomBytes].map((b) => b.toString(16).padStart(2, '0')).join('') + `.${ext}`;

      const fileData = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const buffer = Buffer.from(fileData, 'base64');

      
      const uploadURL = await axios.get(`${url}/api/files/getUploadurl`, {
        params: { fileName: secureName },
      });

   
      await axios.put(uploadURL.data, buffer, {
        headers: {
          'Content-Type': mimeType,
        },
      });

    
      updatedForm.bankDetails.pf_passbook = {
        uri: file.uri,
        name: file.name,
        name2: secureName,
      };
    }

  
    await axios.put(`${url}/api/formData/updatepf_plantationformData`, updatedForm);

    Alert.alert('Success', 'Form updated successfully!');
    router.push('/dashboard');
  } catch (error) {
    console.error('Upload or submit error:', error);
    Alert.alert('Error', 'Failed to update form: ' + error.message);
  }
  finally{
    setSubmitting(false);
  }
};


  const handlePlantationChange = (index, field, value) => {
    const updated = [...plantations];
    updated[index][field] = value;
    setPlantations(updated);
  };

  const addPlantationRow = () => {
    setPlantations([...plantations, { type: '', number: '', price: '' }]);
  };

  const handleDeletePlantationRow = (index) => {
     if (plantations.length === 1) {
    return;
  }
    const updated = plantations.filter((_, idx) => idx !== index);
    setPlantations(updated);
  };

  const calculateTotalExpenses = () => {
    const plantationTotal = plantations.reduce((acc, plantation) => {
      return (
        acc +
        parseFloat(plantation.price || 0) * parseInt(plantation.number || 0)
      );
    }, 0);
    return plantationTotal + (parseFloat(otherExpenses) || 0);
  };

  const totalExpenses = calculateTotalExpenses();

  return (
    <View style={{flex :1}}>
      <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0B8B42" />
        </TouchableOpacity>
        <Text style={styles.header}>Horticulture Form Verification</Text>
      </View>

      {[ 
        { label: 'Name of Farmer', field: 'name' },
        { label: 'Father/Spouse', field: 'fatherSpouse' },
        { label: 'Code', field: 'code' },
        { label: 'Hamlet', field: 'hamlet' },
        { label: 'Panchayat', field: 'panchayat' },
        { label: 'Revenue Village', field: 'revenueVillage' },
        { label: 'Block', field: 'block' },
        { label: 'District', field: 'district' },
      ].map((item, index) => (
        <View style={styles.formGroup} key={index}>
          <Text style={styles.label}>{item.label}</Text>
          <TextInput
            style={styles.input}
            value={formData[item.field]}
             editable={false}
            onChangeText={(text) => handleChange(item.field, text)}
          />
        </View>
      ))}

      {[ 
        { label: 'Total Area (in Hectare)', field: 'totalArea' },
        { label: 'Pradan Contribution', field: 'pradanContribution' },
        { label: 'Farmer Contribution', field: 'farmerContribution' },
        { label: 'Total Amount', field: 'totalAmount', editable: false },
      ].map((item, index) => (
        <View style={styles.formGroup} key={index}>
          <Text style={styles.label}>{item.label}</Text>
          <TextInput
            style={styles.inputEditable}
            value={formData[item.field]}
            editable={item.editable !== false && isEditable}
            onChangeText={(text) => handleChange(item.field, text)}
            keyboardType="numeric"
          />
        </View>
      ))}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Plantation Details</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Type</Text>
          <Text style={styles.tableHeaderText}>Number</Text>
          <Text style={styles.tableHeaderText}>Price</Text>
        </View>

        {plantations.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <TextInput
              style={styles.tableInput}
              placeholder="e.g. Mango"
              value={item.type}
              onChangeText={(text) => handlePlantationChange(index, 'type', text)}
              editable={isEditable}
            />
            <TextInput
              style={styles.tableInput}
              placeholder="0"
              keyboardType="numeric"
              value={item.number}
              onChangeText={(text) => handlePlantationChange(index, 'number', text)}
              editable={isEditable}
            />
            <TextInput
              style={styles.tableInput}
              placeholder="0.00"
              keyboardType="numeric"
              value={item.price}
              onChangeText={(text) => handlePlantationChange(index, 'price', text)}
              editable={isEditable}
            />
            {isEditable && (
              <TouchableOpacity onPress={() => handleDeletePlantationRow(index)}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        {isEditable && plantations.length > 0 && (
          <TouchableOpacity onPress={addPlantationRow} style={styles.addRowIconContainer}>
            <Ionicons name="add-circle" size={40} color="#0B8B42" />
          </TouchableOpacity>
        )}

        <View style={styles.tableRow}>
          <TextInput
            style={styles.tableInput}
            placeholder="Other Expenses"
            keyboardType="numeric"
            value={otherExpenses}
            onChangeText={(text) => setOtherExpenses(text)}
            editable={isEditable}
          />
          <TextInput
            style={styles.tableInput}
            placeholder="Total Expenses"
            value={`₹ ${totalExpenses.toFixed(2)}`}
            editable={false}
          />
        </View>
      </View>

<Text style={styles.label}>Upload Document:</Text>
<View style={styles.uploadGroup}>
  <TouchableOpacity style={styles.uploadBox} onPress={() => handleFilePick('pf_passbook')}>
    <Ionicons
      name={files['pf_passbook'] ? 'document-attach' : 'cloud-upload-outline'}
      size={width * 0.05}
      color="#0B8B42"
    />
    <Text style={styles.uploadLabel}>Upload File</Text>
    <Text style={styles.uploadStatus}>
      {files['pf_passbook'] ? `Selected: ${files['pf_passbook'].name}` : 'Tap to Upload'}
    </Text>
  </TouchableOpacity>
</View>



   {canapprove() &&
     <TouchableOpacity
  style={styles.submitButton}
  onPress={handleSubmit}
>
  <Text style={styles.submitButtonText}>Submit</Text>
</TouchableOpacity>

   }

    </ScrollView>
       {submitting && (
  <View style={styles.loadingOverlay}>
    <View style={styles.circleContainer}>
      <ActivityIndicator size="large" color="#0B8B42" />
      <Text style={styles.loadingText}>Uploading...</Text>
    </View>
  </View>
)}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: width * 0.05,
    backgroundColor: '#F3F6F4',
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F6F4',
    paddingVertical: height * 0.02,
    marginBottom: height * 0.02,
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#0B8B42',
    marginLeft: 10,
  },
  formGroup: {
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.04,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.012,
    backgroundColor: '#E8F5E9',
    fontSize: width * 0.04,
  },
  uploadGroup: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
},
uploadBox: {
  width: '48%',
  borderWidth: 1,
  borderColor: '#A5D6A7',
  borderRadius: width * 0.025,
  padding: width * 0.03,
  marginBottom: height * 0.02,
  backgroundColor: '#E8F5E9',
  alignItems: 'center',
},
uploadLabel: {
  fontSize: width * 0.035,
  fontWeight: '600',
  marginTop: height * 0.01,
  color: '#333',
  textAlign: 'center',
},
uploadStatus: {
  fontSize: width * 0.03,
  color: '#777',
  marginTop: height * 0.005,
  textAlign: 'center',
},

  inputEditable: {
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.012,
    backgroundColor: '#E8F5E9',
    fontSize: width * 0.04,
    marginBottom: height * 0.01,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: height * 0.015,
    alignItems: 'center', // Align the delete button to the right
  },
  tableInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.012,
    backgroundColor: '#E8F5E9',
    marginRight: width * 0.02,
    fontSize: width * 0.04,
  },
  addRowIconContainer: {
    marginVertical: height * 0.02,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#0B8B42',
    paddingVertical: height * 0.015,
    borderRadius: width * 0.02,
    marginTop: height * 0.02,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    paddingLeft: 170,
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0B8B42',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0B8B42',
  },
  radioLabel: {
    marginLeft: 5,
    fontSize: width * 0.035,
    color: '#333',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999, // for Android
  },
  circleContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  loadingText: {
    marginTop: 10,
    color: '#0B8B42',
    fontWeight: 'bold',
  },

  
});

export default BasicDetailsForm;
