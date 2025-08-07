export const ENV_CONFIG = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    APP_NAME: import.meta.env.VITE_APP_NAME || 'DogDate Admin',
    APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
    ENABLE_LOGS: import.meta.env.VITE_ENABLE_LOGS === 'true',

    // Admin Auth Endpoints
    ADMIN_LOGIN_ENDPOINT: import.meta.env.VITE_ADMIN_LOGIN_ENDPOINT || '/admin/auth_v1/login',
    ADMIN_FORGOT_PASSWORD_ENDPOINT: import.meta.env.VITE_ADMIN_FORGOT_PASSWORD_ENDPOINT || '/admin/auth_v1/send_otp_for_forget_pass',
    ADMIN_RESET_PASSWORD_ENDPOINT: import.meta.env.VITE_ADMIN_RESET_PASSWORD_ENDPOINT || '/admin/auth_v1/create_new_password',
    ADMIN_VERIFY_OTP_ENDPOINT: import.meta.env.VITE_ADMIN_VERIFY_OTP_ENDPOINT || '/admin/auth_v1/confirm_forget_password_otp',

    // Admin Dog Profile Endpoints
    ADMIN_DOG_PROFILE_APPROVE: import.meta.env.VITE_ADMIN_DOG_PROFILE_APPROVE || '/admin/dog_profile_v1/approve_profile',
    ADMIN_DOG_PROFILE_REJECT: import.meta.env.VITE_ADMIN_DOG_PROFILE_REJECT || '/admin/dog_profile_v1/reject_profile',
    ADMIN_DOG_PROFILE_DELETE: import.meta.env.VITE_ADMIN_DOG_PROFILE_DELETE || '/admin/dog_profile_v1/delete_entry',

    // User Listing Endpoints for Admin
    USER_ADMIN_LISTING: import.meta.env.VITE_USER_ADMIN_LISTING || '/common/user_admin_listing_v1/get_dropdown_list_for_dog_registration',
    USER_PROFILE_LISTING: import.meta.env.VITE_USER_PROFILE_LISTING || '/common/user/profile_v1',
    DOG_LISTING: import.meta.env.VITE_DOG_LISTING || '/common/user/dog_v1',
    PAYMENT_LISTING: import.meta.env.VITE_PAYMENT_LISTING || '/common/user/payment',
    REPORT_LISTING: import.meta.env.VITE_REPORT_LISTING || '/common/user/report_v1',
    CONTACT_LISTING: import.meta.env.VITE_CONTACT_LISTING || '/common/user/support_v1',

    // Content Management Endpoints
    ADMIN_PAGES: import.meta.env.VITE_ADMIN_PAGES || '/admin/page_v1',
    ADMIN_HOBBIES: import.meta.env.VITE_ADMIN_HOBBIES || '/admin/hobbie_v1',
    ADMIN_BREEDS: import.meta.env.VITE_ADMIN_BREEDS || '/admin/breed_v1',
    ADMIN_DOG_CHARACTERS: import.meta.env.VITE_ADMIN_DOG_CHARACTERS || '/admin/dog_character_v1',
    ADMIN_DOG_LIKES: import.meta.env.VITE_ADMIN_DOG_LIKES || '/admin/dog_like_v1',
    ADMIN_DOG_AGES: import.meta.env.VITE_ADMIN_DOG_AGES || '/admin/dog_age_v1',
    ADMIN_MEETUP_AVAILABILITY: import.meta.env.VITE_ADMIN_MEETUP_AVAILABILITY || '/admin/meet_up_availability_v1',
} as const;

export default ENV_CONFIG; 