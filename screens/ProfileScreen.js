import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../ThemeContext';
import profileService from '../services/profileService';

const AVATAR = require('../assets/vectors/avatar.png');

export default function ProfileScreen({ navigation }) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Khushi Gusain',
    email: 'gusainkhushii@gmail.com',
    profilePhoto: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => {
    loadProfileData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfileData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadProfileData = async () => {
    try {
      const data = await profileService.getProfileData();
      setProfileData(data);
      setEditName(data.name);
      setEditEmail(data.email);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfileData = async () => {
    setSaving(true);
    try {
      const success = await profileService.updateName(editName.trim());
      if (success) {
        const newData = {
          ...profileData,
          name: editName.trim(),
        };
        setProfileData(newData);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to save profile data');
      }
    } catch (error) {
      console.error('Error saving profile data:', error);
      Alert.alert('Error', 'Failed to save profile data');
    } finally {
      setSaving(false);
    }
  };

  const saveEmailData = async () => {
    setSaving(true);
    try {
      const success = await profileService.updateProfileField('email', editEmail.trim());
      if (success) {
        const newData = {
          ...profileData,
          email: editEmail.trim(),
        };
        setProfileData(newData);
        setIsEditingEmail(false);
        Alert.alert('Success', 'Email updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to save email');
      }
    } catch (error) {
      console.error('Error saving email data:', error);
      Alert.alert('Error', 'Failed to save email');
    } finally {
      setSaving(false);
    }
  };

  const handleEditPress = () => {
    setIsEditing(true);
    setEditName(profileData.name);
  };

  const handleEditEmailPress = () => {
    setIsEditingEmail(true);
    setEditEmail(profileData.email);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName(profileData.name);
  };

  const handleCancelEmailEdit = () => {
    setIsEditingEmail(false);
    setEditEmail(profileData.email);
  };

  const handleSaveEdit = () => {
    if (editName.trim().length === 0) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    saveProfileData();
  };

  const handleSaveEmailEdit = () => {
    if (editEmail.trim().length === 0) {
      Alert.alert('Error', 'Email cannot be empty');
      return;
    }
    // Basic email validation misc
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmail.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    saveEmailData();
  };

  const handlePhotoChange = () => {
    Alert.alert(
      'Change Profile Photo',
      'This feature will be implemented in a future update. For now, you can edit your name.',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#11B981" />
          <Text style={{ color: theme.text, marginTop: 16 }}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.card,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: theme.text,
          fontFamily: 'NotoSans_Condensed-Bold',
        }}>
          Profile
        </Text>
        
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* DISCLAIMER SECTION */}
        <View style={{
          backgroundColor: '#FFF3CD',
          borderWidth: 1,
          borderColor: '#FFEAA7',
          borderRadius: 12,
          margin: 20,
          padding: 16,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Ionicons name="information-circle" size={24} color="#856404" style={{ marginRight: 12, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#856404',
                marginBottom: 8,
                fontFamily: 'NotoSans_Condensed-Bold',
              }}>
                Demo Profile Page
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#856404',
                lineHeight: 20,
                fontFamily: 'NotoSans-Regular',
              }}>
                This is a demonstration profile page showcasing the app's UI/UX capabilities. Profile data is stored locally and will persist between app sessions. The profile photo feature is planned for future implementation.
              </Text>
            </View>
          </View>
        </View>

        {/* PROFILE PHOTO SECTION */}
        <View style={{ alignItems: 'center', paddingVertical: 32 }}>
          <TouchableOpacity onPress={handlePhotoChange} style={{ position: 'relative' }}>
            <Image
              source={profileData.profilePhoto ? { uri: profileData.profilePhoto } : AVATAR}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 4,
                borderColor: theme.border,
              }}
            />
            <View style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#11B981',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 3,
              borderColor: theme.background,
            }}>
              <Ionicons name="camera" size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.text,
            marginTop: 16,
            fontFamily: 'NotoSans_Condensed-Bold',
          }}>
            {profileData.name}
          </Text>
          
          <Text style={{
            fontSize: 16,
            color: theme.secondaryText,
            marginTop: 4,
            fontFamily: 'NotoSans-Regular',
          }}>
            {profileData.email}
          </Text>
        </View>

        {/* PROFILE INFORMATION */}
        <View style={{ paddingHorizontal: 20 }}>
          {/* NAME SECTION */}
          <View style={{
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: theme.border,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: theme.text,
                fontFamily: 'NotoSans_Condensed-Medium',
              }}>
                Full Name
              </Text>
              {!isEditing && (
                <TouchableOpacity onPress={handleEditPress}>
                  <Ionicons name="pencil" size={20} color="#11B981" />
                </TouchableOpacity>
              )}
            </View>
            
            {isEditing ? (
              <View>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  style={{
                    fontSize: 16,
                    color: theme.text,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    backgroundColor: theme.input,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.border,
                    fontFamily: 'NotoSans-Regular',
                  }}
                  placeholder="Enter your name"
                  placeholderTextColor={theme.secondaryText}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 8 }}>
                  <TouchableOpacity
                    onPress={handleCancelEdit}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: theme.border,
                    }}
                  >
                    <Text style={{ color: theme.secondaryText, fontSize: 14 }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveEdit}
                    disabled={saving}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 8,
                      backgroundColor: '#11B981',
                    }}
                  >
                    {saving ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text style={{
                fontSize: 16,
                color: theme.text,
                fontFamily: 'NotoSans-Regular',
              }}>
                {profileData.name}
              </Text>
            )}
          </View>

          {/* EMAIL SECTION */}
          <View style={{
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: theme.border,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: theme.text,
                fontFamily: 'NotoSans_Condensed-Medium',
              }}>
                Email Address
              </Text>
              {!isEditingEmail && (
                <TouchableOpacity onPress={handleEditEmailPress}>
                  <Ionicons name="pencil" size={20} color="#11B981" />
                </TouchableOpacity>
              )}
            </View>
            
            {isEditingEmail ? (
              <View>
                <TextInput
                  value={editEmail}
                  onChangeText={setEditEmail}
                  style={{
                    fontSize: 16,
                    color: theme.text,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    backgroundColor: theme.input,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.border,
                    fontFamily: 'NotoSans-Regular',
                  }}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.secondaryText}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 8 }}>
                  <TouchableOpacity
                    onPress={handleCancelEmailEdit}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: theme.border,
                    }}
                  >
                    <Text style={{ color: theme.secondaryText, fontSize: 14 }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveEmailEdit}
                    disabled={saving}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 8,
                      backgroundColor: '#11B981',
                    }}
                  >
                    {saving ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text style={{
                fontSize: 16,
                color: theme.text,
                fontFamily: 'NotoSans-Regular',
              }}>
                {profileData.email}
              </Text>
            )}
          </View>

          {/* SETTINGS SECTION */}
          <View style={{
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: theme.border,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: theme.text,
              marginBottom: 16,
              fontFamily: 'NotoSans_Condensed-Bold',
            }}>
              Settings
            </Text>
            
            <TouchableOpacity style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 12,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="notifications-outline" size={24} color={theme.text} style={{ marginRight: 12 }} />
                <Text style={{
                  fontSize: 16,
                  color: theme.text,
                  fontFamily: 'NotoSans-Regular',
                }}>
                  Notifications
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.secondaryText} />
            </TouchableOpacity>
            
            <TouchableOpacity style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 12,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="shield-outline" size={24} color={theme.text} style={{ marginRight: 12 }} />
                <Text style={{
                  fontSize: 16,
                  color: theme.text,
                  fontFamily: 'NotoSans-Regular',
                }}>
                  Privacy & Security
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.secondaryText} />
            </TouchableOpacity>
            
            <TouchableOpacity style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 12,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="help-circle-outline" size={24} color={theme.text} style={{ marginRight: 12 }} />
                <Text style={{
                  fontSize: 16,
                  color: theme.text,
                  fontFamily: 'NotoSans-Regular',
                }}>
                  Help & Support
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.secondaryText} />
            </TouchableOpacity>
          </View>

          {/* APP INFO SECTION */}
          <View style={{
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 20,
            marginBottom: 32,
            borderWidth: 1,
            borderColor: theme.border,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: theme.text,
              marginBottom: 16,
              fontFamily: 'NotoSans_Condensed-Bold',
            }}>
              App Information
            </Text>
            
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 12,
            }}>
              <Text style={{
                fontSize: 16,
                color: theme.text,
                fontFamily: 'NotoSans-Regular',
              }}>
                Version
              </Text>
              <Text style={{
                fontSize: 16,
                color: theme.secondaryText,
                fontFamily: 'NotoSans-Regular',
              }}>
                1.0.0
              </Text>
            </View>
            
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 12,
            }}>
              <Text style={{
                fontSize: 16,
                color: theme.text,
                fontFamily: 'NotoSans-Regular',
              }}>
                Build
              </Text>
              <Text style={{
                fontSize: 16,
                color: theme.secondaryText,
                fontFamily: 'NotoSans-Regular',
              }}>
                2024.1
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 