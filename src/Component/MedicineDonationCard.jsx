import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from "../hooks/useAuth"; 
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useAddRequestMutation } from "../redux/Slice/request"; 
const MedicineDonationCard = ({medicine}) => {
  // Calculate days until expiry
  const navigation = useNavigation();
    const { userId } = useAuth(); 
    const dispatch = useDispatch();
    const [addRequest] = useAddRequestMutation();

    const handlePick = async () => {
        console.log(" Sending Data:", { 
            user_id: userId, 
            medicine: medicine?._id,
            status: true 
        });
    
        try {
            const response = await addRequest({
                user_id: userId,  
                medicine: medicine?._id, 
            }).unwrap(); 
    
            console.log("Request Added Successfully:", response);
            navigation.navigate("Orders");
        } catch (error) {
            console.error("Error Adding Request:", error);
        }
    };
  const daysUntilExpiry = Math.ceil((new Date(medicine.expire_date) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={['#00b2bc','#009da6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        {/* Medicine Image with Overlay */}
        <View style={styles.imageWrapper}>
          <Image 
            source={{ uri: medicine.image_path }} 
            style={styles.medicineImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
            style={styles.imageOverlay}
          />
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Medicine Info */}
          <View style={styles.medicineInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.medicineName}>{medicine.name}</Text>
              <Text style={styles.concentration}>{medicine.concentration}</Text>
            </View>
            <View style={[styles.donorInfo,{padding:10}]}>
              <MaterialCommunityIcons name="pill" size={20} color="#FFF"/>
              <Text style={[styles.quantityText,{color:'#fff'}]}  >{medicine.quantity}</Text>
            </View>
          </View>

          {/* Donor Info */}
          <View style={styles.donorInfo}>
            <View style={styles.donorDetails}>
              <MaterialCommunityIcons name="account-circle" size={20} color="#ffffff" />
              <Text style={styles.donorName}>{medicine.user_id.name}</Text>
            </View>
            <View style={styles.expiryContainer}>
              <MaterialCommunityIcons name="clock-outline" size={16} color="#ffffff" />
              <Text style={styles.expiryText}>{daysUntilExpiry} days left</Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity style={styles.actionButton} onPress={handlePick}>
            <MaterialCommunityIcons name="heart-pulse" size={24} color="#00b2bc" />
            <Text style={styles.actionButtonText}>Request Donation</Text>
          </TouchableOpacity>
        </View>
        {/* Decorative Elements */}
        <View style={styles.decorativeContainer}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
          <View style={styles.circle3} />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '40%',
    // maxWidth: 340,
    minHeight: 400,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    margin: 15,
  },
  gradientBackground: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
  },
  imageWrapper: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  medicineImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  contentContainer: {
    padding: 20,
    flex: 1,
  },
  medicineInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  nameContainer: {
    flex: 1,
    marginRight: 15,
  },
  medicineName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  concentration: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  quantityBadge: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00b2bc',
    marginLeft: 5,
  },
  donorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  donorDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donorName: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 8,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  expiryText: {
    color: '#ffffff',
    fontSize: 12,
    marginLeft: 5,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    height: 55,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonText: {
    color: '#00b2bc',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  decorativeContainer: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 100,
    height: 100,
  },
  circle1: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: 0,
    right: 0,
  },
  circle2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: 20,
    right: 20,
  },
  circle3: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: 40,
    right: 40,
  },
});

export default MedicineDonationCard;