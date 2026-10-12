import React from 'react';
import { View, Platform, Modal, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Button } from 'react-native-paper';

// Conditionally import DateTimePicker based on platform
let DateTimePicker;
if (Platform.OS !== 'web') {
  // For native platforms
  DateTimePicker = require('@react-native-community/datetimepicker').default;
} else {
  // For web, we'll use a simple fallback
  DateTimePicker = null;
}

const DateTimePickerComponent = ({ show, date, onChange, onClose }) => {
  // For web platform, create a simple date input
  if (Platform.OS === 'web') {
    if (!show) return null;
    
    const handleChange = (e) => {
      const selectedDate = new Date(e.target.value);
      onChange(null, selectedDate);
    };
    
    const formatDateForInput = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    return (
      <Modal
        visible={show}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date</Text>
            <input
              type="date"
              value={formatDateForInput(date)}
              onChange={handleChange}
              style={styles.webDateInput}
            />
            <View style={styles.buttonContainer}>
              <Button mode="outlined" onPress={onClose} style={styles.button}>
                Cancel
              </Button>
              <Button mode="contained" onPress={onClose} style={styles.button}>
                Done
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
  
  // For native platforms
  if (!DateTimePicker) return null;
  
  if (Platform.OS === 'ios') {
    // iOS uses a modal approach
    return (
      <Modal
        visible={show}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={onChange}
              minimumDate={new Date()}
            />
            <Button mode="contained" onPress={onClose}>
              Done
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
  
  // For Android, render inline
  return show ? (
    <DateTimePicker
      value={date}
      mode="date"
      display="default"
      onChange={onChange}
      minimumDate={new Date()}
    />
  ) : null;
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  webDateInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    marginHorizontal: 5,
  },
});

export default DateTimePickerComponent; 