// API Base Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:3100',
    TIMEOUT: 30000,
};

// Admin Authentication Endpoints
export const AUTH_ENDPOINTS = {
    LOGIN: '/admin/auth_v1/login',
    FORGOT_PASSWORD: '/admin/auth_v1/send_otp_for_forget_pass',
    VERIFY_OTP_AND_RESET: '/admin/auth_v1/verify_otp_and_reset_password',
};

// Admin Dog Profile Management Endpoints
export const DOG_PROFILE_ENDPOINTS = {
    APPROVE: '/admin/dog_profile_v1/approve_profile',
    REJECT: '/admin/dog_profile_v1/reject_profile',
    DELETE: '/admin/dog_profile_v1/delete_entry',
};

// User Management Endpoints
export const USER_ENDPOINTS = {
    LIST: '/common/user/profile_v1',
    GET_BY_ID: (id: string) => `/common/user/profile_v1/${id}`,
    UPDATE: (id: string) => `/common/user/profile_v1/${id}`,
    GET_DOGS: (id: string) => `/common/user/profile_v1/${id}/dogs`,
    GET_CONFIRMED_MATCHES: (id: string) => `/common/user/profile_v1/${id}/matches/confirmed`,
    GET_SENT_REQUESTS: (id: string) => `/common/user/profile_v1/${id}/matches/sent-requests`,
    GET_RECEIVED_REQUESTS: (id: string) => `/common/user/profile_v1/${id}/matches/received-requests`,
    GET_LOST_MATCHES: (id: string) => `/common/user/profile_v1/${id}/matches/lost`,
    GET_PAYMENTS: (id: string) => `/common/user/profile_v1/${id}/payments`,
    UPDATE_STATUS: (id: string) => `/common/user/profile_v1/${id}/status`,
    DELETE: (id: string) => `/common/user/profile_v1/${id}`,
    RESET_PASSWORD: (id: string) => `/common/user/profile_v1/${id}/reset-password`,
    STATS: '/common/user/profile_v1/stats',
};

// Dog Management Endpoints
export const DOG_ENDPOINTS = {
    LIST: '/common/user/dog_v1',
    GET_BY_ID: (id: string) => `/common/user/dog_v1/${id}`,
    UPDATE_STATUS: (id: string) => `/common/user/dog_v1/${id}/status`,
    DELETE: (id: string) => `/common/user/dog_v1/${id}`,
    STATS: '/common/user/dog_v1/stats',
    BREEDING_DATA: (id: string) => `/common/user/dog_v1/${id}/breeding`,
    PLAYDATE_DATA: (id: string) => `/common/user/dog_v1/${id}/playdate`,
};

// Payment Management Endpoints
export const PAYMENT_ENDPOINTS = {
    LIST: '/common/user/payment_v1',
    GET_BY_ID: (id: string) => `/common/user/payment_v1/${id}`,
    STATS: '/common/user/payment_v1/stats',
};

// Report Management Endpoints (Admin)
export const REPORT_ENDPOINTS = {
    LIST: '/admin/report_v1',
    GET_BY_ID: (id: string) => `/admin/report_v1/${id}`,
    UPDATE_STATUS: (id: string) => `/admin/report_v1/${id}/status`,
    DELETE: (id: string) => `/admin/report_v1/${id}`,
    STATS: '/admin/report_v1/stats',
};

// Contact Us Endpoints (Admin)
export const CONTACT_ENDPOINTS = {
    LIST: '/admin/contact_v1',
    GET_BY_ID: (id: string) => `/admin/contact_v1/${id}`,
    REPLY: '/admin/contact_v1/reply',
    UPDATE_STATUS: (id: string) => `/admin/contact_v1/${id}/status`,
    STATS: '/admin/contact_v1/stats',
};

// Content Management Endpoints
export const CONTENT_ENDPOINTS = {
    PAGES: '/admin/page_v1',
    HOBBIES: '/admin/hobbie_v1',
    BREEDS: '/admin/breed_v1',
    DOG_CHARACTERS: '/admin/dog_character_v1',
    DOG_LIKES: '/admin/dog_like_v1',
    DOG_AGES: '/admin/dog_age_v1',
    MEETUP_AVAILABILITY: '/admin/meet_up_availability_v1',
};

// Dropdown/Listing Endpoints
export const DROPDOWN_ENDPOINTS = {
    DOG_REGISTRATION: '/common/user_admin_listing_v1/get_dropdown_list_for_dog_registration',
};

// Dashboard Endpoints
export const DASHBOARD_ENDPOINTS = {
    OVERVIEW: '/admin/dashboard_v1/overview',
    STATS: '/admin/dashboard_v1/stats',
    RECENT_ACTIVITIES: '/admin/dashboard_v1/recent-activities',
    ACCOUNT_REQUESTS: '/admin/dashboard_v1/account-requests',
    APPROVE_ACCOUNT: '/admin/dashboard_v1/approve-account',
    REJECT_ACCOUNT: '/admin/dashboard_v1/reject-account',
    USER_GROWTH: '/admin/dashboard_v1/user-growth',
    REVENUE_DATA: '/admin/dashboard_v1/revenue-data',
};

// AWS S3 Endpoints
export const AWS_ENDPOINTS = {
    GENERATE_PRESIGNED_URL: '/common/aws/s3/generate_presigned_url',
    GENERATE_PRESIGNED_URL_MULTIPLE: '/common/aws/s3/generate_presigned_url_multiple',
};

// Subscription Package Endpoints
export const SUBSCRIPTION_ENDPOINTS = {
    LIST: '/admin/subscription_v1',
    GET_BY_ID: (id: string) => `/admin/subscription_v1/${id}`,
    CREATE: '/admin/subscription_v1',
    UPDATE: (id: string) => `/admin/subscription_v1/${id}`,
    DELETE: (id: string) => `/admin/subscription_v1/${id}`,
    STATS: '/admin/subscription_v1/stats',
};

export const BREED_ENDPOINTS = {
    LIST: '/admin/breed_v1/get_list',
    GET_BY_ID: '/admin/breed_v1/get_specific_entry_details',
    CREATE: '/admin/breed_v1/add',
    UPDATE: '/admin/breed_v1/edit',
    DELETE: '/admin/breed_v1/delete_entry',
};

export const HOBBY_ENDPOINTS = {
    LIST: '/admin/hobbie_v1/get_list',
    GET_BY_ID: '/admin/hobbie_v1/get_specific_entry_details',
    CREATE: '/admin/hobbie_v1/add',
    UPDATE: '/admin/hobbie_v1/edit',
    DELETE: '/admin/hobbie_v1/delete_entry',
};

export const DOG_LIKE_ENDPOINTS = {
    LIST: '/admin/dog_like_v1/get_list',
    GET_BY_ID: '/admin/dog_like_v1/get_specific_entry_details',
    CREATE: '/admin/dog_like_v1/add',
    UPDATE: '/admin/dog_like_v1/edit',
    DELETE: '/admin/dog_like_v1/delete_entry',
};

export const DOG_CHARACTER_ENDPOINTS = {
    LIST: '/admin/dog_character_v1/get_list',
    GET_BY_ID: '/admin/dog_character_v1/get_specific_entry_details',
    CREATE: '/admin/dog_character_v1/add',
    UPDATE: '/admin/dog_character_v1/edit',
    DELETE: '/admin/dog_character_v1/delete_entry',
};

export const PAGE_ENDPOINTS = {
    LIST: '/admin/page_v1/get_list',
    GET_BY_ID: '/admin/page_v1/get_specific_page_details',
    UPDATE: '/admin/page_v1/edit',
};

export const MEETUP_AVAILABILITY_ENDPOINTS = {
    LIST: '/admin/meet_up_availability_v1/get_list',
    GET_BY_ID: '/admin/meet_up_availability_v1/get_specific_entry_details',
    CREATE: '/admin/meet_up_availability_v1/add',
    UPDATE: '/admin/meet_up_availability_v1/edit',
    DELETE: '/admin/meet_up_availability_v1/delete_entry',
};

export const FAQ_ENDPOINTS = {
    LIST: '/admin/faq_v1',
    GET_BY_ID: (id: string) => `/admin/faq_v1/${id}`,
    CREATE: '/admin/faq_v1',
    UPDATE: (id: string) => `/admin/faq_v1/${id}`,
    DELETE: (id: string) => `/admin/faq_v1/${id}`,
    STATS: '/admin/faq_v1/stats',
};

export const PROFILE_ENDPOINTS = {
    GET_PROFILE: '/admin/profile_v1',
    UPDATE_PROFILE: '/admin/profile_v1',
    CHANGE_PASSWORD: '/admin/profile_v1/change-password',
}; 