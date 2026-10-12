import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const BottomNavigationBar = ({ navigation }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: -2 },
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home-outline" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Add')}>
        <Ionicons name="add-circle" size={36} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
        <Ionicons name="menu-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigationBar;
