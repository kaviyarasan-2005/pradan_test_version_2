import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import * as Crypto from 'expo-crypto';
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { BackHandler, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { IconButton, RadioButton } from "react-native-paper";
import { useFormStore } from "../../storage/useFormStore";
import { useUserStore } from "../../storage/userDatastore";

const { width, height } = Dimensions.get('window');

export default function BankDetails() {
  const router = useRouter();
  const { id, fromPreview, returnTo, fromsubmit, returnsubmit, fromland, fromplantation, frompond } = useLocalSearchParams();
  const { data, submittedForms, setData } = useFormStore();
  const { user } = useUserStore();

  const [form, setForm] = useState(
    data.bankDetails || {
      accountHolderName: "",
      accountNumber: "",
      bankName: "",
      branch: "",
      ifscCode: "",
      farmerAgreed: "",
      pf_passbook:"",
      formStatus: "",
      submittedFiles: {
        patta: null,
        idCard: null,
        fmb: null,
        farmerPhoto: null,
        bankPassbook: null,
        geoTag: null,
      },
     
    }
  );

  useEffect(() => {
    if (id && fromPreview === "true") {
      const selected = submittedForms.find((form) => form.id === id);
      if (selected) {
        Object.entries(selected).forEach(([key, value]) => {
          setData(key, value);
        });
      }
    }
  }, [id]);

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

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const uploadDocument = async (file, field) => {
    const ext = file.name?.split('.').pop() || (file.type === "image" ? "jpg" : "pdf");
    const randomBytes = await Crypto.getRandomBytesAsync(16);
    const secureName = [...randomBytes].map((b) => b.toString(16).padStart(2, '0')).join('') + `.${ext}`;
    const localFilePath = `${FileSystem.documentDirectory}${secureName}`;

    try {
      await FileSystem.copyAsync({
        from: file.uri,
        to: localFilePath,
      });

      setForm((prev) => ({
        ...prev,
        submittedFiles: {
          ...prev.submittedFiles,
          [field]: {
            name: secureName,
            name2: file.name,
            uri: localFilePath,
          },
        },
      }));
    } catch (error) {
      console.error("Local file save error:", error);
    }
  };

  const handleUpload = async (field, fileType = "pdf") => {
    try {
      if (field === "farmerPhoto") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          alert("Camera permission is required to take a photo.");
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.7,
        });

        if (!result.canceled && result.assets?.[0]) {
          const file = result.assets[0];
          uploadDocument(file, field);
        }
      } else {
        const result = await DocumentPicker.getDocumentAsync({
          type: fileType === "image" ? "image/*" : "application/pdf",
        });

        if (!result.canceled && result.assets?.[0]) {
          const file = result.assets[0];
          uploadDocument(file, field);
        }
      }
    } catch (err) {
      console.log(`Upload error for ${field}:`, err);
    }
  };

  const handlePreview = () => {
    setData("bankDetails", form);
    if (fromPreview == "true" && returnTo) {
      router.push({ pathname: returnTo, params: { id, returnsubmit, fromsubmit } });
    } else if (fromland == "true") {
      router.push({ pathname: "/landform/Preview", params: { fromland: "true", frompond: "false", fromplantation: "false" } });
    } else if (frompond == "true") {
      router.push({ pathname: "/pondform/Preview", params: { fromland: "false", frompond: "true", fromplantation: "false" } });
    } else if (fromplantation == "true") {
      router.push({ pathname: "/plantationform/Preview", params: { fromland: "false", frompond: "false", fromplantation: "true" } });
    }
  };



  return (
      <KeyboardAwareScrollView style={styles.container}>
    <ScrollView contentContainerStyle={styles.inner}>
      <Animatable.View animation="fadeInUp" duration={600}>
     

<Text style={styles.heading_land}>
  {fromland === "true"
    ? "LAND REDEVELOPMENT FORM"
    : frompond === "true"
    ? "POND REDEVELOPMENT FORM<"
    : fromplantation === "true"
    ? "PLANTATION REDEVELOPMENT FORM<"
    : "Form"}
</Text>
    <View style={styles.header}>
      <IconButton
        icon="arrow-left"
       size={width * .06} 
        style={styles.backButton}
        onPress={() => router.back()}
      />
      <Text style={styles.heading}>Bank Details</Text>
</View>
  <View style={{ marginVertical: 10 }}>
  <Text style={styles.label}>44. Name of Account Holder</Text>
  <TextInput
    placeholder="Enter name"
    placeholderTextColor="#888"
    value={form.accountHolderName}
    onChangeText={(text) => {
      updateField("accountHolderName", text);
    }}
    style={styles.input}
  />

  {/* Error messages */}
  {(() => {
    const value = form.accountHolderName;
    const spaceCount = (value.match(/ /g) || []).length;

    if (value !== "" && !/^[A-Za-z\s]*$/.test(value)) {
      return <Text style={styles.errorText}>Invalid: only letters and spaces allowed</Text>;
    }

    if (spaceCount > 3) {
      return <Text style={styles.errorText}>Invalid: more than 3 spaces not allowed</Text>;
    }

    return null;
  })()}
</View>


  <View style={{ marginVertical: 10 }}>
  <Text style={styles.label}>45. Account Number</Text>
  <TextInput
    value={String(form.accountNumber)}
    placeholder="Enter account number"
    placeholderTextColor="#888"
    keyboardType="numeric"
    onChangeText={(text) => {
      updateField("accountNumber", text);
    }}
    style={styles.input}
  />

  {/* Error message */}
  {form.accountNumber !== "" && !/^[0-9]*$/.test(form.accountNumber) && (
    <Text style={styles.errorText}>Invalid: only numbers allowed</Text>
  )}
</View>


      <View style={{ marginVertical: 10 }}>
  <Text style={styles.label}>46. Name of the Bank</Text>
  <TextInput
    value={form.bankName}
    placeholder="Enter bank name"
    placeholderTextColor="#888"
    onChangeText={(text) => {
      updateField("bankName", text);
    }}
    // autoCorrect={false}       // disable autocorrect
    // spellCheck={false}        // disable spellcheck
    style={styles.input}
  />

  {form.bankName !== "" && !/^[A-Za-z\s]*$/.test(form.bankName) && (
    <Text style={styles.errorText}>Invalid: only letters and spaces allowed</Text>
  )}
</View>


      <Text style={styles.label}>47. Branch</Text>
<TextInput
  value={form.branch}
  placeholder="Enter branch name"
  placeholderTextColor="#888"
  onChangeText={(text) => {
    updateField("branch", text);
  }}
  // autoCorrect={false}   // prevent OS red underline
  // spellCheck={false}    // disable spellcheck
  style={styles.input}
/>

{form.branch !== "" && !/^[A-Za-z\s]*$/.test(form.branch) && (
  <Text style={styles.errorText}>Invalid: only letters and spaces allowed</Text>
)}

<Text style={styles.label}>48. IFSC</Text>
<TextInput
  value={form.ifscCode}
  placeholder="Enter IFSC code"
  placeholderTextColor="#888"
  // maxLength={11} // stops typing beyond 11
  onChangeText={(text) => {
    updateField("ifscCode", text.toUpperCase()); // keep original, just uppercase
  }}
  style={styles.input}
  autoCapitalize="characters"
/>

{form.ifscCode !== "" &&
  (!/^[A-Z0-9]{4}0[A-Z0-9]{6}$/.test(form.ifscCode) ||
    form.ifscCode.length !== 11) && (
    <Text style={styles.errorText}>
      Invalid: IFSC must be exactly 11 characters (e.g., ABCD0XXXXXX)
    </Text>
)}


<Text style={styles.label}>49. Farmer has agreed for the work, and his contribution</Text>
      <RadioButton.Group
        onValueChange={(value) => updateField("farmerAgreed", value)}
        value={form.farmerAgreed}
      >
        <RadioButton.Item label="Yes" value="Yes" />
        <RadioButton.Item label="No" value="No" />
      </RadioButton.Group>

   
  <>
    <Text style={styles.label}>50. Upload Documents:</Text>
       <View style={styles.uploadGroup}>
    {[
      { label: "Patta", key: "patta", type: "pdf" },
      { label: "ID Card", key: "idCard", type: "pdf" },
      { label: "FMB", key: "fmb", type: "pdf" },
      { label: "Photo of Farmer", key: "farmerPhoto", type: "image" },
      { label: "Bank Passbook", key: "bankPassbook", type: "pdf" },
      { label: "Geo Tag", key: "geoTag", type: "image" },
    ].map((file) => (
<React.Fragment key={file.key}>
  <TouchableOpacity
    onPress={() => handleUpload(file.key, file.type)}
    style={styles.uploadBox}
  >
    <Ionicons
      name={file.label ? 'document-attach' : 'cloud-upload-outline'}
      size={width * 0.05}
      color="#0B8B42"
    />
    <Text style={styles.uploadLabel}>{file.label}</Text>

    {form.submittedFiles[file.key]?.name && (
      <Text style={styles.uploadStatus}>
        Uploaded: {form.submittedFiles[file.key].name2}
      </Text>
    )}
  </TouchableOpacity>
</React.Fragment>


    ))}
    </View>
  </>

       <TouchableOpacity style={styles.nextBtn} onPress={() =>handlePreview() }>
                  <Text style={styles.nextBtnText}>{fromPreview ? "Preview" : "Next"}</Text>
                </TouchableOpacity>
      {/* <Button
        mode="contained"
        onPress={handlePreview}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        {fromPreview ? "Preview" : "Next"}
      </Button> */}
      </Animatable.View>
    </ScrollView>
    
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  question: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  uploadButton: {
    marginTop: 8,
    marginBottom: 4,
  },
  uploadedFile: {
    fontStyle: "italic",
    marginBottom: 10,
    color: "green",
  },
  button: {
    marginTop: 30,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
   container: {
    flex: 1,
    backgroundColor: '#F1F7ED',
  },
  inner: {
    padding: width * 0.05,
    paddingBottom: height * 0.025,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.025,
  },
  backButton: {
    marginRight: width * 0.025,
  },
  heading: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#0B8B42',
  },
  label: {
    fontSize: width * 0.035,
    marginVertical: height * 0.01,
    color: '#333',
    fontWeight: '600',
  },
  heading_land: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#0B8B42',
    marginBottom: height * 0.025,
    textAlign: 'center',
  },
    errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 14
  },
  input: {
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: width * 0.025,
    paddingHorizontal: width * 0.035,
    paddingVertical: height * 0.015,
    backgroundColor: '#E8F5E9',
    color: '#333',
    fontSize: width * 0.035,
    marginBottom: height * 0.015,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: height * 0.015,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: width * 0.04,
    marginBottom: height * 0.01,
  },
  radioText: {
    marginLeft: width * 0.015,
    fontSize: width * 0.035,
    color: '#333',
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
  },
uploadStatus: {
  fontSize: width * 0.03,
  color: '#777',
  marginTop: height * 0.005,
  textAlign: 'center',
  width: width * 0.4,     // Limit width to half screen
  alignSelf: 'center',
  flexWrap: 'wrap',
},


  nextBtn: {
    backgroundColor: '#134e13',
    paddingVertical: height * 0.018,
    borderRadius: width * 0.025,
    alignItems: 'center',
    marginTop: height * 0.025,
    marginBottom: height * 0.025,
  },
  nextBtnText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
});