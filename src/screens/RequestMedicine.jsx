import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Text, TextInput, Button, HelperText, PaperProvider } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome5";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useAddOrderMutation,useUpdateOrderMutation } from "../redux/Slice/order";
import { useUpdateRequestMutation } from "../redux/Slice/request";
import { useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";

const theme = {
  colors: {
    primary: "#01b3bd",
    background: "#ffffff",
    text: "#333",
    error: "#D32F2F",
    onSurfaceVariant: "#01b3bd" // This controls the label color
  },
};

export const RequestMedicine = () => {
  // Destructure the passed item from route.params
  const { item } = useRoute().params || {};
  const navigation = useNavigation();
  const userId = useSelector((state) => state.auth.user?.id);

  // Form state
  const [medicineName, setMedicineName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Mutation hooks
  const [addOrder, { isLoading: isAddingOrder }] = useAddOrderMutation();
  const [updateRequest, { isLoading: isUpdatingRequest }] = useUpdateRequestMutation();
  const [updateOrder]=useUpdateOrderMutation()

  // Pre-fill the form if an item is passed (update mode)
  useEffect(() => {
    if (item && item._id) {
      setMedicineName(item.req_name || item.medicine.name);
      setDescription(item.req_description || "");
      setImage(item.prescription_img || "");
    }
  }, [item]);

  // Image picking function
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Upload image to Cloudinary (only if the image is new, i.e. doesn't start with "http")
  const uploadImage = async () => {
    if (!image) {
      Alert.alert("Error", "Please select an image first.");
      return null;
    }
    // If the image is already a URL, assume it's already uploaded.
    if (image.startsWith("http")) {
      return image;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: image,
        type: "image/jpeg",
        name: "medicine.jpg",
      });
      formData.append("upload_preset", "medifined");
      formData.append("cloud_name", "doxyvufkz");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/doxyvufkz/image/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUploading(false);
      return response.data.secure_url;
    } catch (error) {
      setUploading(false);
      console.error("Image upload failed:", error);
      Alert.alert("Error", "Failed to upload the image. Please try again.");
      return null;
    }
  };

  // Validate inputs
  const validateInputs = () => {
    let newErrors = {};
    if (!medicineName.trim()) newErrors.name = "Medicine name is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!image) newErrors.image = "Medicine image is required.";
    if (Object.keys(newErrors).length > 0) {
      Alert.alert("Error", "Please fill all fields and upload an image.");
    }
    return newErrors;
  };

  // Submit handler: update if editing, otherwise add new
  const handleRequestMedicine = async () => {
    const errors = validateInputs();
    if (Object.keys(errors).length > 0) return;
    if (!userId) {
      Alert.alert("Error", "User not authenticated. Please login again.");
      return;
    }
    try {
      const uploadedImageUrl = await uploadImage();
      if (!uploadedImageUrl) return;

      const orderData = {
        req_name: medicineName,
        req_description: description,
        prescription_img: uploadedImageUrl,
        user_id: userId,
        requested: true,
      };

      if (item && item._id &&item.medicine) {
    
        const response = await updateRequest({ id: item._id, body: orderData }).unwrap();
        console.log("Request updated successfully:", response);
        Alert.alert("Success", "Medicine updated successfully!");}
      else if (item && item._id){
        const response = await updateOrder({ id: item._id, body: orderData }).unwrap();
        console.log("Request updated successfully:", response);
      } else {
        // Add new request
        const response = await addOrder(orderData).unwrap();
        console.log("Request added successfully:", response);
        Alert.alert(
          "Success",
          `Medicine Requested Successfully!`
        );
      }
      // Reset fields and navigate
      setMedicineName("");
      setDescription("");
      setImage(null);
      navigation.navigate("Orders")
    } catch (error) {
      console.error("Failed to request medicine:", error);
      Alert.alert("Error", "Failed to request medicine. Please try again.");
    }
  };

  return (
    <PaperProvider theme={theme}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.title}>
              {item && item._id ? "Update Request" : "Request Medicine"}
            </Text>
            <View style={{ alignItems: "center", marginBottom: 20 }}> 
              <Icon name="hand-holding-medical" size={45} color="#01b3bd" />
            </View>

        
        {/* Medicine Name Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            mode="outlined"
            label="Medicine Name"
            value={medicineName}
            onChangeText={setMedicineName}
            outlineColor="#01b3bd"
            activeOutlineColor="#01b3bd"
          />
        </View>

            {/* Description Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.textArea]}
                mode="outlined"
                label="Description"
                value={description}
                onChangeText={setDescription}
                multiline
                outlineColor="#01b3bd"
                activeOutlineColor="#01b3bd"
              />
            </View>

            {/* Selected Image Preview */}
            {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

            {/* Upload Image Button */}
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Icon2 name="photo-camera" size={24} color="#01b3bd" />
              <Text style={styles.uploadButtonText}>Select Image</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleRequestMedicine}
            >
              <Text style={styles.submitButtonText}>
                {isAddingOrder
                  ? "Submitting..."
                  : item && item._id
                  ? "Update Medicine"
                  : "Request Medicine"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  scrollContainer: {
    flexGrow: 1,
    // width: "100%",
    // paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "#01b3bd",
    marginBottom: 20,
    fontWeight: "bold",
  },
  icon: {
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#01b3bd",
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#01b3bd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 20,
    width: "100%",
    marginBottom: 20,
  },
  uploadButtonText: {
    color: "#01b3bd",
    fontSize: 16,
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: "#01b3bd",
    borderRadius: 8,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginBottom: 20,
    borderRadius: 200,
  },
});

export default RequestMedicine;
