import { StyleSheet } from "react-native";
import { Colors } from '../constants/RootColor'
export const roundedCard = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    post: {
        width: '80%',
        marginHorizontal: '10%',
        marginBottom: 20,

        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        boxShadow: '0 2px 3px #0000001a',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8
    },
    row: {
        flexDirection: 'row',
    }

})