import { View, Text, Dimensions, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// API Base URL - sesuaikan dengan backend Anda
const API_BASE_URL = 'https://your-api-url.com'; // Ganti dengan URL API Anda

export default function SettingsScreen() {
    const router = useRouter();

    // State for editable fields
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isEditingWhatsapp, setIsEditingWhatsapp] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [userId, setUserId] = useState(null);

    // Fetch user data from database
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setIsLoading(true);

            // Get token and user data from AsyncStorage
            const token = await AsyncStorage.getItem('userToken');
            const userDataString = await AsyncStorage.getItem('userData');

            // If you have an API endpoint to get user profile
            if (token) {
                const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setWhatsapp(data.username || data.whatsapp || '');
                    setEmail(data.email || '');
                    setName(data.name || '');
                    setUserId(data.id);

                    // Update AsyncStorage with latest data
                    await AsyncStorage.setItem('userData', JSON.stringify(data));
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Fallback to stored data if API fails
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    setWhatsapp(userData.username || userData.whatsapp || '');
                    setEmail(userData.email || '');
                    setName(userData.name || '');
                }
            } catch (fallbackError) {
                console.error('Fallback error:', fallbackError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Function to update WhatsApp number
    const updateWhatsApp = async () => {
        if (!whatsapp.trim()) {
            Alert.alert('Error', 'Nomor WhatsApp tidak boleh kosong');
            return;
        }

        // Validate phone number format (simple validation)
        const phoneRegex = /^[0-9]{10,13}$/;
        if (!phoneRegex.test(whatsapp.replace(/[^0-9]/g, ''))) {
            Alert.alert('Error', 'Nomor WhatsApp tidak valid');
            return;
        }

        try {
            setIsSaving(true);
            const token = await AsyncStorage.getItem('userToken');

            if (!token) {
                Alert.alert('Error', 'Anda belum login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/user/update-profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: whatsapp,
                    // include other fields to maintain existing data
                    email: email,
                    name: name
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Update stored user data
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    userData.username = whatsapp;
                    userData.whatsapp = whatsapp;
                    await AsyncStorage.setItem('userData', JSON.stringify(userData));
                }

                Alert.alert('Sukses', 'Nomor WhatsApp berhasil diperbarui');
                setIsEditingWhatsapp(false);
            } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.message || 'Gagal memperbarui nomor WhatsApp');
            }
        } catch (error) {
            console.error('Error updating WhatsApp:', error);
            Alert.alert('Error', 'Terjadi kesalahan saat memperbarui data');
        } finally {
            setIsSaving(false);
        }
    };

    // Function to update Email
    const updateEmail = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Email tidak boleh kosong');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Format email tidak valid');
            return;
        }

        try {
            setIsSaving(true);
            const token = await AsyncStorage.getItem('userToken');

            if (!token) {
                Alert.alert('Error', 'Anda belum login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/user/update-profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    phone: whatsapp,
                    name: name
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Update stored user data
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    userData.email = email;
                    await AsyncStorage.setItem('userData', JSON.stringify(userData));
                }

                Alert.alert('Sukses', 'Email berhasil diperbarui');
                setIsEditingEmail(false);
            } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.message || 'Gagal memperbarui email');
            }
        } catch (error) {
            console.error('Error updating email:', error);
            Alert.alert('Error', 'Terjadi kesalahan saat memperbarui data');
        } finally {
            setIsSaving(false);
        }
    };

    // Function to handle logout - IMPROVED VERSION (tanpa multiRemove)
    // const handleLogout = async () => {
    //     Alert.alert(
    //         "Konfirmasi Logout",
    //         "Apakah Anda yakin ingin keluar dari akun?",
    //         [
    //             {
    //                 text: "Batal",
    //                 style: "cancel"
    //             },
    //             {
    //                 text: "Logout",
    //                 style: "destructive",
    //                 onPress: async () => {
    //                     try {
    //                         setIsLoggingOut(true);

    //                         // 1. Panggil API logout jika diperlukan
    //                         const token = await AsyncStorage.getItem('userToken');
    //                         if (token) {
    //                             try {
    //                                 await fetch(`${API_BASE_URL}/api/auth/logout`, {
    //                                     method: 'POST',
    //                                     headers: {
    //                                         'Authorization': `Bearer ${token}`,
    //                                         'Content-Type': 'application/json',
    //                                     },
    //                                 });
    //                             } catch (apiError) {
    //                                 // Abaikan error API, tetap lanjutkan logout
    //                                 console.log('Logout API error (ignored):', apiError);
    //                             }
    //                         }

    //                         // 2. Hapus semua data autentikasi satu per satu
    //                         await AsyncStorage.removeItem('userToken');
    //                         await AsyncStorage.removeItem('refreshToken');
    //                         await AsyncStorage.removeItem('userData');
    //                         await AsyncStorage.removeItem('userEmail');
    //                         await AsyncStorage.removeItem('userPhone');
    //                         await AsyncStorage.removeItem('userWhatsapp');
    //                         await AsyncStorage.removeItem('userName');
    //                         await AsyncStorage.removeItem('userId');

    //                         console.log('All authentication data cleared successfully');

    //                         // 3. Reset state
    //                         setWhatsapp('');
    //                         setEmail('');
    //                         setName('');
    //                         setUserId(null);

    //                         // 4. Navigasi ke login dengan replace (mencegah back)
    //                         router.replace('/auth/login');

    //                     } catch (error) {
    //                         console.error('Logout error:', error);
    //                         Alert.alert('Error', 'Terjadi kesalahan saat logout. Silakan coba lagi.');
    //                     } finally {
    //                         setIsLoggingOut(false);
    //                     }
    //                 }
    //             }
    //         ],
    //         { cancelable: false }
    //     );
    // };

    // Function to handle logout - DIRECT VERSION (tanpa konfirmasi)
    const handleLogoutDirect = async () => {
        try {
            console.log('1. Starting logout...');
            setIsLoggingOut(true);

            console.log('2. Removing tokens...');
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('refreshToken');
            await AsyncStorage.removeItem('userData');
            await AsyncStorage.removeItem('userEmail');
            await AsyncStorage.removeItem('userPhone');
            console.log('3. Tokens removed successfully');

            console.log('4. Resetting state...');
            setWhatsapp('');
            setEmail('');
            setName('');
            setUserId(null);

            console.log('5. Navigating to login...');
            router.replace('/auth/login');
            console.log('6. Navigation called');

            // Verifikasi apakah AsyncStorage sudah kosong
            const token = await AsyncStorage.getItem('userToken');
            console.log('7. Token after removal:', token);

        } catch (error) {
            console.log('Logout error:', error);
        } finally {
            console.log('8. Logout finished');
            setIsLoggingOut(false);
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#FF6B00" />
                <Text style={styles.loadingText}>Memuat data profil...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Picture Section */}
                <View style={styles.profileSection}>
                    <View style={styles.profileImageContainer}>
                        <LinearGradient
                            colors={['#FF6B00', '#FF8C38']}
                            style={styles.profileImageBorder}
                        >
                            <View style={styles.profileImagePlaceholder}>
                                <Ionicons name="person" size={50} color="#FF6B00" />
                            </View>
                        </LinearGradient>
                        <Text style={styles.userName}>{name || 'User'}</Text>
                        <View style={styles.userBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#FF6B00" />
                            <Text style={styles.userBadgeText}>Terverifikasi</Text>
                        </View>
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity
                        style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
                        onPress={handleLogoutDirect}
                        disabled={isLoggingOut}
                        activeOpacity={0.7}
                    >
                        {isLoggingOut ? (
                            <ActivityIndicator size="small" color="#FF3B30" />
                        ) : (
                            <>
                                <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                                <Text style={styles.logoutText}>Logout</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Profile Settings Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="settings-outline" size={20} color="#FF6B00" />
                        <Text style={styles.sectionTitle}>Pengaturan Profil</Text>
                    </View>

                    {/* WhatsApp Row */}
                    <View style={styles.row}>
                        <View style={styles.rowIcon}>
                            <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
                        </View>
                        <View style={styles.rowContent}>
                            <Text style={styles.rowLabel}>WhatsApp</Text>
                            {isEditingWhatsapp ? (
                                <View style={styles.editContainer}>
                                    <TextInput
                                        style={styles.input}
                                        value={whatsapp}
                                        onChangeText={setWhatsapp}
                                        placeholder="Masukkan nomor WhatsApp"
                                        placeholderTextColor="#8e8e93"
                                        keyboardType="phone-pad"
                                        editable={!isSaving}
                                    />
                                    <View style={styles.editActions}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setIsEditingWhatsapp(false);
                                                fetchUserData();
                                            }}
                                            disabled={isSaving}
                                            style={styles.cancelButton}
                                        >
                                            <Text style={styles.cancelText}>Batal</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={updateWhatsApp}
                                            disabled={isSaving}
                                            style={styles.saveButton}
                                        >
                                            <Text style={styles.saveText}>
                                                {isSaving ? 'Menyimpan...' : 'Simpan'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <>
                                    <Text style={styles.rowValue}>{whatsapp || 'Belum diisi'}</Text>
                                    <TouchableOpacity onPress={() => setIsEditingWhatsapp(true)}>
                                        <Text style={styles.editText}>Edit</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>

                    {/* E-mail Row */}
                    <View style={styles.row}>
                        <View style={styles.rowIcon}>
                            <Ionicons name="mail-outline" size={22} color="#FF6B00" />
                        </View>
                        <View style={styles.rowContent}>
                            <Text style={styles.rowLabel}>E-mail</Text>
                            {isEditingEmail ? (
                                <View style={styles.editContainer}>
                                    <TextInput
                                        style={styles.input}
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="Masukkan email"
                                        placeholderTextColor="#8e8e93"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        editable={!isSaving}
                                    />
                                    <View style={styles.editActions}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setIsEditingEmail(false);
                                                fetchUserData();
                                            }}
                                            disabled={isSaving}
                                            style={styles.cancelButton}
                                        >
                                            <Text style={styles.cancelText}>Batal</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={updateEmail}
                                            disabled={isSaving}
                                            style={styles.saveButton}
                                        >
                                            <Text style={styles.saveText}>
                                                {isSaving ? 'Menyimpan...' : 'Simpan'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <>
                                    <Text style={styles.rowValue}>{email || 'Belum diisi'}</Text>
                                    <TouchableOpacity onPress={() => setIsEditingEmail(true)}>
                                        <Text style={styles.editText}>Edit</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>

                    {/* Personal Row */}
                    <TouchableOpacity style={styles.row} onPress={() => router.push('/profile')}>
                        <View style={styles.rowIcon}>
                            <Ionicons name="person-outline" size={22} color="#FF6B00" />
                        </View>
                        <View style={styles.rowContent}>
                            <Text style={styles.rowLabel}>Personal</Text>
                            <View style={styles.rowRight}>
                                <Text style={styles.rowValue}>Edit</Text>
                                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Pewaris Row */}
                    <TouchableOpacity style={styles.row} onPress={() => router.push('/profile')}>
                        <View style={styles.rowIcon}>
                            <Ionicons name="people-outline" size={22} color="#FF6B00" />
                        </View>
                        <View style={styles.rowContent}>
                            <Text style={styles.rowLabel}>Pewaris</Text>
                            <View style={styles.rowRight}>
                                <Text style={styles.rowValue}>Edit</Text>
                                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Security Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="shield-outline" size={20} color="#FF6B00" />
                        <Text style={styles.sectionTitle}>Keamanan</Text>
                    </View>

                    {/* Update Password Row */}
                    <TouchableOpacity style={styles.row} onPress={() => router.push('/profile')}>
                        <View style={styles.rowIcon}>
                            <Ionicons name="lock-closed-outline" size={22} color="#FF6B00" />
                        </View>
                        <View style={styles.rowContent}>
                            <Text style={styles.rowLabel}>Update Password</Text>
                            <View style={styles.rowRight}>
                                <Text style={styles.rowValue}>Edit</Text>
                                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* PIN Row */}
                    <TouchableOpacity style={styles.row} onPress={() => router.push('/profile')}>
                        <View style={styles.rowIcon}>
                            <Ionicons name="key-outline" size={22} color="#FF6B00" />
                        </View>
                        <View style={styles.rowContent}>
                            <Text style={styles.rowLabel}>PIN</Text>
                            <View style={styles.rowRight}>
                                <Text style={styles.rowValue}>Edit</Text>
                                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Versi Aplikasi */}
                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>Versi Aplikasi 1.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#8e8e93',
    },
    profileSection: {
        alignItems: 'center',
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    profileImageBorder: {
        width: 110,
        height: 110,
        borderRadius: 55,
        padding: 3,
        shadowColor: '#FF6B00',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    profileImagePlaceholder: {
        width: 104,
        height: 104,
        borderRadius: 52,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        marginTop: 12,
    },
    userBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        backgroundColor: '#FFF5EB',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    userBadgeText: {
        fontSize: 12,
        color: '#FF6B00',
        fontWeight: '500',
        marginLeft: 4,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FF3B30',
        marginTop: 8,
        minWidth: 120,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    logoutButtonDisabled: {
        opacity: 0.6,
    },
    logoutText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginLeft: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    rowIcon: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#FFF5EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    rowContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1A1A1A',
        flex: 1,
    },
    rowValue: {
        fontSize: 14,
        color: '#8e8e93',
        marginRight: 8,
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editText: {
        fontSize: 14,
        color: '#FF6B00',
        fontWeight: '600',
        marginLeft: 8,
    },
    cancelText: {
        fontSize: 14,
        color: '#8e8e93',
        fontWeight: '500',
    },
    saveText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    chevron: {
        fontSize: 18,
        color: '#C7C7CC',
        fontWeight: '500',
    },
    input: {
        fontSize: 14,
        color: '#1A1A1A',
        paddingVertical: 4,
        paddingHorizontal: 0,
        borderBottomWidth: 2,
        borderBottomColor: '#FF6B00',
        flex: 1,
        marginRight: 8,
    },
    editContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    editActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
        gap: 8,
    },
    cancelButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#F0F0F0',
    },
    saveButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#FF6B00',
    },
    versionContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: 10,
    },
    versionText: {
        fontSize: 12,
        color: '#8e8e93',
        fontWeight: '400',
    },
});