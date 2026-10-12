import Icon from "react-native-vector-icons/FontAwesome5";
import React, { useState, useEffect } from "react";

import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView, KeyboardAvoidingView, Platform } from "react-native";


import { TextInput, Button, HelperText, PaperProvider } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useAddMedicineMutation, useUpdateMedicineMutation } from "../redux/Slice/medicine";
import { useAuth } from "../hooks/useAuth";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Colors } from "../constants/RootColor";

const theme = {
  colors: {
    primary: Colors.mainColor,
    onSurfaceVariant: Colors.mainColor,
    background: "#ffffff",
    text: "#333",
    error: "#D32F2F",
  },
};

export const AddMedicine = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const auth = useAuth();
  const [addMedicine, { isLoading }] = useAddMedicineMutation();
  const [updateMedicine] = useUpdateMedicineMutation();

  // Extract medicine data if updating
  const medicine = route.params?.medicine || null;
  const [name, setName] = useState("");
  const [concentration, setConcentration] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [img, setImg] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});
  const [isUploading, setUploading] = useState(false);

  useEffect(() => {
    if (medicine) {
      setName(medicine.name || "");
      setConcentration(medicine.concentration || "");
      setFormattedDate(medicine.expire_date || "");
      setImg(medicine.image_path || "");
      setQuantity(medicine.quantity || 0);
    }
  }, [medicine]);

  const validateInputs = () => {
    let newErrors = {};
    if (!name.trim()) newErrors.name = "Medicine name is required.";
    if (!formattedDate.trim()) newErrors.date = "Expire date is required.";
    if (!concentration.trim()) newErrors.concentration = "Concentration is required.";
    if (!quantity) newErrors.quantity = "Quantity is required.";
    if (!img) newErrors.img = "Medicine image is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
      setFormattedDate(selectedDate.toISOString().split("T")[0]);
    }
    setShowDatePicker(false);
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "medicine.jpg",
        });
        formData.append("upload_preset", "medifined");
        formData.append("cloud_name", "doxyvufkz");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/doxyvufkz/image/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setImg(response.data.secure_url);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while picking the image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    try {
      const requestData = {
        name,
        expire_date: formattedDate,
        concentration,
        image_path: img,
        user_id: auth.userId,
        quantity: Number(quantity)
      };

      if (medicine) {
        await updateMedicine({ id: medicine._id, ...requestData }).unwrap();
        Alert.alert("Success", "Medicine updated successfully!");
      } else {
        await addMedicine(requestData).unwrap();
        Alert.alert("Success", "Medicine added successfully!");
      }

      setName("");
      setFormattedDate("");
      setConcentration("");
      setQuantity(0);
      setImg("");
      setErrors({});
      navigation.navigate("Donations");
    } catch (error) {
      Alert.alert("Error", "Failed to process the medicine.");
    }
  };

  return (
    <PaperProvider theme={theme}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.container}>
            <Text style={styles.title}>
              {medicine ? "Update Medicine" : "Add Medicine"}
            </Text>

            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Icon
                name="hand-holding-heart"
                size={50}
                color={Colors.mainColor}
              />
            </View>

            {/* Medicine Name Input */}
            <TextInput
              label="Medicine Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              outlineColor={Colors.mainColor}
            />
            {errors.name && <HelperText type="error">{errors.name}</HelperText>}

            <TextInput
              label="Expire Date"
              value={formattedDate}
              onFocus={() => setShowDatePicker(true)}
              mode="outlined"
              style={styles.input}
              outlineColor={Colors.mainColor}
            />
            {errors.date && <HelperText type="error">{errors.date}</HelperText>}

            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display="calendar"
                minimumDate={new Date()}
                onChange={handleDateChange}
              />
            )}

            <TextInput
              label="Number of Pieces"
              value={quantity}
              onChangeText={setQuantity}
              mode="outlined"
              outlineColor={Colors.mainColor}
              style={styles.input}
            />
            {errors.quantity && (
              <HelperText type="error">{errors.quantity}</HelperText>
            )}

            {/* Medicine Concentration Input */}
            <TextInput
              label="Medicine Concentration"
              value={concentration}
              onChangeText={setConcentration}
              mode="outlined"
              outlineColor={Colors.mainColor}
              style={styles.input}
            />
            {errors.concentration && (
              <HelperText type="error">{errors.concentration}</HelperText>
            )}

            <View style={styles.imagePickerContainer}>
              <TouchableOpacity
                onPress={handleImagePick}
                style={styles.imagePicker}
              >
                <Icon
                  name="camera"
                  size={20}
                  color={Colors.mainColor}
                  style={{ marginRight: 10 }}
                />
                <Button mode="text" color="#43a694">
                  {img ? "Change Image" : "Upload Image"}
                </Button>
              </TouchableOpacity>
              {img && (
                <Image source={{ uri: img }} style={styles.imagePreview} />
              )}
            </View>
            {errors.img && <HelperText type="error">{errors.img}</HelperText>}

            <Button
              style={styles.button}
              textColor="white"
              mode="contained"
              loading={isLoading || isUploading}
              onPress={handleSubmit}
            >
              {isLoading || isUploading
                ? "Processing..."
                : medicine
                ? "Update Medicine"
                : "Add Medicine"}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({


  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "center",
    marginBottom:60
  },
  scrollContainer: {
    flexGrow: 1,
    // width: "100%",
    // paddingBottom: Platform.OS === 'ios' ? 120 : 90,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    color: Colors.mainColor,
    fontFamily: "Georgia",
    textAlign: "center",
  },
  input: {
    marginBottom: 12,
    width: "100%",
    borderRadius: 12,
    paddingHorizontal: 12,
    border:Colors.mainColor
  },
  button: {
    backgroundColor: Colors.mainColor,
    marginTop: 15,
    width: "60%",
    borderRadius: 12,
    alignSelf: "center",
    fontSize: 66,
    paddingVertical: 10,
    marginBottom: 20,
  },
  imagePickerContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  imagePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.mainColor,
    padding: 10,
    width: "100%",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginVertical: 10,
    resizeMode: "cover",
  },

});

export default AddMedicine;
