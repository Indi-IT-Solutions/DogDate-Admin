/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_VERSION: string;
    readonly VITE_NODE_ENV: string;
    readonly VITE_ENABLE_LOGS: string;

    // Admin Auth Endpoints
    readonly VITE_ADMIN_LOGIN_ENDPOINT: string;
    readonly VITE_ADMIN_FORGOT_PASSWORD_ENDPOINT: string;
    readonly VITE_ADMIN_RESET_PASSWORD_ENDPOINT: string;
    readonly VITE_ADMIN_VERIFY_OTP_ENDPOINT: string;

    // Admin Dog Profile Endpoints
    readonly VITE_ADMIN_DOG_PROFILE_APPROVE: string;
    readonly VITE_ADMIN_DOG_PROFILE_REJECT: string;
    readonly VITE_ADMIN_DOG_PROFILE_DELETE: string;

    // User Listing Endpoints
    readonly VITE_USER_ADMIN_LISTING: string;
    readonly VITE_USER_PROFILE_LISTING: string;
    readonly VITE_DOG_LISTING: string;
    readonly VITE_PAYMENT_LISTING: string;
    readonly VITE_REPORT_LISTING: string;
    readonly VITE_CONTACT_LISTING: string;

    // Content Management Endpoints
    readonly VITE_ADMIN_PAGES: string;
    readonly VITE_ADMIN_HOBBIES: string;
    readonly VITE_ADMIN_BREEDS: string;
    readonly VITE_ADMIN_DOG_CHARACTERS: string;
    readonly VITE_ADMIN_DOG_LIKES: string;
    readonly VITE_ADMIN_DOG_AGES: string;
    readonly VITE_ADMIN_MEETUP_AVAILABILITY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
