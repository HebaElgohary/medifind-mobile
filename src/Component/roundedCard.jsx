import { View } from "react-native"
import { Button, Text } from "react-native-paper";
import { Colors } from '../constants/RootColor'
import { StyleSheet } from "react-native";
import { roundedCard } from "./roundedCardStyle";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from "@react-navigation/native";
import { useAddRequestMutation } from "../redux/Slice/request"; 
import { useAuth } from "../hooks/useAuth"; 
import { useDispatch } from "react-redux";

export const RoundedCard = ({ medicine }) => {
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
    return (
        <View style={roundedCard.post}>
            <View style={roundedCard.row} >
                <Icon name="account" size={30} color="#9AA6B2" />
                <View style={{marginInlineStart:"20"  }} >
                    <Text variant="titleLarge" >
                        {medicine.user_id.name}
                    </Text> 
                    <Text style={{marginVertical:'15'}} > Name : {medicine.name}
                        <Text style={{ color: Colors.mutedColor 
                                    ,marginInlineStart:"10" }}>
                                    {medicine.concentration}
                        </Text>
                    </Text>
                    <Text> Expire_date : {medicine.expire_date.split('-').slice(0,2).join('-')}</Text>
                </View>
            </View>
           
            <Button style={{ width: '30%', fontSize: '8', marginInlineStart: 'auto' }} mode="contained" buttonColor={Colors.mainColor} onPress={handlePick}>
                Pick
            </Button>
        </View>
    )
};