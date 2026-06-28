import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Image, ImageBackground, Text, TouchableOpacity, View, TextInput, Dimensions, SafeAreaView, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { useAuth } from '../../context/authContext';
import { LinearGradient } from 'expo-linear-gradient';

const { height, width } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();
    const { setAuthData, isLoading: authLoading } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [secureText, setSecureText] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    // Modal states
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalConfig, setModalConfig] = useState<{
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
        buttons?: Array<{
            text: string;
            onPress?: () => void;
            variant?: 'primary' | 'secondary' | 'danger';
        }>;
    }>({
        type: 'info',
        title: '',
        message: '',
        buttons: [{ text: 'OK', variant: 'primary' }]
    });

    const handlePhoneChange = (text: string) => {
        const cleaned = text.replace(/[^0-9]/g, '');
        setPhoneNumber(cleaned);
    };

    const showModal = (config: {
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
        buttons?: Array<{
            text: string;
            onPress?: () => void;
            variant?: 'primary' | 'secondary' | 'danger';
        }>;
    }) => {
        setModalConfig({
            type: config.type,
            title: config.title,
            message: config.message,
            buttons: config.buttons || [{ text: 'OK', variant: 'primary' }]
        });
        setModalVisible(true);
    };

    const handleLogin = async () => {
        if (!phoneNumber || !password) {
            showModal({
                type: 'warning',
                title: 'Oops!',
                message: 'Mohon lengkapi semua field yang diperlukan'
            });
            return;
        }

        setLoading(true);
        try {
            const identifier = phoneNumber.startsWith('0')
                ? `62${phoneNumber.substring(1)}`
                : phoneNumber;

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

            console.log('Response status:', response.status);
            console.log('Response data:', result);

            if (response.ok) {
                const { jwt, user } = result;

                if (jwt && user) {
                    showModal({
                        type: 'success',
                        title: 'Welcome Back! 🎉',
                        message: `Halo ${user.username || 'Nasabah'}, senang melihatmu kembali!`,
                        buttons: [{
                            text: 'Lanjutkan',
                            variant: 'primary',
                            onPress: () => {
                                setAuthData(jwt, user);
                            }
                        }]
                    });
                } else {
                    showModal({
                        type: 'error',
                        title: 'Oops!',
                        message: 'Data login tidak lengkap. Silahkan coba lagi.'
                    });
                }
            } else {
                let errorMessage = 'Login gagal. Silahkan coba lagi.';
                let errorDetails = '';

                if (result.error) {
                    errorMessage = result.error.message || errorMessage;
                    errorDetails = result.error.details?.message || '';

                    if (result.error.status === 400) {
                        errorMessage = 'Nomor HP atau password tidak valid';
                    } else if (result.error.status === 401) {
                        errorMessage = 'Password yang Anda masukkan salah';
                    } else if (result.error.status === 404) {
                        errorMessage = 'Akun tidak ditemukan';
                    }
                } else if (result.message) {
                    errorMessage = result.message;
                }

                const errorLower = errorMessage.toLowerCase();
                const detailsLower = errorDetails.toLowerCase();

                if (errorLower.includes('identifier') ||
                    errorLower.includes('phone') ||
                    errorLower.includes('number') ||
                    detailsLower.includes('identifier') ||
                    detailsLower.includes('phone')) {
                    showModal({
                        type: 'error',
                        title: 'Akun Tidak Ditemukan',
                        message: 'Nomor HP tidak terdaftar. Periksa kembali nomor Anda.'
                    });
                } else if (errorLower.includes('password') ||
                    detailsLower.includes('password') ||
                    result.error?.status === 401) {
                    showModal({
                        type: 'warning',
                        title: 'Password Salah',
                        message: 'Password yang Anda masukkan salah. Silahkan coba lagi.',
                        buttons: [
                            {
                                text: 'Coba Lagi',
                                variant: 'primary',
                                onPress: () => {
                                    setModalVisible(false);
                                }
                            },
                            {
                                text: 'Lupa Password',
                                variant: 'secondary',
                                onPress: () => {
                                    setModalVisible(false);
                                    router.push('./forgotPassword');
                                }
                            }
                        ]
                    });
                } else {
                    showModal({
                        type: 'error',
                        title: 'Login Gagal',
                        message: errorMessage
                    });
                }
            }
        } catch (error: any) {
            console.error('Login error:', error);

            showModal({
                type: 'info',
                title: 'Koneksi Gagal',
                message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
                buttons: [
                    {
                        text: 'Coba Lagi',
                        variant: 'primary',
                        onPress: () => {
                            setModalVisible(false);
                            handleLogin();
                        }
                    },
                    {
                        text: 'Batal',
                        variant: 'secondary'
                    }
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    // Render modal icon dengan desain modern
    const renderModalIcon = () => {
        const iconConfig = {
            success: { name: 'check-circle', color: '#10B981', bg: '#D1FAE5' },
            error: { name: 'cancel', color: '#EF4444', bg: '#FEE2E2' },
            warning: { name: 'warning', color: '#F59E0B', bg: '#FEF3C7' },
            info: { name: 'info', color: '#3B82F6', bg: '#DBEAFE' }
        };

        const config = iconConfig[modalConfig.type];
        return (
            <View style={[styles.iconWrapper, { backgroundColor: config.bg }]}>
                <MaterialIcons name={config.name as any} size={48} color={config.color} />
            </View>
        );
    };

    // Render button dengan variant
    const renderButton = (button: any, index: number) => {
        const buttonStyles = {
            primary: styles.btnPrimary,
            secondary: styles.btnSecondary,
            danger: styles.btnDanger
        };

        const textStyles = {
            primary: styles.btnTextPrimary,
            secondary: styles.btnTextSecondary,
            danger: styles.btnTextDanger
        };

        const variant = button.variant || 'primary';

        return (
            <Pressable
                key={index}
                style={({ pressed }) => [
                    styles.modalButton,
                    buttonStyles[variant as keyof typeof buttonStyles],
                    pressed && styles.btnPressed
                ]}
                onPress={() => {
                    if (button.onPress) {
                        button.onPress();
                    }
                    if (modalConfig.buttons && modalConfig.buttons.length === 1) {
                        setModalVisible(false);
                    }
                }}
            >
                <Text style={[styles.modalButtonText, textStyles[variant as keyof typeof textStyles]]}>
                    {button.text}
                </Text>
            </Pressable>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ImageBackground style={styles.background}>
                    <Pressable
                        style={styles.backButton}
                        onPress={() => router.push('/')}
                        disabled={loading || authLoading}
                    >
                        <MaterialIcons name="chevron-left" size={28} color="#2E7D32" />
                    </Pressable>

                    <View style={styles.headerContainer}>
                        <View style={styles.headerRow}>
                            <Image
                                source={require('../../../assets/images/icon_bspid.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <View>
                                <Text style={styles.title}>Log In</Text>
                                <Text style={styles.subtitle}>Nasabah Bank Sampah Pintar</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.loginPanel}>
                        <Text style={styles.welcomeTitle}>Welcome!</Text>
                        <Text style={styles.welcomeSubtitle}>Log In to your account using phone number</Text>

                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>Phone Number</Text>
                            <View style={styles.phoneInputWrapper}>
                                <View style={styles.countryCodeContainer}>
                                    <Image
                                        source={{ uri: 'https://flagcdn.com/w40/id.png' }}
                                        style={styles.flagIcon}
                                    />
                                    <Text style={styles.countryCodeText}>+62</Text>
                                    <View style={styles.divider} />
                                </View>
                                <TextInput
                                    style={styles.phoneTextInput}
                                    placeholder="812-3456-7890"
                                    placeholderTextColor="#A8ABB0"
                                    value={phoneNumber}
                                    onChangeText={handlePhoneChange}
                                    keyboardType="phone-pad"
                                    maxLength={13}
                                    editable={!loading && !authLoading}
                                />
                                <MaterialIcons name="phone-iphone" size={20} color="#A8ABB0" />
                            </View>
                        </View>

                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <View style={styles.passwordInputWrapper}>
                                <TextInput
                                    style={styles.passwordTextInput}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#A8ABB0"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={secureText}
                                    editable={!loading && !authLoading}
                                />
                                <Pressable onPress={() => setSecureText(!secureText)} disabled={loading || authLoading}>
                                    <MaterialIcons
                                        name={secureText ? "visibility-off" : "visibility"}
                                        size={20}
                                        color="#A8ABB0"
                                    />
                                </Pressable>
                            </View>
                        </View>

                        <Pressable
                            style={styles.forgotPasswordContainer}
                            disabled={loading || authLoading}
                            onPress={() => router.push('./forgotPassword')}
                        >
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.loginButton, (loading || authLoading) && styles.disabledButton]}
                            onPress={handleLogin}
                            disabled={loading || authLoading}
                        >
                            {(loading || authLoading) ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.loginButtonText}>Log In</Text>
                            )}
                        </Pressable>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account?</Text>
                            <Pressable onPress={() => router.push('../auth/signup')} disabled={loading || authLoading}>
                                <Text style={styles.signupText}> Sign Up</Text>
                            </Pressable>
                        </View>
                    </View>
                </ImageBackground>
            </KeyboardAvoidingView>

            {/* Modern Modal */}
            <Modal
                isVisible={modalVisible}
                backdropOpacity={0.3}
                backdropColor="#000"
                animationIn="fadeIn"
                animationOut="fadeOut"
                animationInTiming={250}
                animationOutTiming={250}
                useNativeDriver={true}
                hideModalContentWhileAnimating={true}
                style={styles.modal}
            >
                <View style={styles.modalContainer}>
                    {/* Icon */}
                    {renderModalIcon()}

                    {/* Title */}
                    <Text style={styles.modalTitle}>{modalConfig.title}</Text>

                    {/* Message */}
                    <Text style={styles.modalMessage}>{modalConfig.message}</Text>

                    {/* Buttons */}
                    <View style={styles.modalButtonContainer}>
                        {modalConfig.buttons && modalConfig.buttons.map((button, index) => renderButton(button, index))}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5DC',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    disabledButton: {
        opacity: 0.7,
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#EDEDF5',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 16,
        zIndex: 10,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerContainer: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerRow: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        paddingBottom: 4,
        paddingTop: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
    },
    loginPanel: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 40,
        marginTop: 20,
        justifyContent: 'space-between',
    },
    welcomeTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    welcomeSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 32,
    },
    inputSection: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 8,
        marginLeft: 4,
    },
    phoneInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FB',
        borderRadius: 9999,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flagIcon: {
        width: 24,
        height: 16,
        borderRadius: 2,
        marginRight: 8,
    },
    countryCodeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: '#D1D5DB',
        marginHorizontal: 12,
    },
    phoneTextInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1A1A1A',
    },
    passwordInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FB',
        borderRadius: 9999,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    passwordTextInput: {
        flex: 1,
        paddingVertical: 14,
        color: '#1A1A1A',
        fontSize: 14,
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: '#00512c',
        fontSize: 12,
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#F68B1E',
        paddingVertical: 16,
        borderRadius: 9999,
        alignItems: 'center',
        marginBottom: 40,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#6B7280',
        fontSize: 14,
    },
    signupText: {
        color: '#00512c',
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        paddingBottom: 4,
    },
    // Modern Modal Styles
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 32,
        width: '85%',
        maxWidth: 340,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    iconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    modalMessage: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 22,
        letterSpacing: 0.2,
    },
    modalButtonContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 12,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    btnPrimary: {
        backgroundColor: '#F68B1E',
    },
    btnSecondary: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    btnDanger: {
        backgroundColor: '#EF4444',
    },
    btnPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.97 }],
    },
    modalButtonText: {
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    btnTextPrimary: {
        color: 'white',
    },
    btnTextSecondary: {
        color: '#374151',
    },
    btnTextDanger: {
        color: 'white',
    },
});