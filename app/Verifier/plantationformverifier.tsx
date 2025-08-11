import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useState } from 'react';
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
    totalArea: '2.5',
    pradanContribution: '5000',
    farmerContribution: '2000',
    totalAmount: '7000',
    measuredByName: 'John Doe',
    measuredByDesignation: 'Field Associate',
    approvedByName: 'Jane Smith',
    approvedByDesignation: 'Verifier',
  });

  const [isEditable, setIsEditable] = useState(false);

  // State for plantation details
  const [plantations, setPlantations] = useState([
    { type: '', number: '', price: '' },
  ]);

  const [otherExpenses, setOtherExpenses] = useState('');

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log('Form Data Submitted:', formData);
    if (onSubmit) {
      onSubmit();
    }
    router.push('/dashboard_verifier');
  };

  const handlePlantationChange = (index, field, value) => {
    const updated = [...plantations];
    updated[index][field] = value;
    setPlantations(updated);
  };

  const addPlantationRow = () => {
    setPlantations([...plantations, { type: '', number: '', price: '' }]);
  };

  // Calculate total expenses
  const calculateTotalExpenses = () => {
    const plantationTotal = plantations.reduce((acc, plantation) => {
      return acc + (parseFloat(plantation.price || 0) * parseInt(plantation.number || 0));
    }, 0);
    return plantationTotal + (parseFloat(otherExpenses) || 0);
  };

  const totalExpenses = calculateTotalExpenses();

  return (
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
            editable={item.editable !== false ? isEditable : false}
            onChangeText={(text) => handleChange(item.field, text)}
            keyboardType="numeric"
          />
        </View>
      ))}

      {/* Plantation Table Section */}
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
          </View>
        ))}

        {isEditable && (
          <TouchableOpacity onPress={addPlantationRow}>
            <Text style={styles.addRowText}>+ Add Row</Text>
          </TouchableOpacity>
        )}

        {/* Other Expenses and Total Expenses */}
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

        {/* Total Expenses Row */}
        <View style={styles.tableRow}>
          <TextInput
            style={styles.tableInput}
            placeholder="Total expenses"
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
          <Ionicons
            name="checkmark-circle-sharp"
            size={26}
            color="#fff"
            style={{ marginRight: 8 }}
          />
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
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0B8B42',
    padding: 10,
  },
  tableHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginVertical: 2,
    padding: 10,
  },
  tableInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.012,
    backgroundColor: '#E8F5E9',
    fontSize: width * 0.035,
    marginHorizontal: width * 0.01,
  },
  addRowText: {
    fontSize: width * 0.04,
    color: '#0B8B42',
    textAlign: 'center',
    marginTop: height * 0.01,
  },
  submitButton: {
    backgroundColor: '#0B8B42',
    borderRadius: width * 0.02,
    paddingVertical: height * 0.015,
    marginTop: height * 0.03,
  },
  submitButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: width * 0.05,
    color: '#fff',
  },
});

export default BasicDetailsForm;