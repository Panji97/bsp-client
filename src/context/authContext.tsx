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
    login: (identifier: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
    setAuthData: (token: string, user: User) => void;
    forgotPassword: (phoneNumber: string) => Promise<void>; // Tambahkan ini
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

        // Jika user tidak login dan mencoba akses protected route ((tabs))
        if (!user && inTabsGroup) {
            router.replace('/auth/login');
        }
        // Jika user login dan mencoba akses auth route
        else if (user && inAuthGroup) {
            router.replace('/(tabs)/home');
        }
    }, [user, segments, isLoading]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

    const setAuthData = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
    };

    const login = async (identifier: string, password: string) => {
        try {
            const response = await fetch('http://localhost:1337/api/auth/local', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier: identifier,
                    password: password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Simpan token dan user data
                await AsyncStorage.setItem('userToken', result.jwt);
                await AsyncStorage.setItem('userData', JSON.stringify(result.user));

                setToken(result.jwt);
                setUser(result.user);

                return result;
            } else {
                throw new Error(result.error?.message || 'Login failed');
            }
        } catch (error) {
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

    // Fungsi forgotPassword
    const forgotPassword = async (phoneNumber: string): Promise<void> => {
        try {
            // API call ke backend untuk forgot password
            // Sesuaikan endpoint dengan API Anda
            const response = await fetch('http://localhost:1337/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    phoneNumber: phoneNumber,
                    // Jika backend menggunakan email, Anda bisa tambahkan:
                    // email: email 
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error?.message || 'Failed to send reset link');
            }

            // Jika sukses, return void (Promise<void>)
            return;
        } catch (error) {
            console.error('Forgot password error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isLoading, 
            token, 
            login, 
            logout, 
            setAuthData,
            forgotPassword // Tambahkan ini
        }}>
            {children}
        </AuthContext.Provider>
    );
}  