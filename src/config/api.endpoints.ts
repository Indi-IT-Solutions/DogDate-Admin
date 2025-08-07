// API Base Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3100',
    TIMEOUT: 30000,
};

// Admin Authentication Endpoints
export const AUTH_ENDPOINTS = {
    LOGIN: '/admin/auth_v1/login',
    FORGOT_PASSWORD: '/admin/auth_v1/send_otp_for_forget_pass',
    VERIFY_OTP: '/admin/auth_v1/confirm_forget_password_otp',
    RESET_PASSWORD: '/admin/auth_v1/create_new_password',
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
    GET_DOGS: (id: string) => `/common/user/profile_v1/${id}/dogs`,
    GET_CONFIRMED_MATCHES: (id: string) => `/common/user/profile_v1/${id}/matches/confirmed`,
    GET_SENT_REQUESTS: (id: string) => `/common/user/profile_v1/${id}/matches/sent-requests`,
    GET_RECEIVED_REQUESTS: (id: string) => `/common/user/profile_v1/${id}/matches/received-requests`,
    GET_LOST_MATCHES: (id: string) => `/common/user/profile_v1/${id}/matches/lost`,
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
};

// Payment Management Endpoints
export const PAYMENT_ENDPOINTS = {
    LIST: '/common/user/payment',
    GET_BY_ID: (id: string) => `/common/user/payment/${id}`,
    STATS: '/common/user/payment/stats',
};

// Report Management Endpoints
export const REPORT_ENDPOINTS = {
    LIST: '/common/user/report_v1',
    GET_BY_ID: (id: string) => `/common/user/report_v1/${id}`,
    UPDATE_STATUS: (id: string) => `/common/user/report_v1/${id}/status`,
    DELETE: (id: string) => `/common/user/report_v1/${id}`,
};

// Contact Us Endpoints
export const CONTACT_ENDPOINTS = {
    LIST: '/common/user/support_v1',
    GET_BY_ID: (id: string) => `/common/user/support_v1/${id}`,
    UPDATE_STATUS: (id: string) => `/common/user/support_v1/${id}/status`,
    REPLY: (id: string) => `/common/user/support_v1/${id}/reply`,
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