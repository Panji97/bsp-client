import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ImageBackground, Text, TouchableOpacity, View, TextInput, Dimensions, SafeAreaView, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/authContext';

const { height, width } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { forgotPassword, isLoading: authLoading } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const handlePhoneChange = (text: string) => {
        const cleaned = text.replace(/[^0-9]/g, '');
        setPhoneNumber(cleaned);
    };

    const handleForgotPassword = async () => {
        if (!phoneNumber) {
            Alert.alert('Error', 'Please enter your phone number');
            return;
        }

        if (phoneNumber.length < 10) {
            Alert.alert('Error', 'Please enter a valid phone number');
            return;
        }

        setLoading(true);
        try {
            const identifier = phoneNumber.startsWith('0')
                ? `62${phoneNumber.substring(1)}`
                : phoneNumber;

            await forgotPassword(identifier);
            setIsSubmitted(true);
            Alert.alert(
                'Success',
                'Password reset link has been sent to your registered email. Please check your email.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.push('/auth/login')
                    }
                ]
            );
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        router.push('/auth/login');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ImageBackground style={styles.background}>
                    {/* Tombol Kembali */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBackToLogin}
                        activeOpacity={0.7}
                        disabled={loading || authLoading}
                    >
                        <MaterialIcons name="chevron-left" size={28} color="#2E7D32" />
                    </TouchableOpacity>

                    {/* Header Section */}
                    <View style={styles.headerContainer}>
                        <View style={styles.headerRow}>
                            <Image
                                source={require('../../../assets/images/icon_bspid.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <View>
                                <Text style={styles.title}>
                                    Forgot Password
                                </Text>
                                <Text style={styles.subtitle}>
                                    Nasabah Bank Sampah Pintar
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Forgot Password Panel */}
                    <View style={styles.loginPanel}>
                        <Text style={styles.welcomeTitle}>Forgot Password?</Text>
                        <Text style={styles.welcomeSubtitle}>
                            Enter your phone number to reset your password
                        </Text>

                        {/* Phone Number Input */}
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

                        {/* Info Text */}
                        <View style={styles.infoContainer}>
                            <MaterialIcons name="info-outline" size={16} color="#6B7280" />
                            <Text style={styles.infoText}>
                                We'll send a password reset link to your registered email
                            </Text>
                        </View>

                        {/* Reset Password Button */}
                        <TouchableOpacity
                            style={[styles.resetButton, (loading || authLoading) && styles.disabledButton]}
                            onPress={handleForgotPassword}
                            disabled={loading || authLoading}
                        >
                            {(loading || authLoading) ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.resetButtonText}>Send Reset Link</Text>
                            )}
                        </TouchableOpacity>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Remember your password?</Text>
                            <TouchableOpacity onPress={handleBackToLogin} disabled={loading || authLoading}>
                                <Text style={styles.loginText}> Log In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </KeyboardAvoidingView>
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
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 12,
        marginBottom: 24,
        gap: 8,
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 16,
    },
    resetButton: {
        backgroundColor: '#F68B1E',
        paddingVertical: 16,
        borderRadius: 9999,
        alignItems: 'center',
        marginBottom: 40,
    },
    resetButtonText: {
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
    loginText: {
        color: '#00512c',
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        paddingBottom: 4,
    },
});