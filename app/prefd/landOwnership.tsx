import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { BackHandler, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Checkbox, IconButton, RadioButton } from "react-native-paper";
import { useFormStore } from "../../storage/useFormStore";
 const { width, height } = Dimensions.get('window');
export default function LandOwnership() {
  const router = useRouter();
 const { id, fromPreview,returnTo,fromsubmit,returnsubmit,fromland,fromplantation,frompond } = useLocalSearchParams<{ id?: string; fromPreview?: string }>();
   const { data, submittedForms, setData } = useFormStore();

  const [form, setForm] = useState(
    data.landOwnership || {
      landOwnershipType: "",//cd
      hasWell: "",//cd
      areaIrrigated: "0",//cd
      irrigatedLand:{//no
        rainfed: "0",//no
        tankfed: "0",//no
        wellIrrigated: "0",//no
      },
      pattaNumber: "",//cd
      totalArea: "",//cd
      taluk:"",
      firka:"",
      revenueVillage: "",//cd
      cropSeason: "",//no
      cropSeasonOther: "",//no
      livestock: {//no
        goat:"0",
        sheep:"0",
        milchAnimals:"0",
        draught_animals:"0",
        poultry:"0",
        others:"0",
      },//no
      irrigatedLandCombined:"",//cd
      cropSeasonCombined: "",//cd
      livestockCombined:"",//cd
    }
  );
      useEffect(() => {
          if (data.landOwnership && data.landOwnership.irrigatedLand) {
    calculateTotalArea(
      data.landOwnership.irrigatedLand.rainfed,
      data.landOwnership.irrigatedLand.tankfed,
      data.landOwnership.irrigatedLand.wellIrrigated
    );
  }
        // calculateTotalArea(data.landOwnership.irrigatedLand.rainfed, data.landOwnership.irrigatedLand.tankfed,data.landOwnership.irrigatedLand.wellIrrigated);
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
  
  const updateNestedField = (parent: string, field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };
const calculateTotalArea = (rainfed, tankfed, well) => {
 const r = parseFloat(rainfed ?? "0");
  const t = parseFloat(tankfed ?? "0");
  const w = parseFloat(well ?? "0");
  const total = (r + t + w).toFixed(2); // Rounded to 2 decimal places
  updateField("totalArea", total.toString());
};

  const toggleCheckbox = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item: string) => item !== value)
        : [...prev[field], value],
    }));
  };
  
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
    console.log(form.livestockCombined+" - "+form.irrigatedLandCombined+" - "+form.cropSeasonCombined);
    setData("landOwnership", form);
    if (fromPreview == "true"&& returnTo) {
     
      router.push({ pathname: returnTo, params: { id,returnsubmit:returnsubmit,fromsubmit:fromsubmit} });
    } 
     else if (fromsubmit && returnsubmit){
      router.push({ pathname: returnTo, params: { id ,returnsubmit:returnsubmit,fromsubmit:fromsubmit} });
    }
    else {
      if(fromland == "true"){
        router.push({pathname:"/landform/landDevelopment",params:{fromland:"true", frompond :"false",fromplantation:"false"}});
      }
      else if(frompond== "true"){
        router.push({pathname:"/pondform/landDevelopment",params:{fromland:"false", frompond :"true",fromplantation:"false"}});
      }
      else if(fromplantation == "true"){
        router.push({pathname:"/plantationform/landDevelopment",params:{fromland:"false", frompond :"false",fromplantation:"true"}});
      }
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
    ? "POND REDEVELOPMENT FORM"
    : fromplantation === "true"
    ? "PLANTATION REDEVELOPMENT FORM"
    : "Form"}
</Text>
<View style={styles.headingContainer}>
      <IconButton icon="arrow-left" size={width * .06} onPress={() => router.back()} />
      <Text style={styles.heading}>Land Ownership & Livestock</Text>
</View>
      <Text style={styles.question}>24. Land Ownership:</Text>
<RadioButton.Group
  onValueChange={(value) => {updateField("landOwnershipType", value)
  
  }}
  value={form.landOwnershipType}
>
  <RadioButton.Item label="Owner Cultivator" value="Owner Cultivator" />
  <RadioButton.Item label="Lease Holder" value="Lease Holder" />
</RadioButton.Group>


<Text style={styles.question}>25. Well for Irrigation:</Text>
<RadioButton.Group
  onValueChange={(value) => {updateField("hasWell", value)
    updateField("areaIrrigated", "0")
  }}
  value={form.hasWell}
>
  <RadioButton.Item label="Yes" value="Yes" />
  <RadioButton.Item label="No" value="No" />
</RadioButton.Group>


      {form.hasWell === "Yes" && (
        <>
          <Text style={styles.question}>No of Wells:</Text>
          <TextInput
            value={form.areaIrrigated}
            onChangeText={(text) => updateField("areaIrrigated", text)}
            style={styles.input}
            keyboardType="numeric"
          />
        </>
      )}

     <Text style={styles.label}>26. Patta Number</Text>
<TextInput
  placeholder="Enter patta number"
  placeholderTextColor="#888"
  value={form.pattaNumber}
  onChangeText={(text) => {
    const filteredText = text.replace(/[^0-9]/g, ''); // keep only numbers
    updateField("pattaNumber", filteredText);
  }}
  style={styles.input}
  keyboardType="numeric"
/>

<Text style={styles.label}>27. Irrigated Lands (ha)</Text>
<View style={styles.row}>
  <View style={styles.inputHalfWrapper}>
    <Text style={styles.subLabel}>Rainfed:</Text>
    <TextInput
      placeholder="0"
      placeholderTextColor="#888"
      value={String(form.irrigatedLand.rainfed)}
      onChangeText={(text) => {
        let filteredText = text.replace(/,/g, ''); // remove commas
        filteredText = filteredText.replace(/[^0-9.]/g, ''); // allow only numbers and .
        filteredText = filteredText.replace(/(\..*)\./g, '$1'); // prevent multiple dots
        updateNestedField("irrigatedLand", "rainfed", filteredText);
        calculateTotalArea(filteredText, form.irrigatedLand.tankfed, form.irrigatedLand.wellIrrigated);
        const Irrigatedcombined = `${filteredText},${form.irrigatedLand.tankfed},${form.irrigatedLand.wellIrrigated}`;
        updateField("irrigatedLandCombined", Irrigatedcombined);
      }}
      style={styles.input}
      keyboardType="numeric"
    />
  </View>

  <View style={styles.inputHalfWrapper}>
    <Text style={styles.subLabel}>Tankfed:</Text>
    <TextInput
      placeholderTextColor="#888"
      placeholder="0"
      value={String(form.irrigatedLand.tankfed)}
      onChangeText={(text) => {
        let filteredText = text.replace(/,/g, '');
        filteredText = filteredText.replace(/[^0-9.]/g, '');
        filteredText = filteredText.replace(/(\..*)\./g, '$1');
        updateNestedField("irrigatedLand", "tankfed", filteredText);
        calculateTotalArea(form.irrigatedLand.rainfed, filteredText, form.irrigatedLand.wellIrrigated);
        const Irrigatedcombined = `${form.irrigatedLand.rainfed},${filteredText},${form.irrigatedLand.wellIrrigated}`;
        updateField("irrigatedLandCombined", Irrigatedcombined);
      }}
      style={styles.input}
      keyboardType="numeric"
    />
  </View>

  <View style={styles.inputHalfWrapper}>
    <Text style={styles.subLabel}>Well Irrigated:</Text>
    <TextInput
      placeholder="0"
      placeholderTextColor="#888"
      value={String(form.irrigatedLand.wellIrrigated)}
      onChangeText={(text) => {
        let filteredText = text.replace(/,/g, '');
        filteredText = filteredText.replace(/[^0-9.]/g, '');
        filteredText = filteredText.replace(/(\..*)\./g, '$1');
        updateNestedField("irrigatedLand", "wellIrrigated", filteredText);
        calculateTotalArea(form.irrigatedLand.rainfed, form.irrigatedLand.tankfed, filteredText);
        const Irrigatedcombined = `${form.irrigatedLand.rainfed},${form.irrigatedLand.tankfed},${filteredText}`;
        updateField("irrigatedLandCombined", Irrigatedcombined);
      }}
      style={styles.input}
      keyboardType="numeric"
    />
  </View>
</View>

    
 <Text style={styles.label}>28. Total Area (ha)</Text>
<TextInput
  value={form.totalArea}
  editable={false}
   placeholder="0"
  placeholderTextColor="#888"
  style={styles.input}
  keyboardType="numeric"
/>
 
<Text style={styles.label}>29. Taluk</Text>
<View style={{ zIndex: 1000, marginBottom: 10 }}>
  <TextInput
    value={form.taluk}
    placeholder="Enter Taluk"
    placeholderTextColor="#888"
    onChangeText={(text) => updateField("taluk", text)} // no replacement
    style={[
      styles.input,
      form.taluk.length > 0 && !/^[A-Za-z\s]+$/.test(form.taluk) && {
        borderColor: 'red',
        borderWidth: 1,
      },
    ]}
    autoCapitalize="words"
  />

  {form.taluk.length > 0 && !/^[A-Za-z\s]+$/.test(form.taluk) && (
    <Text style={styles.errorText}>
      Invalid: only letters allowed
    </Text>
  )}
</View>
<View style={{ marginVertical: 10 }}>
  <Text style={styles.label}>30. Firka</Text>
  <TextInput
    value={form.firka}
    placeholder="Enter Firka"
    placeholderTextColor="#888"
    onChangeText={(text) => {
      updateField("firka", text);
    }}
    style={styles.input}
  />
  
  {form.firka !== "" && !/^[A-Za-z\s]+$/.test(form.firka) && (
    <Text style={styles.errorText}>Invalid: only letters and spaces allowed</Text>
  )}
</View>

   <Text style={styles.label}>31. Revenue Village</Text>
<View style={{ zIndex: 1000, marginBottom: 10 }}>
  <TextInput
    value={form.revenueVillage}
    placeholder="Enter revenue village"
    placeholderTextColor="#888"
    onChangeText={(text) => updateField("revenueVillage", text)} // no replace
    style={[
      styles.input,
      form.revenueVillage.length > 0 && !/^[A-Za-z\s]+$/.test(form.revenueVillage) && {
        borderColor: 'red',
        borderWidth: 1,
      },
    ]}
    autoCapitalize="words"
  />

  {form.revenueVillage.length > 0 && !/^[A-Za-z\s]+$/.test(form.revenueVillage) && (
    <Text style={styles.errorText}>
      Invalid: only letters allowed
    </Text>
  )}
</View>


<Text style={styles.question}>32. Crop Season (Choose all that apply):</Text>
{["Kharif", "Rabi", "Other"].map((season) => (
  <Checkbox.Item
    key={season}
    label={season}
    status={form.cropSeasonCombined?.includes(season) ? "checked" : "unchecked"}
    onPress={() => {
      const newSelection = form.cropSeason?.includes(season)
        ? form.cropSeason.filter((s: string) => s !== season)
        : [...(form.cropSeason || []), season];
      updateField("cropSeason", newSelection);
      updateField("cropSeasonCombined", newSelection.join(", "));
    }}
  />
))}

{form.cropSeason?.includes("Other") && (
  <TextInput
    placeholder="Enter Crop Season"
    value={form.cropSeasonOther}
    onChangeText={(text) => {
      updateField("cropSeasonOther", text);
      const updated = [...form.cropSeason.filter((s: string) => s !== "Other"), text];
      updateField("cropSeasonCombined", updated.join(", "));
    }}
    style={styles.input}
  />
)}


  <Text style={styles.label}>33. Livestock at Home</Text>
<View style={styles.row}>
  <View style={styles.inputHalfWrapper}>
      <Text style={styles.subLabel}>Goat</Text>
<TextInput
  placeholder="0"
  value={String(form.livestock.goat)}
  onChangeText={(text) => {updateNestedField("livestock","goat",text)
    
    const goat = form.livestock.goat ||"0";
    const livestockCombinedField = `${goat},${form.livestock.sheep},${form.livestock.milchAnimals},${form.livestock.draught_animals},${form.livestock.poultry},${form.livestock.others}`;
    updateField("livestockCombined",livestockCombinedField);

  }}
  keyboardType="numeric" 
  style={styles.input}
/>
</View>
 <View style={styles.inputHalfWrapper}>
    <Text style={styles.subLabel}>Sheep</Text>
<TextInput
  placeholder="0"
  value={String(form.livestock.sheep)}
  onChangeText={(text) => {updateNestedField("livestock","sheep",text)
    const sheep = form.livestock.sheep ||"0";
    const livestockCombinedField = `${form.livestock.goat},${sheep},${form.livestock.milchAnimals},${form.livestock.draught_animals},${form.livestock.poultry},${form.livestock.others}`;
    updateField("livestockCombined",livestockCombinedField);

  }}
  keyboardType="numeric"
  style={styles.input}
/>
</View>
<View style={styles.inputHalfWrapper}>
    <Text style={styles.subLabel}>Milch Animals</Text>
<TextInput
  placeholder="0"
  value={String(form.livestock.milchAnimals)}
  onChangeText={(text) => {updateNestedField("livestock","milchAnimals",text)
    const milchAnimals = form.livestock.milchAnimals ||"0";
    const livestockCombinedField = `${form.livestock.goat},${form.livestock.sheep},${milchAnimals},${form.livestock.draught_animals},${form.livestock.poultry},${form.livestock.others}`;
    updateField("livestockCombined",livestockCombinedField);

  }}
  keyboardType="numeric"
  style={styles.input}
/>
</View>
</View>

<View style={styles.row}>
   <View style={styles.inputHalfWrapper}>
      <Text style={styles.subLabel}>Draught Animals</Text>
<TextInput
  placeholder="0"
  value={String(form.livestock.draught_animals)}
  onChangeText={(text) => {updateNestedField("livestock","draught_animals",text)
    const draught_animals= form.livestock.draught_animals ||"0";
    const livestockCombinedField = `${form.livestock.goat},${form.livestock.sheep},${form.livestock.milchAnimals},${draught_animals},${form.livestock.poultry},${form.livestock.others}`;
    updateField("livestockCombined",livestockCombinedField);
  }}
  keyboardType="numeric"
  style={styles.input}
/>
</View>
 <View style={styles.inputHalfWrapper}>
    <Text style={styles.subLabel}>Poultry</Text>
<TextInput
  placeholder="0"
  value={String(form.livestock.poultry)}
  onChangeText={(text) => {updateNestedField("livestock","poultry",text)
    const poultry= form.livestock.poultry ||"0";
    const livestockCombinedField = `${form.livestock.goat},${form.livestock.sheep},${form.livestock.milchAnimals},${form.livestock.draught_animals},${poultry},${form.livestock.others}`;
    updateField("livestockCombined",livestockCombinedField);
  }}
  keyboardType="numeric"
  style={styles.input}
/>
</View>
 <View style={styles.inputHalfWrapper}>
    <Text style={styles.subLabel}>Others</Text>
<TextInput
  placeholder="0"
  value={String(form.livestock.others)}
  onChangeText={(text) => {updateNestedField("livestock","others",text)
    const others= form.livestock.others ||"0";
    const livestockCombinedField = `${form.livestock.goat},${form.livestock.sheep},${form.livestock.milchAnimals},${form.livestock.draught_animals},${form.livestock.poultry},${others}`;
    updateField("livestockCombined",livestockCombinedField);
  }}
  keyboardType="numeric"
  style={styles.input}
/>
</View>
</View>
  <TouchableOpacity
            style={styles.nextBtn}
           onPress={() =>handleNext() }>
            <Text style={styles.nextBtnText}>{fromPreview ? "Preview" : "Next"}</Text>
          </TouchableOpacity>
     {/* <Button mode="contained" onPress={handleNext} style={styles.button}>
     {fromPreview ? "Preview" : "Next"}
     </Button> */}
      </Animatable.View>
    </ScrollView>
    </KeyboardAwareScrollView>
  ); 
}

const styles = StyleSheet.create({
  // container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  subtitle: { fontSize: 18, fontWeight: "600", textAlign: "center", marginBottom: 20 },
  question: { fontWeight: "bold", marginTop: 10, marginBottom: 5 },
  // input: {
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  //   padding: 10,
  //   marginBottom: 10,
  //   borderRadius: 5,
  // },
  button: { marginTop: 20 },
   container: {
    flex: 1,
    backgroundColor: '#F1F7ED',
  },
  inner: {
    padding: width * 0.05,
    paddingBottom: height * 0.025,
  },
  heading_land: {
    fontSize: width * 0.055, // ~22 on 400px width
    fontWeight: 'bold',
    color: '#0B8B42',
    marginBottom: height * 0.025,
    textAlign: 'center',
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.025,
  },
  heading: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#0B8B42',
    marginLeft: width * 0.025,
  },
   errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 14
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
    marginBottom: height * 0.01,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: width * 0.04,
    marginBottom: height * 0.01,
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
  irrigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.015,
  },
  irrigationInput: {
    flex: 1,
    marginRight: width * 0.02,
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
  dropdown: {
    borderColor: '#A5D6A7',
    backgroundColor: '#E8F5E9',
    borderRadius: width * 0.025,
    minHeight: height * 0.06,
    paddingHorizontal: width * 0.025,
  },
  dropdownContainer: {
    borderColor: '#A5D6A7',
    backgroundColor: '#F1F7ED',
    borderRadius: width * 0.025,
  },


  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.015,
  },

  inputHalfWrapper: {
    flex: 1,
    marginHorizontal: width * 0.02,
  },

  subLabel: {
    fontSize: width * 0.033,
    color: '#555',
    marginBottom: height * 0.005,
    fontWeight: '500',
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
});
