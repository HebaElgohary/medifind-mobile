import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Text, ActivityIndicator, Snackbar, Button } from "react-native-paper";
import {
  useGetAllMedicinesQuery,
  useUpdateMedicineMutation,
} from "../redux/Slice/medicine";
import MedicineCard from "../components/MedicineCard";

export const OffersReview = () => {
  // Fetch medicines
  const {
    data: medicines,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllMedicinesQuery();

  // Mutations
  const [updateMedicine] = useUpdateMedicineMutation();

  // State for handling refresh and feedback
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  

  // Handle refresh action
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Handle accept medicine
  const handleAdd = async (medicine) => {
    try {
      await updateMedicine({
        id: medicine, 
        examine: true,
        status: true,
      });

      showSnackbar("Medicine added successfully");
      refetch();
    } catch (err) {
      showSnackbar(`Error adding medicine: ${err.message}`);
    }
  };

  // Handle reject medicine
  const handleDelete = async (medicine) => {
    try {
      await updateMedicine({
        id: medicine,
        examine: true,
        status: false,
      });

      showSnackbar("Medicine deleted successfully");
      refetch();
    } catch (err) {
      showSnackbar(`Error deleting medicine: ${err.message}`);
    }
  };

  // Snackbar control functions
  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const hideSnackbar = () => {
    setSnackbarVisible(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#66d5c1" />
        <Text>Loading medicines...</Text>
      </View>
    );
  }
  if(medicines.length === 0){
    return (
      <View style={styles.centerContainer}>
        <Text>No medicines available</Text>
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text>
          Error loading medicines:{" "}
          {error?.data?.message || error?.error || "Unknown error"}
        </Text>
        <Button onPress={refetch}>Retry</Button>
      </View>
    );
  }

  // No data state
  const medicineData = medicines?.data || medicines;
  if (!medicineData || !Array.isArray(medicineData)) {
    return (
      <View style={styles.centerContainer}>
        <Text>No medicines available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
       <Text style={styles.title}>Offers</Text>
      <FlatList
        data={medicineData}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={({ item }) =>
          !item.examine ? (
            <MedicineCard
              medicine={item}
              onAdd={() => handleAdd(item._id)}
              onDelete={() => handleDelete(item._id)}
            />
          ) : null
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}

      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={hideSnackbar}
        duration={3000}
        action={{
          label: "Dismiss",
          onPress: hideSnackbar,
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '80%',
    marginHorizontal: '10%',
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
    marginBottom: 60,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listContent: {
    paddingBottom: 16,
  },
    
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    marginHorizontal:100,
    color: '#8989899',
    fontFamily: 'serif',
  },
});
