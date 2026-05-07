import { View, Text, Dimensions, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');

export default function SettingsScreen() {
    // State for editable fields
    const [whatsapp, setWhatsapp] = useState('081575969200');
    const [email, setEmail] = useState('badakgantengbanget@gmail.com');
    const [isEditingWhatsapp, setIsEditingWhatsapp] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Picture Section */}
                <View style={styles.profileSection}>
                    <View style={styles.profileImageContainer}>
                        <View style={styles.profileImagePlaceholder}>
                            <Text style={styles.profileImageText}>
                                <Ionicons
                                    name={'person'}
                                    size={50}
                                />
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Header */}
                {/* <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile Settings</Text>
                </View> */}

                {/* Profile Settings Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profile Settings</Text>

                    {/* WhatsApp Row */}
                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            <Text style={styles.rowLabel}>WhatsApp</Text>
                            {isEditingWhatsapp ? (
                                <TextInput
                                    style={styles.input}
                                    value={whatsapp}
                                    onChangeText={setWhatsapp}
                                    onBlur={() => setIsEditingWhatsapp(false)}
                                    autoFocus
                                />
                            ) : (
                                <Text style={styles.rowValue}>{whatsapp}</Text>
                            )}
                        </View>
                        <TouchableOpacity onPress={() => setIsEditingWhatsapp(true)}>
                            <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    {/* E-mail Row */}
                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            <Text style={styles.rowLabel}>E-mail</Text>
                            {isEditingEmail ? (
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    onBlur={() => setIsEditingEmail(false)}
                                    autoFocus
                                />
                            ) : (
                                <Text style={styles.rowValue}>{email}</Text>
                            )}
                        </View>
                        <TouchableOpacity onPress={() => setIsEditingEmail(true)}>
                            <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Personal Row */}
                    <TouchableOpacity style={styles.row} onPress={() => { }}>
                        <View style={styles.rowLeft}>
                            <Text style={styles.rowLabel}>Personal</Text>
                            <Text style={styles.rowValue}>Edit</Text>
                        </View>
                        <Text style={styles.chevron}>{'>'}</Text>
                    </TouchableOpacity>

                    {/* Pewaris Row */}
                    <TouchableOpacity style={styles.row} onPress={() => { }}>
                        <View style={styles.rowLeft}>
                            <Text style={styles.rowLabel}>Pewaris</Text>
                            <Text style={styles.rowValue}>Edit</Text>
                        </View>
                        <Text style={styles.chevron}>{'>'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Security Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Security</Text>

                    {/* Update Password Row */}
                    <TouchableOpacity style={styles.row} onPress={() => { }}>
                        <View style={styles.rowLeft}>
                            <Text style={styles.rowLabel}>Update Password</Text>
                            <Text style={styles.rowValue}>Edit</Text>
                        </View>
                        <Text style={styles.chevron}>{'>'}</Text>
                    </TouchableOpacity>

                    {/* PIN Row */}
                    <TouchableOpacity style={styles.row} onPress={() => { }}>
                        <View style={styles.rowLeft}>
                            <Text style={styles.rowLabel}>PIN</Text>
                            <Text style={styles.rowValue}>Edit</Text>
                        </View>
                        <Text style={styles.chevron}>{'>'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5DC',
        paddingHorizontal: 16,
    },
    profileSection: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 50,
    },
    profileImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e1e1e1',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    profileImageText: {
        fontSize: 48,
    },
    // header: {
    //     paddingVertical: 20,
    //     paddingBottom: 16,
    // },
    // headerTitle: {
    //     fontSize: 24,
    //     fontWeight: 'bold',
    //     color: '#000',
    // },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 24,
        overflow: 'hidden',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6c6c70',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5ea',
    },
    rowLeft: {
        flex: 1,
    },
    rowLabel: {
        fontSize: 17,
        fontWeight: '500',
        color: '#000',
        marginBottom: 4,
    },
    rowValue: {
        fontSize: 15,
        color: '#8e8e93',
    },
    editText: {
        fontSize: 15,
        color: '#007aff',
        fontWeight: '500',
    },
    chevron: {
        fontSize: 18,
        color: '#c6c6c8',
        fontWeight: '500',
    },
    input: {
        fontSize: 15,
        color: '#000',
        paddingVertical: 0,
        paddingHorizontal: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#007aff',
        minWidth: 150,
    },
});