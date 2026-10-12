import React from "react";
import { StyleSheet, View, Image ,ScrollView } from "react-native";
import { Button, Text, } from 'react-native-paper';
import { Colors } from '../constants/RootColor'
import { Styles } from '../constants/mainStyle'
import { FlatList } from "react-native";
import { useGetAcceptedMedicinesQuery } from "../redux/Slice/medicine"
import { RoundedCard } from "../Component/roundedCard";
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import MedicineDonationCard from '../Component/MedicineDonationCard';

export function Home() {
  const { isAuthenticated, userId, tokenData, userRole } = useAuth();
  const navigation = useNavigation();


  const { data: acceptedMedicines, isLoading, isError, error } = useGetAcceptedMedicinesQuery();
  const HeroSection = () => (
    <View style={[Styles.container,{ marginVertical: '20%' }]}>
      <Image
        source={require('../../assets/gift-box.png')}
        style={{ width: 300, height: 280, marginVertical: 10 }}
      ></Image>
      <Text variant="headlineSmall">
        <Text style={{ color: Colors.mainColor, display: 'block', marginInlineEnd: '10' }} >Give</Text>
        <Text>the Gift of Health: Donate</Text>
        <Text style={{ color: Colors.mainColor }} >Medicine</Text> Today !
      </Text>
      <Text variant="titleSmall" style={{ color: Colors.secondaryColor }} >
        Every donated pill is a beacon of hope for someone in need.
      </Text>
      <Button style={[Style.width50, { marginTop: 20 }]} mode="elevated" textColor={Colors.baseColor} buttonColor={Colors.mainColor} onPress={() => navigation.navigate("AddMedicine")}
      >
        Donate
      </Button>
    </View>
  )

  const SectionTitle=()=> (
    <Text variant="headlineMedium" style={[ {marginTop:"10%" ,marginBottom:40}]} > Available Medicine </Text>
  )
  
  const handleDonation = () => {
    // Handle donation logic here
    console.log('Donation clicked');
  };

  return (
    <FlatList
      data={acceptedMedicines?.data}
      ListHeaderComponent={
        <>
          <HeroSection />
          <SectionTitle />
          
        </>
      }
      renderItem={({ item }) => <MedicineDonationCard medicine={item} />}
      keyExtractor={(item) => item._id}
      style={{ backgroundColor: "#ffffff" ,marginBottom:80  }}
      contentContainerStyle={{ paddingTop: 20 }}
    />
  );
}


const Style = StyleSheet.create({
  container :{
    flex:1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  width50: {
    width: '50%',
  }
})
