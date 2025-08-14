import { API_CONFIG } from '@/config/api.endpoints';
import { IMAGES } from '@/contants/images';

export const getProfileImageUrl = (profilePicture: any): string => {
    if (!profilePicture) {
        return IMAGES.Avatar1; // Fallback to default avatar
    }

    // If it's already a string (direct URL), return it
    if (typeof profilePicture === 'string') {
        return profilePicture;
    }

    // If it's an object with file_path
    if (profilePicture.file_path) {
        let imageUrl: string;

        // If the file_path is already a full URL, return it as is
        if (profilePicture.file_path.startsWith('http://') || profilePicture.file_path.startsWith('https://')) {
            imageUrl = profilePicture.file_path;
        } else {
            // Construct the full URL using the base URL
            imageUrl = `${API_CONFIG.BASE_URL}${profilePicture.file_path}`;
        }

        return imageUrl;
    }

    // If it's an object with different structure, try to find the path
    if (profilePicture.path || profilePicture.url || profilePicture.src) {
        const imageUrl = profilePicture.path || profilePicture.url || profilePicture.src;
        return imageUrl;
    }

    return IMAGES.Avatar1; // Fallback to default avatar
};

// Enhanced function to check for profile image in user object
export const getUserProfileImage = (user: any): string => {
    if (!user) {
        return IMAGES.Avatar1;
    }

    // Check multiple possible field names
    const possibleFields = [
        'profile_picture',
        'profile_image',
        'avatar',
        'image',
        'photo',
        'picture'
    ];

    for (const field of possibleFields) {
        if (user[field]) {
            return getProfileImageUrl(user[field]);
        }
    }

    return IMAGES.Avatar1;
};

// Enhanced function to check for profile image in dog object
export const getDogProfileImage = (dog: any): string => {
    if (!dog) {
        return IMAGES.Avatar1; // You might want to use a different default image for dogs
    }

    // Check multiple possible field names
    const possibleFields = [
        'profile_picture',
        'profile_image',
        'avatar',
        'image',
        'photo',
        'picture'
    ];

    for (const field of possibleFields) {
        if (dog[field]) {
            return getProfileImageUrl(dog[field]);
        }
    }

    return IMAGES.Avatar1; // You might want to use a different default image for dogs
};
