import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  FlatList, 
  Alert,
  TouchableOpacity,
} from "react-native";
import { Button, Surface, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useGetOrderQuery, useDeleteOrderMutation, useUpdateOrderMutation } from "../redux/Slice/order";
import { useGetUserRequestsQuery, useUpdateRequestMutation, useDeleteRequestMutation } from "../redux/Slice/request";
import { useAuth } from "../hooks/useAuth";
import { Colors } from '../constants/RootColor';

export function Orders() {
  const { userId } = useAuth();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'requests'

  // Fetch orders and requests from API
  const { data: requestsData } = useGetUserRequestsQuery(userId);
  const { data: ordersData } = useGetOrderQuery(userId);

  // Mutation hooks
  const [updateRequest] = useUpdateRequestMutation();
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteRequest] = useDeleteRequestMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  // Local state for orders and requests (renamed to avoid conflicts)
  const [requestsList, setRequestsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);

  useEffect(() => {
    if (requestsData) {
      setRequestsList(requestsData.data);
    }
    if (ordersData) {
      setOrdersList(ordersData.data);
    }
  }, [requestsData, ordersData]);

  // Handle update navigation for a request/order item
  const handleUpdateRequest = async (item) => {
    navigation.navigate("RequestMedicine", { item, itemId: item._id, medicineId: item.medicine });
  };

  // Handle delete for requests/orders
  const handleDelete = async ({ req_id, user_id, medicine }) => {
    try {
      if (medicine) {
        await deleteRequest({ req_id, user_id }).unwrap();
        setRequestsList((prev) => prev.filter((req) => req._id !== req_id));
        Alert.alert("Success", "Request deleted successfully!");
      } else {
        await deleteOrder({ req_id, user_id }).unwrap();
        setOrdersList((prev) => prev.filter((order) => order._id !== req_id));
        Alert.alert("Success", "Order deleted successfully!");
      }
    } catch (error) { 
      console.error("Delete Error:", error);
      Alert.alert("Error", "Failed to delete item.");
    }
  };

  // Render each item with conditional styling based on examined and status
  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: (item.medicine && item.medicine.image_path) || item.prescription_img,
          }}
          style={styles.img}
        />
        {item.requested &&<View style={styles.statusBadge}>
          {item.requested && item.examined && item.status && (
            <View style={styles.statusContainer}>
              <Avatar.Icon size={24} icon="check" color="#fff" style={[styles.statusIcon, { backgroundColor: '#4CAF50' }]} />
              <Text style={[styles.statusText, { color: '#fff' }]}>Accepted</Text>
            </View>
          )}
          {item.requested && item.examined && !item.status && (
            <View style={styles.statusContainer}>
              <Avatar.Icon size={24} icon="close" color="#fff" style={[styles.statusIcon, { backgroundColor: '#F44336' }]} />
              <Text style={[styles.statusText, { color: '#fff' }]}>Rejected</Text>
            </View>
          )}
          {item.requested && !item.examined && !item.status && (
            <View style={styles.statusContainer}>
              <Avatar.Icon size={24} icon="clock-outline" color="#fff" style={[styles.statusIcon, { backgroundColor: '#FFC107' }]} />
              <Text style={[styles.statusText, { color: '#fff' }]}>Pending</Text>
            </View>
          )}
        </View>}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.medicineName}>
          {item.req_name || (item.medicine && item.medicine.name)}
        </Text>

        {item.medicine && (
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Avatar.Icon size={20} icon="flask-outline" color={Colors.mainColor} style={styles.detailIcon} />
              <View>
                <Text style={styles.detailLabel}>Concentration</Text>
                <Text style={styles.detailValue}>{item.medicine.concentration}</Text>
              </View>
            </View>
          </View>
        )}

        {!item.medicine && <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Avatar.Icon size={20} icon="flask-outline" color={Colors.mainColor} style={styles.detailIcon} />
              <View>
                <Text style={styles.detailLabel}>Concentration</Text>
                <Text style={styles.detailValue}>100mg</Text>
              </View>
            </View>
          </View>}

        <View style={styles.buttonContainer}>
          {!item.requested && !item.examined && !item.status && (
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: "#4CAF50" }]}
              onPress={() => handleUpdateRequest(item)}
            >
              <Avatar.Icon size={24} icon="check" color="#fff" style={styles.actionIcon} />
            </TouchableOpacity>
          )}
          {!item.examined && item.requested && (
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: Colors.mainColor }]}
              onPress={() => handleUpdateRequest(item)}
            >
              <Avatar.Icon size={24} icon="pencil" color="#fff" style={styles.actionIcon} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: '#E64E67' }]}
            onPress={() =>
              item.medicine
                ? handleDelete({ req_id: item._id, user_id: userId, medicine: item.medicine })
                : handleDelete({ req_id: item._id, user_id: userId })
            }
          >
            <Avatar.Icon size={24} icon="delete" color="#fff" style={styles.actionIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'orders' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('orders')}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'orders' && styles.activeTabText
          ]}>My Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'requests' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('requests')}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'requests' && styles.activeTabText
          ]}>My Requests</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'orders' ? ordersList : requestsList}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#00BCD4',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingBottom: 80,
  },
  cardContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginHorizontal: 40,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: "cover",
  },
  statusBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: 'rgba(78, 77, 77, 0.51)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 100,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statusIcon: {
    backgroundColor: 'transparent',
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: 'capitalize',
    letterSpacing: 0.5,
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  medicineName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIcon: {
    backgroundColor: 'transparent',
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: "#636E72",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  iconButton: {
    borderRadius: 20,
    padding: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionIcon: {
    backgroundColor: 'transparent',
  }
});

export default Orders;