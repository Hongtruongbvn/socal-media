import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import api from '../services/api';
import type { ShopItem } from '../features/shop/types/Shop';
import { useAuth } from '../features/auth/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Coins } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import ShopItemCard from '../features/shop/components/ShopItemCard.native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const ShopPage: React.FC = () => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, fetchUser } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/shop/items');
      setItems(response.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi khi tải vật phẩm cửa hàng',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handlePurchase = async (itemId: string) => {
    try {
      const response = await api.post('/shop/purchase', { itemId });
      Toast.show({
        type: 'success',
        text1: response.data.message,
      });
      fetchUser();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.response?.data?.message || 'Giao dịch thất bại',
      });
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.shopHeader}>
        <Text style={styles.title}>Cửa hàng Vật phẩm</Text>
        <View style={styles.userCoins}>
          <Text style={styles.coinText}>Số dư:</Text>
          <View style={styles.coinWrapper}>
            <Text style={styles.coinAmount}>
              {user?.coins?.toLocaleString() || 0}
            </Text>
            <Coins size={16} color="#c1cd78" style={{ marginLeft: 4 }} />
          </View>
          <TouchableOpacity
            style={styles.topupButton}
            onPress={() => navigation.navigate('TopUp' as never)}
          >
            <Text style={styles.topupText}>+ Nạp Coin</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#c1cd78" style={{ marginTop: 30 }} />
      ) : items.length === 0 ? (
        <Text style={styles.statusText}>Không có vật phẩm nào trong cửa hàng</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.shopGrid}>
          {items.map((item) => (
            <ShopItemCard key={item._id} item={item} onPurchase={handlePurchase} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#0e4420',
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#c1cd78',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#c1cd78',
  },
  userCoins: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#083b38',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  coinText: {
    color: '#d5e4c3',
    marginRight: 6,
  },
  coinWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinAmount: {
    color: '#c1cd78',
    fontWeight: '700',
    fontSize: 16,
  },
  topupButton: {
    marginLeft: 12,
    backgroundColor: '#c1cd78',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  topupText: {
    color: '#0e4420',
    fontWeight: '600',
  },
  statusText: {
    textAlign: 'center',
    color: '#d5e4c3',
    marginTop: 20,
    fontSize: 16,
  },
  shopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
});

export default ShopPage;
