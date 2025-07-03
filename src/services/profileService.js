import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_CACHE_KEY = 'user_profile_data';

class ProfileService {
  /**
   * @returns {Promise<Object>} USER PROFILE DATA
   */
  async getProfileData() {
    try {
      const cached = await AsyncStorage.getItem(PROFILE_CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        return data;
      }
      
      // DEFAULT PROFILE DATA
      return {
        name: 'Khushi Gusain',
        email: 'gusainkhushii@gmail.com',
        profilePhoto: null,
      };
    } catch (error) {
      console.error(' [Profile] Error loading profile data:', error);
      return {
        name: 'Khushi Gusain',
        email: 'gusainkhushii@gmail.com',
        profilePhoto: null,
      };
    }
  }

  /**
   * @param {Object} profileData - PROFILE DATA TO SAVE
   * @returns {Promise<boolean>} Success status
   */
  async saveProfileData(profileData) {
    try {
      await AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profileData));
      console.log(' [Profile] Profile data saved successfully');
      return true;
    } catch (error) {
      console.error('[Profile] Error saving profile data:', error);
      return false;
    }
  }

  /**
   * @param {string} field - FIELD NAME TO UPDATE
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
      console.error(' [Profile] Error updating profile field:', error);
      return false;
    }
  }

  /**
   * @param {string} name - NEW USER NAME
   * @returns {Promise<boolean>} Success status
   */
  async updateName(name) {
    return await this.updateProfileField('name', name.trim());
  }

  /**
   * @param {string} photoUri - PHOTO URI
   * @returns {Promise<boolean>} Success status
   */
  async updateProfilePhoto(photoUri) {
    return await this.updateProfileField('profilePhoto', photoUri);
  }

  /**
   * @returns {Promise<boolean>} Success status
   */
  async clearProfileData() {
    try {
      await AsyncStorage.removeItem(PROFILE_CACHE_KEY);
      console.log(' [Profile] Profile data cleared successfully');
      return true;
    } catch (error) {
      console.error(' [Profile] Error clearing profile data:', error);
      return false;
    }
  }

  /**
   * @returns {Promise<Object>} PROFILE INFO
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
      console.error(' [Profile] Error getting profile info:', error);
      return { exists: false, error: error.message };
    }
  }
}

// SINGLETON INSTANCE
export default new ProfileService(); 