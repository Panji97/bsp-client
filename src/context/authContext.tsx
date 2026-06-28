import React, { createContext, useContext, useState, useEffect } from 'react';
import { router, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    id: number;
    username: string;
    email: string;
    phoneNumber?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    token: string | null;
    authLoading: boolean;
    // Fungsi login dihapus dari sini
    logout: () => Promise<void>;
    setAuthData: (token: string, user: User) => Promise<void>; // Ubah jadi async
    forgotPassword: (phoneNumber: string) => Promise<void>;
    verifyOTP: (phoneNumber: string, otp: string) => Promise<void>;
    resetPassword: (phoneNumber: string, newPassword: string) => Promise<void>;
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Hook untuk proteksi rute
function useProtectedRoute(user: User | null, isLoading: boolean) {
    const segments = useSegments();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === 'auth';
        const inTabsGroup = segments[0] === '(tabs)';

        if (!user && inTabsGroup) {
            router.replace('/auth/login');
        } else if (user && inAuthGroup) {
            router.replace('/(tabs)/home');
        }
    }, [user, segments, isLoading]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);

    useProtectedRoute(user, isLoading);

    useEffect(() => {
        loadStoredAuthData();
    }, []);

    const loadStoredAuthData = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('userToken');
            const storedUser = await AsyncStorage.getItem('userData');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Error loading auth data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi untuk set auth data ke context dan AsyncStorage
    const setAuthData = async (newToken: string, newUser: User) => {
        try {
            await AsyncStorage.setItem('userToken', newToken);
            await AsyncStorage.setItem('userData', JSON.stringify(newUser));
            setToken(newToken);
            setUser(newUser);
        } catch (error) {
            console.error('Error saving auth data:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');
            setToken(null);
            setUser(null);
            router.replace('/auth/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const fetchWithErrorHandling = async (url: string, options: RequestInit) => {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    };

    const forgotPassword = async (phoneNumber: string) => {
        setAuthLoading(true);
        try {
            const data = await fetchWithErrorHandling('http://localhost:1337/api/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ phoneNumber }),
            });
            return data;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to send OTP');
        } finally {
            setAuthLoading(false);
        }
    };

    const verifyOTP = async (phoneNumber: string, otp: string) => {
        setAuthLoading(true);
        try {
            const data = await fetchWithErrorHandling('http://localhost:1337/api/auth/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ phoneNumber, otp }),
            });
            return data;
        } catch (error: any) {
            throw new Error(error.message || 'Invalid OTP');
        } finally {
            setAuthLoading(false);
        }
    };

    const resetPassword = async (phoneNumber: string, newPassword: string) => {
        setAuthLoading(true);
        try {
            const data = await fetchWithErrorHandling('http://localhost:1337/api/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ phoneNumber, newPassword }),
            });
            return data;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to reset password');
        } finally {
            setAuthLoading(false);
        }
    };

    const changePassword = async (oldPassword: string, newPassword: string) => {
        setAuthLoading(true);
        try {
            const data = await fetchWithErrorHandling('http://localhost:1337/api/auth/change-password', {
                method: 'POST',
                body: JSON.stringify({ oldPassword, newPassword }),
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to change password');
        } finally {
            setAuthLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            authLoading,
            token,
            logout,
            setAuthData, // Expose fungsi ini
            forgotPassword,
            verifyOTP,
            resetPassword,
            changePassword,
        }}>
            {children}
        </AuthContext.Provider>
    );
}