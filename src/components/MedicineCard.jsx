import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Button, Surface, Avatar } from "react-native-paper";
import { Colors } from "../constants/RootColor";

const MedicineCard = ({ medicine, onAdd, onDelete }) => {
  // Format the date to match the example (ISO format)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch (e) {
      return dateString.toString();
    }
  };

  return (
    <Surface style={styles.card}>
      <View style={styles.contentContainer}>
        <View style={styles.userInfo}>
          {medicine.user_id?.profileImage ? (
            <Avatar.Image size={40} source={{ uri: medicine.user_id.profileImage }} style={styles.avatar} />
          ) : (
            <Avatar.Icon size={40} icon="account" style={[styles.avatar, { backgroundColor: Colors.mainColor }]} />
          )}
          <Text style={styles.userName}>{medicine.user_id?.name || "Unknown User"}</Text>
        </View>

        <Image
          source={{
            uri: medicine.image_path,
          }}
          style={styles.image}
        />

        <View style={styles.details}>
          <View style={styles.row}>
            <Text style={styles.label}>
              Name: <Text style={styles.value}>{medicine.name}</Text>
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Expire date: <Text style={styles.value}>{formatDate(medicine.expire_date)}</Text>
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={onAdd}
              style={styles.addButton}
              labelStyle={styles.buttonLabel}
            >
              Accept
            </Button>

            <Button
              mode="contained"
              onPress={onDelete}
              style={styles.deleteButton}
              labelStyle={styles.buttonLabel}
            >
              Reject
            </Button>
          </View>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 4,
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: "column",
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: "cover",
  },
  details: {
    padding: 16,
  },
  row: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#8989899',
  },
  value: {
    fontSize: 15,
    marginBottom: 5,
    fontWeight: 'normal',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  addButton: {
    backgroundColor: Colors.mainColor,
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#e64e67',
    borderRadius: 10,
    flex: 1,
    marginLeft: 5,
  },
  buttonLabel: {
    color: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    marginRight: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MedicineCard;
