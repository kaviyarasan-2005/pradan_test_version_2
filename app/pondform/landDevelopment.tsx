import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { BackHandler, Dimensions, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Checkbox, Text } from "react-native-paper";
import { useFormStore } from "../../storage/useFormStore";
const { width, height } = Dimensions.get('window');
export default function PondDevelopment() {
  const router = useRouter();
  const { id, fromPreview,returnTo,returnsubmit,fromsubmit,fromland,fromplantation,frompond } = useLocalSearchParams<{ id?: string; fromPreview?: string }>();
  const { data, submittedForms, setData } = useFormStore();
  const [form, setForm] = useState(
    data.landDevelopment || {
      date:"",//cd
      sfNumber: "",//cd
      soilTypeCombined: [],//cd
      landBenefit: "",//cd
      proposalArea: "",//cd
      latitude: "",//cd
      longitude: "",//cd
      length: "",
      breadth: "",
      depth: "",
      volume: "",
      pradanContribution: "",//cd
      farmerContribution: "",//cd
      totalEstimate: "",//cd
    }
  );
  useEffect(() => {
    const today = new Date();
    const formattedDate = ("0" + today.getDate()).slice(-2) + '/' + ("0" + (today.getMonth() + 1)).slice(-2) + '/' + today.getFullYear();
    
      updateField("date", formattedDate);
    if (id && fromPreview === "true") {
      // Load the form by ID and update current working data
      const selected = submittedForms.find((form) => form.id === id);
      if (selected) {
        // Set every key in the form data
        Object.entries(selected).forEach(([key, value]) => {
          setData(key as keyof typeof data, value);
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
  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCheckbox = (field: string, value: string) => {
    setForm((prev) => {
      const currentValue = typeof prev[field] === "string" ? prev[field] : "";
      const current = currentValue.split(",").filter(Boolean); // removes empty strings
  
      let updated;
      if (current.includes(value)) {
        updated = current.filter((item) => item !== value);
      } else {
        updated = [...current, value];
      }
  
      return {
        ...prev,
        [field]: updated.join(","),
      };
    });
  };
  const totalestimation =(feild : any,value : any) =>{
    const farmer = parseInt(feild) || 0;
    const pradan = parseInt(value) || 0;
    const totalestimate  = String(farmer + pradan);
    updateField("totalEstimate",totalestimate);
  }
  const renderCheckboxGroup = (
    
    field: string,
    options: string[],
    isSingle: boolean = false
  ) =>
    
    options.map((item) => (
      
      <Checkbox.Item
        key={item}
        label={item}
        status={
          isSingle
            ? form[field] === item
              ? "checked"
              : "unchecked"
            : form[field].includes(item)
            ? "checked"
            : "unchecked"
        }
        
        onPress={() =>
          
          isSingle ? updateField(field, item) : toggleCheckbox(field, item)
        }
      />
    ));
    const handleNext = () => {
      setData("landDevelopment", form);
      setTimeout(() => {
        if (fromPreview && returnTo) {
     
          router.push({ pathname: returnTo, params: { id ,returnsubmit:returnsubmit,fromsubmit:fromsubmit} });
        } else {
          if(fromland== "true"){
            router.push({pathname:"/prefd/bankDetails",params:{fromland:"true", frompond :"false",fromplantation:"false"}});
          }
          else if(frompond== "true"){
            router.push({pathname:"/prefd/bankDetails",params:{fromland:"false", frompond :"true",fromplantation:"false"}});
          }
          else if (fromplantation == "true"){
            router.push({pathname:"/prefd/bankDetails",params:{fromland:"false", frompond :"false",fromplantation:"true"}});
          }
        }
      }, 50); 
    };
  // Auto-calculate volume
  useEffect(() => {
    const l = parseFloat(form.length);
    const b = parseFloat(form.breadth);
    const d = parseFloat(form.depth);
    if (!isNaN(l) && !isNaN(b) && !isNaN(d)) {
      const volume = (l * b * d).toFixed(2);
      setForm((prev) => ({ ...prev, volume }));
    } else {
      setForm((prev) => ({ ...prev, volume: "" }));
    }
  }, [form.length, form.breadth, form.depth]);

  return (
      <KeyboardAwareScrollView style={styles.container}>
    <ScrollView contentContainerStyle={styles.inner}>
      {/* <IconButton icon="arrow-left" size={24} onPress={() => router.back()} /> */}

        <Text style={styles.heading_land}>FARM POND FORM</Text>
     <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={width * .06} color="#0B8B42" />
          </TouchableOpacity>
          <Text style={styles.heading}>Design of Farm Pond</Text>
        </View>

     <Text style={styles.label}>34. S.F. No. of the land to be developed</Text>
      <TextInput
        value={form.sfNumber}
        onChangeText={(text) => updateField("sfNumber", text)}
        style={styles.input}
         
         placeholder="Enter S.F. Number"
          placeholderTextColor="#888"
      />

<Text style={styles.label}>35.a) Latitude and Longitude</Text>
<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

  {/* Latitude */}
  <View style={{ flex: 1, marginRight: 5 }}>
    <TextInput
      style={styles.input}
      placeholder="Latitude (e.g., 12.123456)"
      value={form.latitude}
      onChangeText={(text) => {
        updateField("latitude", text);
      }}
      keyboardType="numeric"
    />
    {form.latitude !== "" &&
      !/^\d+\.\d{1,6}$/.test(form.latitude) && (
        <Text style={styles.errorText}>
          Invalid: must have 1–6 digits after decimal
        </Text>
      )}
  </View>

  {/* Longitude */}
  <View style={{ flex: 1, marginLeft: 5 }}>
    <TextInput
      style={styles.input}
      placeholder="Longitude (e.g., 77.654321)"
      value={form.longitude}
      onChangeText={(text) => {
        updateField("longitude", text);
      }}
      keyboardType="numeric"
    />
    {form.longitude !== "" &&
      !/^\d+\.\d{1,6}$/.test(form.longitude) && (
        <Text style={styles.errorText}>
          Invalid: must have 1–6 digits after decimal
        </Text>
      )}
  </View>

</View>

         <Text style={styles.label}>36. Soil Type</Text>
        {renderCheckboxGroup("soilTypeCombined", ["Red Soil", "Black Cotton", "Sandy Loam", "Laterite"])}

       <Text style={styles.label}>37. Date of Inspection</Text>
               <TextInput
           value={form.date}
           style={styles.input}
           editable={false}
         />

      {/* <Text style={styles.label}>33. Land to benefit (ha)</Text>
      <TextInput
        value={form.landBenefit}
        onChangeText={(text) => updateField("landBenefit", text)}
        style={styles.input}
        keyboardType="numeric"
         
      /> */}
   <Text style={styles.label}>38. Area benifited by proposed works(ha)</Text>
      <TextInput
        value={form.proposalArea}
        onChangeText={(text) => updateField("proposalArea", text)}
         placeholder="Enter land area"
          placeholderTextColor="#888"
        style={styles.input}
        keyboardType="numeric"
         
      />

   

     <Text style={styles.label}>39.a) Length in meter</Text>
      <TextInput
        value={form.length}
         placeholder="Enter length"
          placeholderTextColor="#888"
        onChangeText={(text) => updateField("length", text)}
        style={styles.input}
        keyboardType="numeric"
        
      />

          <Text style={styles.label}>39.b) Breadth in meter</Text>
      <TextInput
        value={form.breadth}
        onChangeText={(text) => updateField("breadth", text)}
        style={styles.input}
         placeholder="Enter breadth"
          placeholderTextColor="#888"
        keyboardType="numeric"
       
      />

  <Text style={styles.label}>39.c) Depth in meter</Text>
      <TextInput
        value={form.depth}
        onChangeText={(text) => updateField("depth", text)}
        style={styles.input}
        keyboardType="numeric"
         placeholder="Enter depth"
          placeholderTextColor="#888"
         
      />

      <Text style={styles.label}>40. Volume of Excavation</Text>
      <TextInput
      placeholder='0'
        placeholderTextColor="#888"
        value={form.volume}
        style={styles.input}
         
        editable={false}
      />

          <View style={{ marginVertical: 10 }}>
        <Text style={styles.label}>41. PRADAN Contribution</Text>
        <TextInput
          placeholder="Enter amount"
          placeholderTextColor="#888"
          value={form.pradanContribution}
          onChangeText={(text) => {
            updateField("pradanContribution", text);
            totalestimation(text, form.farmerContribution);
          }}
          style={styles.input}
          keyboardType="numeric"
        />
      
        {form.pradanContribution !== "" &&
          (!/^\d+$/.test(form.pradanContribution) ||
            Number(form.pradanContribution) > 30000) && (
            <Text style={styles.errorText}>
              Invalid: must be a number less than 30,000
            </Text>
          )}
      </View>
      

     
          <Text style={styles.label}>42. Farmer contribution (in Rs)</Text>
           <TextInput
             value={form.farmerContribution}
             placeholder="Enter amount"
          placeholderTextColor="#888"
             onChangeText={(text) => {updateField("farmerContribution", text)
               totalestimation( text, form.pradanContribution )
             }}
             
             style={styles.input}
             keyboardType="numeric"
           />
     
           <Text style={styles.label}>43. Total Estimate Amount (in Rs)</Text>
                       <TextInput
                       value={form.totalEstimate}
                         editable={false}
                         placeholder="0"
          placeholderTextColor="#888"
                         style={styles.input}
                          
                       />
      
 <TouchableOpacity style={styles.nextBtn}  onPress={handleNext}>
          <Text style={styles.nextBtnText}> {fromPreview ? "Preview" : "Next"}</Text>
        </TouchableOpacity>
      {/* <Button mode="contained" onPress={handleNext} style={styles.button}>
      {fromPreview ? "Preview" : "Next"}
      </Button> */}
    </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   padding: 20,
  //   paddingBottom: 40,
  // },
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
  // label: {
  //   fontWeight: "bold",
  //   marginTop: 10,
  //   marginBottom: 5,
  // },
  // input: {
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  //   padding: 10,
  //   marginBottom: 10,
  //   borderRadius: 5,
  // },
  button: {
    marginTop: 30,
  },
  divider: {
    marginVertical: 10,
  },
   container: {
    flex: 1,
    backgroundColor: '#F1F7ED',
  },
  inner: {
    paddingTop: height * 0.025,
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.025,
  },
  heading_land: {
    fontSize: width * 0.055, // ~22 on 400px screen
    fontWeight: 'bold',
    color: '#0B8B42',
    marginBottom: height * 0.012,
    textAlign: 'center',
  },
   errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 14
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.025,
  },
  backButton: {
    zIndex: 10,
  },
  heading: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#0B8B42',
    marginLeft: width * 0.025,
  },
  label: {
    fontSize: width * 0.035,
    marginVertical: height * 0.01,
    color: '#333',
    fontWeight: 'bold',
  },
  input: {
     height: height * 0.06,
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: width * 0.025,
    paddingHorizontal: width * 0.035,
    paddingVertical: height * 0.000,
    backgroundColor: '#E8F5E9',
    color: '#333',
    fontSize: width * 0.035,
    marginBottom: height * 0.015,
  },
  checkboxGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: height * 0.015,
  },
  checkboxOption: {
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