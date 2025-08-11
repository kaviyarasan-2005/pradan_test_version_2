import { useFormStore } from '@/storage/useFormStore';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { Buffer } from 'buffer';
import Constants from 'expo-constants';
import * as Crypto from 'expo-crypto';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View
} from 'react-native';

const { width, height } = Dimensions.get('window');
const url = Constants.expoConfig.extra.API_URL;

const PostFundBasicDetailsForm = () => {
  const { id } = useLocalSearchParams();
  const { data, submittedForms } = useFormStore();

  const selectedForm = React.useMemo(() => {
    const matched = submittedForms.find(
      (form) => String(form?.basicDetails?.form_id) === String(id)
    );
    return matched || data;
  }, [id, submittedForms, data]);

  const basicDetails = selectedForm?.basicDetails || {};
  const landDevelopment = selectedForm?.landDevelopment || {};
  const landOwnership=selectedForm?.landOwnership||{};
  const bankDetails=selectedForm?.bankDetails||{};
const [submitting, setSubmitting] = React.useState(false);
  const [formData, setFormData] = useState({
    form_id: basicDetails.form_id || '',
    name: basicDetails.name || '',
    fatherSpouse: basicDetails.fatherSpouse || '',
    code: basicDetails.idCardNumber || '',
    hamlet: basicDetails.hamlet || '',
    panchayat: basicDetails.panchayat || '',
    revenueVillage: landOwnership.revenueVillage || '',
    block: basicDetails.block || '',
    district: basicDetails.district || '',
    length: landDevelopment.length||'',
    breadth: landDevelopment.breadth || '',
    depth: landDevelopment.depth || '',
    volume: landOwnership.volume|| '',
    pradanContribution: landDevelopment.pradanContribution || '',
    farmerContribution: landDevelopment.farmerContribution || '',
    totalAmount: landDevelopment.totalEstimate || '',
  });

const canapprove = () => {
  // const status = selectedForm?.bankDetails?.status;
  const status =9;
  return  status === 9;
};


  const [files, setFiles] = useState({});
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
  useEffect(() => {
    if (formData.length && formData.breadth && formData.depth) {
      const volume = (
        parseFloat(formData.length) *
        parseFloat(formData.breadth) *
        parseFloat(formData.depth)
      ).toFixed(2);
      setFormData((prev) => ({ ...prev, totalArea: volume }));
    }
    const totalAmount = (
      parseFloat(formData.pradanContribution || '0') +
      parseFloat(formData.farmerContribution || '0')
    ).toFixed(2);
    setFormData((prev) => ({ ...prev, totalAmount }));
  }, [formData.length, formData.breadth, formData.depth, formData.pradanContribution, formData.farmerContribution]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
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

  const handleSubmit = async () => {

    if(submitting){
      return;
    }
    const { depth,breadth,length, pradanContribution, farmerContribution } = formData;
  const passbookFile = files['pf_passbook'];

  // Check if any required field is empty
  if (  !depth|| !breadth|| !length||!pradanContribution || !farmerContribution || !passbookFile) {
    Alert.alert("Missing Data", "Enter all data");
    return;
  }
    try {
      setSubmitting(true);
      const updatedForm = {
        form_id: formData.form_id,
        ...selectedForm,
        basicDetails: {
          ...selectedForm.basicDetails,
          name: formData.name,
          fatherSpouse: formData.fatherSpouse,
          idCardNumber: formData.code,
          hamlet: formData.hamlet,
          panchayat: formData.panchayat,
          revenueVillage: formData.revenueVillage,
          block: formData.block,
          district: formData.district,
        },
        landDevelopment: {
          ...selectedForm.landDevelopment,
          pradanContribution: formData.pradanContribution,
          farmerContribution: formData.farmerContribution,
          totalEstimate: formData.totalAmount,
           volume: formData.totalArea,
        },
       bankDetails: {
          ...selectedForm.bankDetails,
          pf_passbook: { ...selectedForm.bankDetails?.pf_passbook || {} },
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
          headers: { 'Content-Type': mimeType },
        });

        updatedForm.bankDetails.pf_passbook = {
          uri: file.uri,
          name: file.name,
          name2: secureName,
        };
      }

      await axios.put(`${url}/api/formData/updatepf_pondformData`, updatedForm);
      Alert.alert('Success', 'Form updated successfully!');
      router.push('/dashboard');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
    finally{
      setSubmitting(false);
    }
  };

  if (!selectedForm || !selectedForm.basicDetails) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', color: 'red' }}>Form not found!</Text>
      </View>
    );
  }

  return (
    <View style={{flex:1}}>
      <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0B8B42" />
        </TouchableOpacity>
        <Text style={styles.header}>Post Fund Basic Details</Text>
      </View>

      {['name', 'fatherSpouse', 'code', 'hamlet', 'panchayat', 'revenueVillage', 'block', 'district'].map((field, index) => (
        <View style={styles.formGroup} key={index}>
          <Text style={styles.label}>{field.replace(/([A-Z])/g, ' $1')}</Text>
          <TextInput
            style={styles.input}
            value={formData[field]}
             editable={false}
            onChangeText={(text) => handleChange(field, text)}
          />
        </View>
      ))}

      {['length', 'breadth', 'depth', 'totalArea', 'pradanContribution', 'farmerContribution', 'totalAmount'].map((field, index) => (
        <View style={styles.formGroup} key={index}>
          <Text style={styles.label}>{field.replace(/([A-Z])/g, ' $1')}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={formData[field]}
            onChangeText={(text) => handleChange(field, text)}
            editable={field !== 'totalAmount'}
          />
        </View>
      ))}

      <Text style={styles.label}>Passbook File:</Text>
      <View style={styles.uploadGroup}>
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={() => handleFilePick('pf_passbook')}
        >
          <Ionicons
            name={files['pf_passbook'] ? 'document-attach' : 'cloud-upload-outline'}
            size={width * 0.05}
            color="#0B8B42"
          />
          <Text style={styles.uploadLabel}>Upload Passbook</Text>
          <Text style={styles.uploadStatus}>
            {files['pf_passbook'] ? `Uploaded: ${files['pf_passbook'].name}` : 'Tap to Upload'}
          </Text>
        </TouchableOpacity>
      </View>

      {canapprove() &&
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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
    paddingVertical: height * 0.02,
    marginBottom: height * 0.02,
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#0B8B42',
    marginLeft: width * 0.025,
  },
  formGroup: {
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.035,
    marginVertical: height * 0.01,
    color: '#333',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.012,
    backgroundColor: '#E8F5E9',
    color: '#333',
    fontSize: width * 0.035,
    height: height * 0.06,
  },
  submitButton: {
    marginTop: height * 0.03,
    backgroundColor: '#0B8B42',
    paddingVertical: height * 0.015,
    borderRadius: width * 0.03,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: width * 0.05,
    color: '#fff',
    fontWeight: 'bold',
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

export default PostFundBasicDetailsForm;
