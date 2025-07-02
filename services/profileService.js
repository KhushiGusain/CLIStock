import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_CACHE_KEY = 'user_profile_data';

class ProfileService {
  /**
   * Get user profile data from cache
   * @returns {Promise<Object>} User profile data
   */
  async getProfileData() {
    try {
      const cached = await AsyncStorage.getItem(PROFILE_CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        return data;
      }
      
      // Return default profile data if no cache exists
      return {
        name: 'Khushi Gusain',
        email: 'gusainkhushii@gmail.com',
        profilePhoto: null,
      };
    } catch (error) {
      console.error('❌ [Profile] Error loading profile data:', error);
      return {
        name: 'Khushi Gusain',
        email: 'gusainkhushii@gmail.com',
        profilePhoto: null,
      };
    }
  }

  /**
   * Save user profile data to cache
   * @param {Object} profileData - The profile data to save
   * @returns {Promise<boolean>} Success status
   */
  async saveProfileData(profileData) {
    try {
      await AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profileData));
      console.log('✅ [Profile] Profile data saved successfully');
      return true;
    } catch (error) {
      console.error('❌ [Profile] Error saving profile data:', error);
      return false;
    }
  }

  /**
   * Update specific profile field
   * @param {string} field - Field name to update
   * @param {any} value - New value
   * @returns {Promise<boolean>} Success status
   */
  async updateProfileField(field, value) {
    try {
      const currentData = await this.getProfileData();
      const updatedData = {
        ...currentData,
        [field]: value,
      };
      
      return await this.saveProfileData(updatedData);
    } catch (error) {
      console.error('❌ [Profile] Error updating profile field:', error);
      return false;
    }
  }

  /**
   * Update user name
   * @param {string} name - New user name
   * @returns {Promise<boolean>} Success status
   */
  async updateName(name) {
    return await this.updateProfileField('name', name.trim());
  }

  /**
   * Update profile photo
   * @param {string} photoUri - Photo URI
   * @returns {Promise<boolean>} Success status
   */
  async updateProfilePhoto(photoUri) {
    return await this.updateProfileField('profilePhoto', photoUri);
  }

  /**
   * Clear profile data
   * @returns {Promise<boolean>} Success status
   */
  async clearProfileData() {
    try {
      await AsyncStorage.removeItem(PROFILE_CACHE_KEY);
      console.log('🗑️ [Profile] Profile data cleared successfully');
      return true;
    } catch (error) {
      console.error('❌ [Profile] Error clearing profile data:', error);
      return false;
    }
  }

  /**
   * Get profile info for debugging
   * @returns {Promise<Object>} Profile information
   */
  async getProfileInfo() {
    try {
      const cached = await AsyncStorage.getItem(PROFILE_CACHE_KEY);
      if (!cached) {
        return { exists: false };
      }

      const data = JSON.parse(cached);
      return {
        exists: true,
        data: data,
        hasPhoto: !!data.profilePhoto,
      };
    } catch (error) {
      console.error('❌ [Profile] Error getting profile info:', error);
      return { exists: false, error: error.message };
    }
  }
}

// Export a singleton instance
export default new ProfileService(); 