import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
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
  const route = useRoute();
  const { onSubmit } = route.params || {};

  const [formData, setFormData] = useState({
    name: 'John Doe',
    fatherSpouse: 'Father Name',
    code: '12345',
    hamlet: 'Hamlet Name',
    panchayat: 'Panchayat Name',
    revenueVillage: 'Revenue Village Name',
    block: 'Block Name',
    district: 'District Name',
    length: '',
    breadth: '',
    depth: '',
    totalArea: '0',
    pradanContribution: '5000',
    farmerContribution: '2000',
    totalAmount: '7000',
    measuredByName: 'John Doe',
    measuredByDesignation: 'Field Associate',
    approvedByName: 'Jane Smith',
    approvedByDesignation: 'Verifier',
  });

  const [isEditable, setIsEditable] = useState(false);

  // Recalculate total area and total amount when relevant fields change
  useEffect(() => {
    const { length, breadth, depth, pradanContribution, farmerContribution } = formData;

    if (length && breadth && depth) {
      const totalArea = (parseFloat(length) * parseFloat(breadth) * parseFloat(depth)).toFixed(2);
      setFormData((prevData) => ({ ...prevData, totalArea }));
    }

    const totalAmount = (parseFloat(pradanContribution) + parseFloat(farmerContribution)).toFixed(2);
    setFormData((prevData) => ({ ...prevData, totalAmount }));
  }, [formData.length, formData.breadth, formData.depth, formData.pradanContribution, formData.farmerContribution]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log('Form Data Submitted:', formData);
    if (onSubmit) {
      onSubmit();
    }
    router.push('/dashboard_verifier'); // navigate to dashboard
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0B8B42" />
        </TouchableOpacity>
        <Text style={styles.header}>Land Form Verification</Text>
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
          />
        </View>
      ))}

      {[ 
        { label: 'Length (m)', field: 'length' },
        { label: 'Breadth (m)', field: 'breadth' },
        { label: 'Depth (m)', field: 'depth' },
        { label: 'Total Area (cu m)', field: 'totalArea', editable: false }, // Display the calculated value
      ].map((item, index) => (
        <View style={styles.formGroup} key={index}>
          <Text style={styles.label}>{item.label}</Text>
          <TextInput
            style={styles.inputEditable}
            value={formData[item.field]}
            editable={item.editable !== false ? isEditable : false}
            onChangeText={(text) => handleChange(item.field, text)}
            keyboardType="numeric" // to accept numeric input
          />
        </View>
      ))}

      {[ 
        { label: 'Pradan Contribution', field: 'pradanContribution' },
        { label: 'Farmer Contribution', field: 'farmerContribution' },
        { label: 'Total Amount', field: 'totalAmount', editable: false }, // Display the total amount
      ].map((item, index) => (
        <View style={styles.formGroup} key={index}>
          <Text style={styles.label}>{item.label}</Text>
          <TextInput
            style={styles.inputEditable}
            value={formData[item.field]}
            editable={item.editable !== false ? isEditable : false}
            onChangeText={(text) => handleChange(item.field, text)}
            keyboardType="numeric" // to accept numeric input
          />
        </View>
      ))}

      {/* Measured By Section */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Measured By</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputEditable}
            value={formData.measuredByName}
            editable={isEditable}
            onChangeText={(text) => handleChange('measuredByName', text)}
            placeholder="Enter Name"
          />
          <TextInput
            style={styles.inputEditable}
            value={formData.measuredByDesignation}
            editable={isEditable}
            onChangeText={(text) => handleChange('measuredByDesignation', text)}
            placeholder="Enter Designation"
          />
        </View>
      </View>

      {/* Approved By Section */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Approved By</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputEditable}
            value={formData.approvedByName}
            editable={false}
            placeholder="Name"
          />
          <TextInput
            style={styles.inputEditable}
            value={formData.approvedByDesignation}
            editable={false}
            placeholder="Designation"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <View style={styles.submitButtonContent}>
          <Ionicons name="checkmark-circle-sharp" size={26} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.submitButtonText}>VERIFY</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
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
    color: '#333',
    fontSize: width * 0.035,
    height: height * 0.06,
  },
  inputEditable: {
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.012,
    backgroundColor: '#E8F5E9',
    color: '#333',
    fontSize: width * 0.035,
    height: height * 0.06,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    marginTop: height * 0.03,
    backgroundColor: '#0B8B42',
    paddingVertical: height * 0.015,
    borderRadius: width * 0.03,
    alignItems: 'center',
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: width * 0.05,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BasicDetailsForm;