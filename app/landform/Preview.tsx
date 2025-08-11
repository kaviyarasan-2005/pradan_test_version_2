import { useUserStore } from '@/storage/userDatastore';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import axios from "axios";
import { Buffer } from "buffer";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system"; // Import FileSystem
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Alert, BackHandler, Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Divider, Text } from "react-native-paper";
import { useDraftStore } from "../../storage/DraftStore";
import { useFormStore } from "../../storage/useFormStore";
const url = Constants.expoConfig.extra.API_URL;
const { width, height } = Dimensions.get('window');
const scaleFont = size => size * (width / 375);
export default function   Preview() {
  const router = useRouter();
  const { id,fromsubmit,returnsubmit,fromPreview,fromdraft,fromland,fromplantation,frompond} = useLocalSearchParams<{ id?: string , returnsubmit?: string,fromsubmit?: string, fromPreview?:string,fromdraft?:string;}>();
  const { data, submittedForms, resetData,setData, submitForm,setNestedData,set2NestedData } = useFormStore();//draftForms,
  const {drafts,saveDraft} = useDraftStore();
const isSubmittedPreview = !!id;
const {user} = useUserStore();
const selectedForm = React.useMemo(() => {
  if (fromsubmit) {

   
    return data; // Always use updated data when fromsubmit
  }

  // if (isSubmittedPreview && id || draftForms && id) {
    if (isSubmittedPreview && id ) {
    return submittedForms.find((form) => String(form.id) === id);
  }
  return data;
}, [id, fromsubmit, submittedForms, data]);

const canEdit = () => {
  if (!isSubmittedPreview) return true;
  const status = selectedForm?.basicDetails?.status;
  return  status ===1||status === 2|| status === 3;
};

  if (!selectedForm) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", color: "red" }}>Form not found!</Text>
      </View>
    );
  }

  const [submitting, setSubmitting] = React.useState(false);
  const generateDraftId = () => {
  const now = new Date();
  return `draft-${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${now
    .getHours()
    .toString()
    .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
    .getSeconds()
    .toString()
    .padStart(2, "0")}${now.getMilliseconds().toString().padStart(3, "0")}`;
};
  useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => {
          if (fromsubmit) {
      router.push(returnsubmit); // Go back to total submitted page
    } else {
      router.back(); // Go back normally
    }
          return true; 
        };
     const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backHandler.remove(); 
    
      }, [])
    );
useEffect(() => { 
  
setData("user_id",user.id);
  if(fromsubmit == "true" && fromPreview != "true"){
const occupationarray = data.basicDetails.occupationCombined.split(',');
if(data.basicDetails.specialCategoryNumber >0){
  setNestedData("basicDetails","specialCategory","Yes");
}
    set2NestedData("basicDetails","occupation","agriculture",occupationarray[0]);
    set2NestedData("basicDetails","occupation","business",occupationarray[1]);
    set2NestedData("basicDetails","occupation","other",occupationarray[2]);
const Householdarray = data.basicDetails.hhcombined.split(',');
    setNestedData("basicDetails","adults",Householdarray[0]);
    setNestedData("basicDetails","children",Householdarray[1]);
    const Irrigationarray = data.landOwnership.irrigatedLandCombined.split(',');
    set2NestedData("landOwnership","irrigatedLand","rainfed",Irrigationarray[0]);
    set2NestedData("landOwnership","irrigatedLand","tankfed",Irrigationarray[1]);
    set2NestedData("landOwnership","irrigatedLand","wellIrrigated",Irrigationarray[2]);
    const livestockarray = data.landOwnership.livestockCombined.split(',');
    set2NestedData("landOwnership","livestock","goat",livestockarray[0]);
    set2NestedData("landOwnership","livestock","sheep",livestockarray[1]);
    set2NestedData("landOwnership","livestock","milchAnimals",livestockarray[2]);
    set2NestedData("landOwnership","livestock","draught_animals",livestockarray[3]);
    set2NestedData("landOwnership","livestock","poultry",livestockarray[4]);
    set2NestedData("landOwnership","livestock","others",livestockarray[5]);
    // setData("basicDetails",data.basicDetails);
    // setData("bankDetails",data.bankDetails)
    // setData("landDevelopment",data.landDevelopment);
    // setData("landOwnership",data.landOwnership);
  }
  const draftId = generateDraftId();
  setData("draft_id", draftId);
  setData("formType", 1);
  console.log(selectedForm);
}, []);

const isFormComplete = React.useMemo(() => {
  if (!selectedForm) return false;

  const bd = selectedForm.basicDetails;
  const lo = selectedForm.landOwnership;
  const ld = selectedForm.landDevelopment;
  const bank = selectedForm.bankDetails;

  return (
    bd?.name &&
    bd?.age &&
    bd?.mobile &&
    bd?.district &&
    bd?.block &&
    bd?.panchayat &&
    bd?.hamlet &&
    bd?.idCardNumber &&
    bd?.gender &&
    bd?.fatherSpouse &&
    bd?.householdType &&
    bd?.adults !== undefined &&
    bd?.children !== undefined &&
    bd?.occupation &&
    bd?.specialCategory !== undefined &&
    bd?.specialCategoryNumber !== undefined &&
    bd?.caste &&
    bd?.houseOwnership &&
    bd?.houseType &&
    bd?.drinkingWaterCombined &&
    bd?.potabilityCombined &&
    bd?.domesticWaterCombined &&
    bd?.toiletAvailability &&
    bd?.toiletCondition &&
    bd?.education &&

    lo?.landOwnershipType &&
    lo?.hasWell !== undefined &&
    lo?.areaIrrigated !== undefined &&
    lo?.irrigatedLand &&
    lo?.pattaNumber &&
    lo?.totalArea &&
    lo?.taluk &&
    lo?.firka &&
    lo?.revenueVillage &&
    lo?.cropSeasonCombined &&
    lo?.livestock &&

    ld?.sfNumber &&
    ld?.latitude &&
    ld?.longitude &&
    ld?.soilTypeCombined &&
    ld?.landBenefit !== undefined &&
    ld?.date &&
    ld?.workType &&
    ld?.proposalArea !== undefined &&
    ld?.otherWorks !== undefined &&
    ld?.pradanContribution !== undefined &&
    ld?.farmerContribution !== undefined &&
    ld?.totalEstimate !== undefined &&

    bank?.accountHolderName &&
    bank?.accountNumber &&
    bank?.bankName &&
    bank?.branch &&
    bank?.ifscCode &&
    bank?.farmerAgreed !== undefined &&
    bank?.submittedFiles &&
    Object.keys(bank.submittedFiles).length > 0
  );
}, [selectedForm]);


const handleSubmit = async () => {

  if (submitting) return;

  try {
    setSubmitting(true);
  if (!id || isNaN(Number(id))) {
  // id is undefined, null, 0, or not a number → perform POST
const files = selectedForm.bankDetails?.submittedFiles;

for (const key of Object.keys(files)) {

   const file = files[key];
      const ext:string = file.name?.split('.').pop();

    const mimeMap:{[key: string]: string} = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
    };

    const mimeType = mimeMap[ext] || "application/octet-stream";

    const uploadURL = await axios.get(`${url}/api/files/getUploadurl`,{params: {fileName: file.name,}});
      const fileData = await FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const buffer = Buffer.from(fileData, 'base64');
  console.log("Buffer: data", buffer.BYTES_PER_ELEMENT);
  
    try {
      const response = await axios.put(uploadURL.data, buffer, {
        headers: {
          'Content-Type': mimeType,
        }
      });
   }
   catch (error) {
      console.error("Upload error:", error);
   }
}

  await new Promise((resolve) => setTimeout(resolve, 50));
  await axios.post(`${url}/api/formData/postLandformData`, data);

} else {

  // id exists and is a number → perform PUT
  await new Promise((resolve) => setTimeout(resolve, 50));
  await axios.put(`${url}/api/formData/updateLandformData`, data);
}
      if (fromdraft === "true") {

  if (data.id) {
    await useDraftStore.getState().deleteDraft(data.id);
  }
}

    Alert.alert("Success", "Form Successfully Submitted!", [
      {
        text: "OK",
        onPress: () => {
          resetData();
          router.push("/dashboard");
        },
      },
    ]);
  } catch (error) {
    Alert.alert("Error", "Failed to submit the form. Please try again.\n" + error);
  } finally {
    resetData();
    setSubmitting(false);
  }
};
  
  const renderSection = (title: string, fields: any[], editRoute: string) => (
    <Card style={styles.card}>
<Card.Title title={title} titleStyle={styles.sectionTitle} />
      <Card.Content>
        {fields.map((field, index) => {
  const nextField = fields[index + 1];
  const isNextSubLabel = nextField && nextField.subLabel && !nextField.label;

  return (
    <View key={index} style={styles.fieldContainer}>
      {/* Show label if exists */}
      {field.label && <Text style={styles.label}>{field.label}</Text>}

      {/* Show subLabel if exists */}
      {field.subLabel && <Text style={styles.subLabel}>{field.subLabel}</Text>}

      {/* Render value(s) */}
      {Array.isArray(field.value) ? (
        field.value.map((item, idx) => {
          if (typeof item === "object" && item?.label && item?.uri) {
            return (
              <View key={idx} style={styles.fileRow}>
                <Text style={styles.value}>{item.label}</Text>
                 {/* <Button
                        mode="text"
                        onPress={() =>
                          router.push({pathname: "/pdfViewer",params: { uri: item.uri },})
                        }
                        compact
                      >
                        View
                      </Button> */}
              </View>
            );
          } else if (typeof item === "object") {
            return (
              <Text key={idx} style={styles.value}>
                {JSON.stringify(item)}
              </Text>
            );
          } else {
            return (
              <Text key={idx} style={styles.value}>
                {item}
              </Text>
            );
          }
        })
      ) : typeof field.value === "object" && field.value !== null ? (
        Object.entries(field.value).map(([key, val], idx) => (
          <Text key={idx} style={styles.subLabel}>
  <Text style = {styles.subLabel}>{key}: </Text>
  <Text style={styles.value}>{val}</Text>
</Text>
        ))
      ) : (
        <Text style={styles.value}>{field.value}</Text>
      )}
      {!(field.label && field.subLabel) && !isNextSubLabel && <Divider style={styles.divider} />}
    </View>
  );
})}


      </Card.Content>
      {canEdit() && (
            <View style={styles.editButtonContainer}>
    <Card.Actions>
      <TouchableOpacity style={styles.editBtn}
       onPress={() =>
          router.push({
            pathname: editRoute,
            params: {
              id: id,
              fromPreview: "true",
              returnTo: "/landform/Preview",
              fromsubmit: fromsubmit,
              returnsubmit: returnsubmit,
              fromedit:"true",
              fromland:fromland,
              frompond:frompond,
              fromplantation:fromplantation,
            },
          })
        }
    >
                  <Ionicons name="create-outline" size={ width * 0.06} color="#0B8B42" />
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
      {/* <Button
        mode="outlined"
        onPress={() =>
          router.push({
            pathname: editRoute,
            params: {
              id: id,
              fromPreview: "true",
              returnTo: "/landform/Preview",
              fromsubmit: fromsubmit,
              returnsubmit: returnsubmit,
              fromedit:"true",
            },
          })
        }
      >
        Edit
      </Button> */}
    </Card.Actions>
    </View>
)}
    </Card>
  );

  return (
 <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.headerContainer}>
  <TouchableOpacity  onPress={() => {

    if (fromsubmit) {
      router.push(returnsubmit); // Go back to total submitted page
    } else {
      router.back(); // Go back normally
    }
  }}>
    <Ionicons name="arrow-back" size={width * 0.06} color="#0B8B42" style={styles.backArrow} />
  </TouchableOpacity>
  <Text style={styles.heading_land}>LAND REDEVELOPMENT FORM</Text>
</View>
      <View style={styles.imageContainer}>
  {selectedForm?.bankDetails?.submittedFiles?.farmerPhoto?.uri ? (
    <Image
      source={{ uri: selectedForm.bankDetails.submittedFiles.farmerPhoto.uri }}
      style={styles.photo}
      resizeMode="cover"
    />
  ) : (
    <Text style={styles.noPhotoText}>Add a farmer photo</Text>
  )}
</View>

      {renderSection("Basic Details", [
        //  {label : "Date",value: selectedForm.landDevelopment?.date},
        // {label : "ID",value: id},
        { label: "1. Name of Farmer", value: selectedForm.basicDetails?.name},
        { label: "1-2. Age", value: selectedForm.basicDetails?.age},
        { label: "2. Mobile Number", value: selectedForm.basicDetails?.mobile},
        { label: "3. District", value: selectedForm.basicDetails?.district},
        { label: "4. Block", value: selectedForm.basicDetails?.block},
        { label: "5. Panchayat", value: selectedForm.basicDetails?.panchayat},
        { label: "6. Hamlet", value: selectedForm.basicDetails?.hamlet},
        // { label: "6. Identity Card", value: selectedForm.basicDetails?.idCardType},
        { label: "7. ID Card Number", value: selectedForm.basicDetails?.idCardNumber},
        { label: "8. Gender", value: selectedForm.basicDetails?.gender},
        { label: "9. Father / Spouse Name", value: selectedForm.basicDetails?.fatherSpouse },
        { label: "10. Type of Household", value: selectedForm.basicDetails?.householdType },
        { label: "11. Household Members"},
        { subLabel: "Adults", value: selectedForm.basicDetails?.adults },
        { subLabel: "Children", value: selectedForm.basicDetails?.children },
        { label: "12. Occupation of Household Members ",value: selectedForm.basicDetails?.occupation},
          //  { subLabel: "Agriculture", value: selectedForm.basicDetails?.occupation.agriculture },
          //  { subLabel: "Business", value: selectedForm.basicDetails?.occupation.business },
          //  { subLabel: "Others", value: selectedForm.basicDetails?.occupation.other },
        { label: "13. Special Category", value: selectedForm.basicDetails?.specialCategory ? "Yes" : "No" },
      ...(selectedForm.basicDetails?.specialCategoryNumber > 0
  ? [{ subLabel: "Special Category Number", value: selectedForm.basicDetails?.specialCategoryNumber }]
  : []),

        { label: "14. Caste", value: selectedForm.basicDetails?.caste },
        { label: "15. House Ownership", value: selectedForm.basicDetails?.houseOwnership },
        { label: "16. Type of House", value: selectedForm.basicDetails?.houseType },
        { label: "17. Drinking Water Source", value: selectedForm.basicDetails?.drinkingWaterCombined },
        { label: "18. Potability", value: selectedForm.basicDetails?.potabilityCombined },
        { label: "19. Domestic Water Source", value: selectedForm.basicDetails?.domesticWaterCombined },
        { label: "20. Toilet Availability", value: selectedForm.basicDetails?.toiletAvailability },
        { label: "21. Toilet Condition", value: selectedForm.basicDetails?.toiletCondition },
        { label: "22. Education of Householder", value: selectedForm.basicDetails?.education },
      ], "/prefd/basicDetails")}

      {renderSection("Land Ownership & Livestock", [
        { label: "23. Land Ownership", value: selectedForm.landOwnership?.landOwnershipType },
        { label: "24. Well for Irrigation", value: selectedForm.landOwnership?.hasWell },
         ...(selectedForm.landOwnership?.hasWell > 0
  ? [ { subLabel: "No of Wells", value: selectedForm.landOwnership?.areaIrrigated }]
  : []),
        { label: "25. Irrigated Lands (ha)",value: selectedForm.landOwnership?.irrigatedLand},
        //  { subLabel: "Rainfed", value: selectedForm.landOwnership?.rainfed},
        //   { subLabel: "Tankfed", value: selectedForm.landOwnership?.tankfed },
        //    { subLabel: "Well irrigated", value: selectedForm.landOwnership?.wellIrrigated },
        { label: "26. Patta Number", value: selectedForm.landOwnership?.pattaNumber },
        { label: "27. Total Area (ha)", value: selectedForm.landOwnership?.totalArea },
        { label: "27-28. Taluk", value: selectedForm.landOwnership?.taluk },
        { label: "27-28. Firka", value: selectedForm.landOwnership?.firka},
        { label: "28. Revenue Village", value: selectedForm.landOwnership?.revenueVillage },
        { label: "29. Crop Season", value: selectedForm.landOwnership?.cropSeasonCombined },
        { label: "30. LiveStocks",value : selectedForm.landOwnership?.livestock},
        // { subLabel: " Goat", value: selectedForm.landOwnership?.livestock?.goat || "0" },
        // { subLabel: " Sheep", value: selectedForm.landOwnership?.livestock?.sheep || "0" },
        // { subLabel: " Milch Animals :", value: selectedForm.landOwnership?.livestock?.milchAnimals || "0" },
        // { subLabel: " Draught Animals :", value: selectedForm.landOwnership?.livestock?.draught_animals || "0" },
        // { subLabel: " Poultry :", value: selectedForm.landOwnership?.livestock?.poultry || "0" },
        // { subLabel: " Others :", value: selectedForm.landOwnership?.livestock?.others || "0" },
         ], "/prefd/landOwnership")}

      {renderSection("Land Development Details", [
        { label: "31. S.F. No.", value: selectedForm.landDevelopment?.sfNumber },
        { label: "31.a) Latitude & Longitude"},
        { subLabel: "Latitude", value: selectedForm.landDevelopment?.latitude },
        { subLabel: "Longitude", value: selectedForm.landDevelopment?.longitude },
        { label: "32. Soil Type", value: selectedForm.landDevelopment?.soilTypeCombined },
        { label: "33. Land to benefit (ha)", value: selectedForm.landDevelopment?.landBenefit },
        { label: "36. Date of Inspection", value: selectedForm.landDevelopment?.date},
        { label: "38. Type of work proposed", value: selectedForm.landDevelopment?.workTypeCombined },
        // { label: "    Details about work types", value: selectedForm.landDevelopment?.workTypeText },
        { label: "39. Area benefited (ha)", value: selectedForm.landDevelopment?.proposalArea },
        { label: "40. Any other works proposed", value: selectedForm.landDevelopment?.otherWorks },
        { label: "41. PRADAN Contribution", value: selectedForm.landDevelopment?.pradanContribution },
        { label: "42. Farmer Contribution", value: selectedForm.landDevelopment?.farmerContribution },
        { label: "43. Total Estimate Amount", value: selectedForm.landDevelopment?.totalEstimate },
      ], "/landform/landDevelopment")}

      {renderSection("Bank Details", [
        { label: "44. Name of Account Holder", value: selectedForm.bankDetails?.accountHolderName },
        { label: "45. Account Number", value: selectedForm.bankDetails?.accountNumber},
        { label: "46. Name of the Bank", value: selectedForm.bankDetails?.bankName },
        { label: "47. Branch", value: selectedForm.bankDetails?.branch },
        { label: "48. IFSC", value: selectedForm.bankDetails?.ifscCode },
        { label: "49. Farmer has agreed for the work and his contribution", value: selectedForm.bankDetails?.farmerAgreed },
        {
          label: "50. Files submitted",
          value:
            selectedForm.bankDetails?.submittedFiles &&
            Object.values(selectedForm.bankDetails.submittedFiles).some(Boolean)
              ? Object.entries(selectedForm.bankDetails.submittedFiles)
                  .filter(([_, val]) => !!val)
                  .map(([key, val]) => ({
                    label: `${key}: ${val.name2}`,
                    uri: val.uri,
                  }))
              : ["No files uploaded"],
        },
      ], "/prefd/bankDetails")}


  <View style={styles.submitContainer}>
    {/* Save Draft Button */}
    {!isSubmittedPreview && (
    <TouchableOpacity
      style={styles.draftBtn}
      onPress={async () => {
  try {
   
    await new Promise((res) => setTimeout(res, 50));
    await useDraftStore.getState().saveDraft(data); 
    Alert.alert("Saved", "Form saved as draft successfully!");
    router.push("/dashboard");
 

  } catch (err) {
    Alert.alert("Error", "Failed to save draft. Please try again.");
  }
  finally{
     resetData();
  }
}}

    >
      <Ionicons name="save-outline" size={width * 0.06} color="#fff" />
      <Text style={styles.draftText}>Save Draft</Text>
    </TouchableOpacity>
)}
    {/* Submit Button */}
   {isFormComplete && (
  <TouchableOpacity
    style={styles.submitButton}
    onPress={() => {
      handleSubmit();
    }}
  >
    <Ionicons name="checkmark-circle-outline" size={width * 0.06} color="#fff" />
    <Text style={styles.submitText}>Submit</Text>
  </TouchableOpacity>
)}

  </View>
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
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F7ED',
    // flex: 1,
  },

noPhotoText: {
  fontSize: 12,
  color: '#999',
  textAlign: 'center',
  paddingHorizontal: 5,
},

  title: {
     fontSize: width * 0.06, // 6% of screen width
    fontWeight: 'bold',
    color: '#0B8B42',
    marginBottom: height * 0.02, // 2% of screen height
    textAlign: 'left',
    letterSpacing: 1,
  },
  card: {
    margin: width * 0.05, // 5% of screen width
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: width * 0.06, // 6% of screen width
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  divider: {
    marginVertical: 5,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B8B42',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.08,
    borderRadius: 30,
  },
  backButton: {
  marginRight: width * 0.025,        // ~2.5% of screen width

  },

imageContainer: {
  position: 'absolute',
  top: height * 0.13,
  right: width * 0.09,
  width: width * 0.3,        // Same as image width
  height: width * 0.3,       // Same as image height
  borderWidth: 2,
  borderColor: '#4CAF50',
  borderRadius: width * 0.02,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fff',   // Optional: to show a white frame
  zIndex: 10,
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

 photo: {
    width: width * 0.3,     // 30% of screen width
    height: width * 0.3,
    borderRadius: width * 0.02,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  photoLabel: {
    marginTop: height * 0.02,
    fontSize: width * 0.04,
    color: '#388E3C',
    fontWeight: '600',
  },
  pageTitle: {
    fontSize: width * 0.06, // 6% of screen width
    fontWeight: 'bold',
    color: '#0B8B42',
    marginBottom: height * 0.02, // 2% of screen height
    textAlign: 'left',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: width * 0.05, // 5% of screen width
    fontWeight: '800',
    color: '#4CAF50',
    marginBottom: height * 0.03, // 3% of screen height
    textAlign: 'left',
  },
  item: {
    marginBottom: height * 0.02, // 2% of screen height
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
    paddingBottom: height * 0.01, // 1% of screen height
  },
  label: {
    color: '#0B8B42',
    fontSize: width * 0.04, // 4% of screen width
    fontWeight: '700',
  },
  subLabel: {
    color: '#388E3C',
    fontSize: width * 0.035, // 3.5% of screen width
    fontWeight: '800',
    marginTop: height * 0.01, // 1% of screen height
  },
  value: {
    fontSize: width * 0.04, // 4% of screen width
    color: '#444',
    marginTop: height * 0.01, // 1% of screen height
    fontWeight: '500',
  },
  editButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: height * 0.05, // 5% of screen height
  },
  heading_land: {
    fontSize: width * 0.055, // 5.5% of screen width
    fontWeight: 'bold',
    color: '#0B8B42',
    marginBottom: height * 0.02, // 2% of screen height
    marginTop: height * 0.03, // 3% of screen height
    textAlign: 'center',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.02, // 2% of screen height
    paddingHorizontal: width * 0.04, // 4% of screen width
    backgroundColor: '#DFF5E3',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#134e13',
  },
  editText: {
    marginLeft: width * 0.02, // 2% of screen width
    color: '#134e13',
    fontWeight: '600',
    fontSize: width * 0.04, // 4% of screen width
  },
  fileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 10,
    paddingVertical: height * 0.02, // 2% of screen height
    paddingHorizontal: width * 0.04, // 4% of screen width
    marginTop: height * 0.02, // 2% of screen height
    backgroundColor: '#F1F8E9',
  },
  fileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileName: {
    marginLeft: width * 0.02, // 2% of screen width
    fontSize: width * 0.04, // 4% of screen width
    color: '#2E7D32',
    fontWeight: '600',
  },
  fileRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: width * 0.035, // 3.5% of screen width
  },
  submitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: height * 0.05,
    marginHorizontal: width * 0.05,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B8B42',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.08,
    borderRadius: 30,
  },
  submitText: {
    color: '#fff',
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    marginLeft: 8,
  },
  draftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA500',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.08,
    borderRadius: 30,
  },
 
draftText: {
  color: '#fff',
  fontSize: scaleFont(16),
  fontWeight: 'bold',
  marginLeft: 8,
},
headerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: height * 0.0,    // ~1.5% of screen height
  paddingHorizontal: width * 0.04,   // ~4% of screen width
},

backArrow: {
  marginRight: width * 0.025,        // ~2.5% of screen width
  paddingTop: height * 0.01,         // ~1% of screen height
},

});