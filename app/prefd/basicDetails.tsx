import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { BackHandler, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Checkbox, RadioButton } from "react-native-paper";
import { useFormStore } from "../../storage/useFormStore";
import { useUserStore } from "../../storage/userDatastore";
  const { width, height } = Dimensions.get('window'); 
export default function BasicDetails() {
  const router = useRouter();
  const { id, fromPreview, returnTo, returnsubmit, fromsubmit,fromland,fromplantation,frompond } = useLocalSearchParams<{
    id?: string;
    fromPreview?: string;
    returnTo?: string;
    returnsubmit?: string;
    fromsubmit?: string;
    fromland?: string;
    frompond?: string;
    fromplantation?: string;
  }>();
  const { data, submittedForms, setData,resetData } = useFormStore();
    const [error, setError] = useState(false);
const {user} = useUserStore();
  const [form, setForm] = useState(
    data.basicDetails || {
      name: "",//cd
      age: "",
      // form_id:"",//for post fund
      mobile: "",
      district: "",
      hamlet: "",
      panchayat: "",
      block: "",
      idCardType: "Aadhar",//cd
      idCardNumber: "",//cd
      othercard:"", //no
      gender: "",
      fatherSpouse: "",//cd
      householdType: "",//cd
      adults: "0",//no
      children: "0",//no
      occupation: { agriculture: "0", business: "0", other: "0" },//no
      specialCategory: "",//no
      specialCategoryNumber: "",//cd
      caste: "",
      measuredBy: "",
      houseOwnership: "",//cd
      houseType: "",//cd
      drinkingWater: [],//no
      potability: [],//no
      domesticWater: [],//no
      toiletAvailability: "",//cd
      toiletCondition: "",//cd
      education: "",//cd
      hhcombined:"",//cd
      occupationCombined:"",//cd
      drinkingWaterCombined:[],//cd
      potabilityCombined:[],//cd
      domesticWaterCombined:[],//cd 
      
      }
  );
  
  useEffect(() => {
    if(fromPreview == "true"){
        updateField("idCardType","Aadhar");
    }
  
  setData("user_id", user.id);
  if ((id && fromPreview === "true") || (id && fromsubmit === "true")) {
    const selected = submittedForms.find((form) => form.id === id);
    if (selected) {
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
  const updateNestedField = (parent: string, field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],[field]: value,
      },
    }));
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

  const hand =() =>{
    updateField("specialCategoryNumber",0);
    if(form.idCardType === "Other"){
      updateField("idCardType",form.othercard);
    }
  }

  // in which id the basics updated while from submitted text
  const handleNext = () => {
    updateField("idCardType",form.othercard);
    setData("basicDetails", form);

    if (fromPreview == "true" && returnTo ){
      console.log(returnTo);
      router.push({ pathname: returnTo, params: { id ,returnsubmit:returnsubmit,fromsubmit:fromsubmit ,fromPreview:fromPreview} });
    } 
    // for  from submit check here
    else if (fromsubmit && returnsubmit){
      router.push({ pathname: returnTo, params: { id ,returnsubmit:returnsubmit,fromsubmit:fromsubmit} });
    }
    else {
        if(fromland == "true"){
          
          router.push({pathname:"/prefd/landOwnership",params:{fromland:"true", frompond :"false",fromplantation:"false"}});
        }
        else if(frompond=="true"){
          router.push({pathname:"/prefd/landOwnership",params:{fromland:"false", frompond :"true",fromplantation:"false"}});
        }
        else if(fromplantation == "true"){
          router.push({pathname:"/prefd/landOwnership",params:{fromland:"false", frompond :"false",fromplantation:"true"}});
        }
    }
  };

  const renderCheckboxGroup = (
    // styles={styles.checkboxGroup},
    field: string,
    options: string[],
    isSingle: boolean = false
  ) =>
    
    options.map((item) => (
      
      <Checkbox.Item
        key={item}
        // style={styles.checkboxOption}
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


  return (
    <KeyboardAwareScrollView style={styles.container}>
    <ScrollView contentContainerStyle={styles.inner}>
 <Animatable.View animation="fadeInUp" duration={600}> 
  <Text style={styles.heading_land}>
  {fromland === "true"
    ? "LAND REDEVELOPMENT FORM"
    : frompond === "true"
    ? "POND REDEVELOPMENT FORM"
    : fromplantation === "true"
    ? "PLANTATION REDEVELOPMENT FORM"
    : "Form"}
</Text>
    <View style={styles.headingContainer}>
                           {/* <IconButton icon="arrow-left" size={24} onPress={() => router.back()} /> */}
                         <TouchableOpacity onPress={() => router.back()}>
                          <Ionicons name="arrow-back" size={width * .06} color="#0B8B42" />
                        </TouchableOpacity>
                        <Text style={styles.heading}>Basic Details</Text>
                      </View>
<View style={{ marginVertical: 10 }}>
  <Text style={styles.label}>1. Name of Farmer</Text>
  <TextInput
    placeholder="Enter Name"
    placeholderTextColor="#888"
    value={form.name}
    onChangeText={(text) => {
      updateField("name", text);
    }}
    style={styles.input}
  />

  {/* Error messages */}
  {(() => {
    const value = form.name;
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


 <Text style={styles.label}>2. Age</Text>
<TextInput
  value={form.age}
  placeholder='Enter Age'
  onChangeText={(text) => {
    // Allow only numbers
    const filteredText = text.replace(/[^0-9]/g, '');
    updateField("age", filteredText);
  }}
  style={[
    styles.input,
    form.age !== '' && parseInt(form.age) > 130 && {
      borderColor: 'red',
      borderWidth: 1,
    },
  ]}
  keyboardType="numeric"
/>
{form.age !== '' && parseInt(form.age) > 130 && (
  <Text style={{ color: 'red', fontSize: 12 }}>
    Invalid: age cannot exceed 130
  </Text>
)}

        <Text style={styles.label}>3. Mobile Number</Text>
<TextInput
  value={form.mobile}
  placeholder='Enter Mobile Number'
  placeholderTextColor="#888"
  onChangeText={(text) => {
    updateField("mobile", text); // don't modify the text
  }}
  style={[
    styles.input,
    form.mobile.length > 0 &&
      (!/^\d{10}$/.test(form.mobile)) && { borderColor: 'red', borderWidth: 1 }
  ]}
  keyboardType="numeric"
/>

{form.mobile.length > 0 && !/^\d{10}$/.test(form.mobile) && (
  <Text style={{ color: 'red', fontSize: 12 }}>
    Mobile number must be exactly 10 digits
  </Text>
)}


     <Text style={styles.label}>4. District</Text>
<TextInput
  value={form.district}
  placeholder="Enter District"
  placeholderTextColor="#888"
  onChangeText={(text) => {
    updateField("district", text); // don't replace, keep what they type
  }}
  style={[
    styles.input,
    form.district.length > 0 && !/^[A-Za-z\s]+$/.test(form.district) && {
      borderColor: 'red',
      borderWidth: 1
    }
  ]}
/>

{form.district.length > 0 && !/^[A-Za-z\s]+$/.test(form.district) && (
  <Text style={{ color: 'red', fontSize: 12 }}>
    Invalid: only letters allowed
  </Text>
)}

       <Text style={styles.label}>5. Block</Text>
<TextInput
  value={form.block}
  placeholder="Enter Block"
  placeholderTextColor="#888"
  onChangeText={(text) => {
    updateField("block", text); // don't filter text
  }}
  style={[
    styles.input,
    form.block.length > 0 && !/^[A-Za-z\s]+$/.test(form.block) && {
      borderColor: 'red',
      borderWidth: 1
    }
  ]}
/>

{form.block.length > 0 && !/^[A-Za-z\s]+$/.test(form.block) && (
  <Text style={{ color: 'red', fontSize: 12 }}>
    Invalid: only letters allowed
  </Text>
)}

      <Text style={styles.label}>6. Panchayat</Text>
<TextInput
  value={form.panchayat}
  placeholder="Enter Panchayat"
  placeholderTextColor="#888"
  onChangeText={(text) => {
    updateField("panchayat", text); // keep original text, don't replace
  }}
  style={[
    styles.input,
    form.panchayat.length > 0 && !/^[A-Za-z\s]+$/.test(form.panchayat) && {
      borderColor: 'red',
      borderWidth: 1
    }
  ]}
/>

{form.panchayat.length > 0 && !/^[A-Za-z\s]+$/.test(form.panchayat) && (
  <Text style={{ color: 'red', fontSize: 12 }}>
    Invalid: only letters allowed
  </Text>
)}


     <Text style={styles.label}>7. Hamlet</Text>
<TextInput
  value={form.hamlet}
  placeholder="Enter Hamlet"
  placeholderTextColor="#888"
  onChangeText={(text) => {
    updateField("hamlet", text); // don't filter, keep what user typed
  }}
  style={[
    styles.input,
    form.hamlet.length > 0 && !/^[A-Za-z\s]+$/.test(form.hamlet) && {
      borderColor: 'red',
      borderWidth: 1
    }
  ]}
/>

{form.hamlet.length > 0 && !/^[A-Za-z\s]+$/.test(form.hamlet) && (
  <Text style={{ color: 'red', fontSize: 12 }}>
    Invalid: only letters allowed
  </Text>
)}


<Text style={styles.question}>8. Aadhar Card Number:</Text>
<TextInput
  value={form.idCardNumber}
  placeholder="011234567890"
  placeholderTextColor="#888"
  onChangeText={(text) => {
    updateField("idCardNumber", text); // keep user input
  }}
  keyboardType="numeric"
  style={[
    styles.input,
    form.idCardNumber.length > 0 && !/^\d{12}$/.test(form.idCardNumber) && {
      borderColor: 'red',
      borderWidth: 1
    }
  ]}
/>

{form.idCardNumber.length > 0 && !/^\d{12}$/.test(form.idCardNumber) && (
  <Text style={{ color: 'red', fontSize: 12 }}>
    Invalid: must be exactly 12 digits
  </Text>
)}


<Text style={styles.question}>9. Gender:</Text>
{/* <View  style={styles.radioGroup}> */}
  <RadioButton.Group
  onValueChange={(value) => updateField("gender", value)}
  value={form.gender}
>
  <RadioButton.Item    label="Male" value="Male" />
  <RadioButton.Item    label="Female" value="Female" />
  <RadioButton.Item   label="Transgender" value="Transgender" />
</RadioButton.Group>
{/* </View> */}

<Text style={styles.question}>10. Father / Spouse Name:</Text>
<TextInput
  value={form.fatherSpouse}
  placeholder=" Father / Spouse Name"
  placeholderTextColor="#888"
  onChangeText={(text) => {
    updateField("fatherSpouse", text); // keep original text
  }}
  style={[
    styles.input,
    form.fatherSpouse.length > 0 &&
      !/^[A-Za-z\s]+$/.test(form.fatherSpouse) && {
        borderColor: 'red',
        borderWidth: 1
      }
  ]}
/>

{form.fatherSpouse.length > 0 &&
  !/^[A-Za-z\s]+$/.test(form.fatherSpouse) && (
    <Text style={{ color: 'red', fontSize: 12 }}>
      Invalid: only letters allowed
    </Text>
)}


<Text style={styles.question}>11. Type of Household:</Text>
<RadioButton.Group
  onValueChange={(value) => updateField("householdType", value)}
  value={form.householdType}
>
  <RadioButton.Item label="Nuclear" value="Nuclear" />
  <RadioButton.Item label="Joint" value="Joint" />
</RadioButton.Group>

   <Text style={styles.label}>12. Household Members</Text>
<View style={styles.row}>
  {/* Adults */}
  <View style={styles.inputHalfWrapper}>
    <Text style={styles.subLabel}>Adults</Text>
    <TextInput
      style={[
        styles.inputHalf,
        form.adults !== '' && parseInt(form.adults) > 50 && {
          borderColor: 'red',
          borderWidth: 1
        }
      ]}
      value={String(form.adults)}
      onChangeText={(text) => {
        // Remove anything except digits
        let filteredText = text.replace(/[.,]/g, '').replace(/[^0-9]/g, '');
        updateField("adults", filteredText);

        // Update combined value
        const hhcombined = `${filteredText},${form.children}`;
        updateField("hhcombined", hhcombined);
      }}
      keyboardType="numeric"
      placeholder="0"
      placeholderTextColor="#888"
    />
    {form.adults !== '' && parseInt(form.adults) > 50 && (
      <Text style={{ color: 'red', fontSize: 12 }}>
        Invalid: must be 50 or less
      </Text>
    )}
  </View>

  {/* Children */}
  <View style={styles.inputHalfWrapper}>
    <Text style={styles.subLabel}>Children</Text>
    <TextInput
      style={[
        styles.inputHalf,
        form.children !== '' && parseInt(form.children) > 50 && {
          borderColor: 'red',
          borderWidth: 1
        }
      ]}
      value={String(form.children)}
      onChangeText={(text) => {
        // Remove anything except digits
        let filteredText = text.replace(/[.,]/g, '').replace(/[^0-9]/g, '');
        updateField("children", filteredText);

        // Update combined value
        const hhcombined = `${form.adults},${filteredText}`;
        updateField("hhcombined", hhcombined);
      }}
      keyboardType="numeric"
      placeholder="0"
      placeholderTextColor="#888"
    />
    {form.children !== '' && parseInt(form.children) > 50 && (
      <Text style={{ color: 'red', fontSize: 12 }}>
        Invalid: must be 50 or less
      </Text>
    )}
  </View>
</View>

<Text style={styles.question}>
  13. Occupation of Household Members (No. of persons):
</Text>
<View style={styles.irrigationRow}>
  {/* Agriculture */}
  <View style={styles.inputIrrigationWrapper}>
    <Text style={styles.subLabel}>Agriculture</Text>
    <TextInput
      value={String(form.occupation.agriculture)}
      onChangeText={(text) => {
        let filteredText = text.replace(/[.,]/g, '').replace(/[^0-9]/g, '');
        updateNestedField("occupation", "agriculture", filteredText);

        const occupationCombined = `${filteredText},${form.occupation.business},${form.occupation.other}`;
        updateField("occupationCombined", occupationCombined);
      }}
      style={[
        styles.input,
        form.occupation.agriculture !== '' &&
          parseInt(form.occupation.agriculture) > 50 && {
            borderColor: 'red',
            borderWidth: 1
          }
      ]}
      placeholderTextColor="#888"
      placeholder="0"
      keyboardType="numeric"
    />
  </View>

  {/* Business */}
  <View style={styles.inputIrrigationWrapper}>
    <Text style={styles.subLabel}>Business</Text>
    <TextInput
      value={String(form.occupation.business)}
      onChangeText={(text) => {
        let filteredText = text.replace(/[.,]/g, '').replace(/[^0-9]/g, '');
        updateNestedField("occupation", "business", filteredText);

        const occupationCombined = `${form.occupation.agriculture},${filteredText},${form.occupation.other}`;
        updateField("occupationCombined", occupationCombined);
      }}
      style={[
        styles.input,
        form.occupation.business !== '' &&
          parseInt(form.occupation.business) > 50 && {
            borderColor: 'red',
            borderWidth: 1
          }
      ]}
      placeholderTextColor="#888"
      placeholder="0"
      keyboardType="numeric"
    />
  </View>

  {/* Other */}
  <View style={styles.inputIrrigationWrapper}>
    <Text style={styles.subLabel}>Others</Text>
    <TextInput
      value={String(form.occupation.other)}
      onChangeText={(text) => {
        let filteredText = text.replace(/[.,]/g, '').replace(/[^0-9]/g, '');
        updateNestedField("occupation", "other", filteredText);

        const occupationCombined = `${form.occupation.agriculture},${form.occupation.business},${filteredText}`;
        updateField("occupationCombined", occupationCombined);
      }}
      placeholderTextColor="#888"
      style={[
        styles.input,
        form.occupation.other !== '' &&
          parseInt(form.occupation.other) > 50 && {
            borderColor: 'red',
            borderWidth: 1
          }
      ]}
      placeholder="0"
      keyboardType="numeric"
    />
  </View>
</View>

{/* Validation messages */}
{(parseInt(form.occupation.agriculture || 0) > 50 ||
  parseInt(form.occupation.business || 0) > 50 ||
  parseInt(form.occupation.other || 0) > 50) && (
  <Text style={{ color: 'red', fontSize: 12 }}>
    Each occupation count must be 50 or less
  </Text>
)}

{(parseInt(form.occupation.agriculture || 0) +
  parseInt(form.occupation.business || 0) +
  parseInt(form.occupation.other || 0)) > parseInt(form.adults || 0) && (
  <Text style={{ color: 'red', fontSize: 12 }}>
    Total occupation members cannot exceed total adults
  </Text>
)}

<Text style={styles.question}>14. Special Category:</Text>
<Checkbox.Item
  label="Disabled"
  status={form.specialCategory ? "checked" : "unchecked"}
  onPress={() => {
    updateField("specialCategory", !form.specialCategory);
    updateField("specialCategoryNumber", "");
  }}
/>

{form.specialCategory && (
  <>
    <Text style={styles.question}>No of Persons Disabled</Text>
    <TextInput
      value={form.specialCategoryNumber}
      onChangeText={(text) => {
        let filteredText = text.replace(/[^0-9]/g, '');
        updateField("specialCategoryNumber", filteredText);
      }}
      style={[
        styles.input,
        form.specialCategoryNumber !== '' &&
          (parseInt(form.specialCategoryNumber) > 50 ||
            parseInt(form.specialCategoryNumber) >
              (parseInt(form.adults || 0) + parseInt(form.children || 0))) && {
          borderColor: 'red',
          borderWidth: 1,
        },
      ]}
      placeholder="Number of Disabled Persons"
      keyboardType="numeric"
    />

    {/* Over 50 check */}
    {form.specialCategoryNumber !== '' &&
      parseInt(form.specialCategoryNumber) > 50 && (
        <Text style={{ color: 'red', fontSize: 12 }}>
          Number of disabled persons cannot exceed 50
        </Text>
      )}

    {/* Disabled > adults + children check */}
    {form.specialCategoryNumber !== '' &&
      parseInt(form.specialCategoryNumber) >
        (parseInt(form.adults || 0) + parseInt(form.children || 0)) && (
        <Text style={{ color: 'red', fontSize: 12 }}>
          Disabled persons cannot exceed total household members
        </Text>
      )}
  </>
)}


<Text style={styles.question}>15. Caste:</Text>
<RadioButton.Group
  onValueChange={(value) => updateField("caste", value)}
  value={form.caste}
>
  <RadioButton.Item label="OC" value="OC" />
  <RadioButton.Item label="OBC" value="OBC" />
  <RadioButton.Item label="SC" value="SC" />
  <RadioButton.Item label="ST" value="ST" />
</RadioButton.Group>


<Text style={styles.question}>16. House Ownership:</Text>
<RadioButton.Group
  onValueChange={(value) => updateField("houseOwnership", value)}
  value={form.houseOwnership}
>
  <RadioButton.Item label="Rented" value="Rented" />
  <RadioButton.Item label="Owned" value="Owned" />
</RadioButton.Group>

<Text style={styles.question}>17. Type of House:</Text>
<RadioButton.Group
  onValueChange={(value) => updateField("houseType", value)}
  value={form.houseType}
>
  <RadioButton.Item label="Pucca" value="pucca" />
  <RadioButton.Item label="Kutcha" value="kutcha" />
</RadioButton.Group>

      <Text style={styles.question}>18. Drinking Water Source:</Text>
      {renderCheckboxGroup("drinkingWaterCombined", ["Ponds", "Well & Borewells", "Trucks"])}

      <Text style={styles.question}>19. Potability:</Text>
      {renderCheckboxGroup("potabilityCombined", ["Ponds", "Tanks", "Well & Borewells"])}

      <Text style={styles.question}>20. Domestic Water Source:</Text>
      {renderCheckboxGroup("domesticWaterCombined", ["Ponds", "Tanks", "Well & Borewells"])}

      <Text style={styles.question}>21. Toilet Availability:</Text>
<RadioButton.Group
  onValueChange={(value) => {updateField("toiletAvailability", value)
    if(value != "Yes"){
      updateField("toiletCondition", "No")
    }
    else{
       updateField("toiletCondition", "")
    }
  }}
  value={form.toiletAvailability}
>
  <RadioButton.Item label="Yes" value="Yes" />
  <RadioButton.Item label="No" value="No" />
</RadioButton.Group>
      
<Text style={styles.question}>22. Toilet Condition:</Text>
<RadioButton.Group
  onValueChange={(value) => updateField("toiletCondition", value)}
  value={form.toiletCondition}
>
  <RadioButton.Item label="Working" value="Yes" />
  <RadioButton.Item label="Not Working" value="No" />
</RadioButton.Group>
      <Text style={styles.question}>23. Education of Householder:</Text>
<RadioButton.Group
  onValueChange={(value) => updateField("education", value)}
  value={form.education}
>
  <RadioButton.Item label="Illiterate" value="Illiterate" />
  <RadioButton.Item label="Primary" value="Primary" />
  <RadioButton.Item label="Secondary" value="Secondary" />
  <RadioButton.Item label="University" value="University" />
</RadioButton.Group>

  <TouchableOpacity style={styles.nextBtn}
                          onPress={() => handleNext()}>

              <Text style={styles.nextBtnText}> {fromPreview ? "Preview" : "Next"}</Text>
              
            </TouchableOpacity>
</Animatable.View>
    </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#F1F7ED',
    },
    inner: {
      padding: width * 0.05, 
      paddingBottom: height * 0.03,
    },
    heading_land: {
      fontSize: width * 0.06,
      fontWeight: 'bold',
      color: '#0B8B42',
      marginBottom: height * 0.02,
      textAlign: 'center',
    },
    headingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: height * 0.02,
    },
    heading: {
      fontSize: width * 0.05,
      fontWeight: 'bold',
      color: '#0B8B42',
      marginBottom: height * 0.005,
    },
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
    fontSize: width * 0.035,
      marginVertical: height * 0.01,
      color: '#333',
      fontWeight: '600',
  },
   checkboxGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    checkboxOption: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: width * 0.04,
      marginBottom: height * 0.01,
    },
  label: {
      fontSize: width * 0.035,
      marginVertical: height * 0.01,
      color: '#333',
      fontWeight: '600',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: width * 0.025,
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
    },
  button: {
    marginTop: 30,
  },
   
    inputHalf: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#A5D6A7',
      borderRadius: width * 0.025,
      paddingHorizontal: width * 0.035,
      paddingVertical: height * 0.015,
      backgroundColor: '#E8F5E9',
      color: '#333',
      fontSize: width * 0.035,
      marginRight: width * 0.025,
    },
  
    radioGroup: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: height * 0.01,
    },
    radioOption: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: width * 0.04,
      marginBottom: height * 0.01,
    },
    radioText: {
      marginLeft: width * 0.02,
      fontSize: width * 0.035,
      color: '#333',
    },
   
    nextBtn: {
      backgroundColor: '#134e13',
      paddingVertical: height * 0.018,
      borderRadius: width * 0.025,
      alignItems: 'center',
      marginTop: height * 0.03,
    },
    nextBtnText: {
      color: '#fff',
      fontSize: width * 0.04,
      fontWeight: '600',
    },
    dropdown: {
      borderColor: '#A5D6A7',
      borderRadius: width * 0.025,
      marginBottom: height * 0.015,
      backgroundColor: '#E8F5E9',
    },
    dropdownContainer: {
      borderColor: '#A5D6A7',
      backgroundColor: '#E8F5E9',
      borderRadius: width * 0.025,
    },
    irrigationRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: height * 0.015,
    },
    irrigationInput: {
      flex: 1,
      marginRight: width * 0.02,
    },
    subLabel: {
      fontSize: width * 0.033,  // ~13px on typical 390px width
      color: '#555',
      marginBottom: height * 0.005,
      fontWeight: '500',
    },
    
    inputHalfWrapper: {
      flex: 1,
      marginRight: width * 0.02,
    },
    
    inputIrrigationWrapper: {
      flex: 1,
      marginHorizontal: width * 0.01,
    },
    
});