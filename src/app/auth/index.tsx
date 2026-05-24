import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/authContext';

export default function AuthIndexScreen() {
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (user) {
                router.replace('/(tabs)/home');
            } else {
                router.replace('/auth/login');
            }
        }
    }, [user, isLoading]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5DC' }}>
            <ActivityIndicator size="large" color="#F68B1E" />
        </View>
    );
}