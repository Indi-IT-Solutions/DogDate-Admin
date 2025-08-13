// Common API Response Types
export interface ApiResponse<T = any> {
    status: number; // 1 for success, 0 for error
    message: string;
    data?: T;
    error?: string;
}

export interface PaginationMeta {
    current_page: number;
    total_pages: number;
    total_payments?: number;
    total_users?: number;
    total_dogs?: number;
    total?: number;
    per_page: number;
    has_next_page: boolean;
    has_prev_page: boolean;
    page: number;
    limit: number;
    totalPages: number;
    total_queries?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    meta: PaginationMeta;
}

// Admin User Types
export interface AdminUser {
    _id: string;
    name: string;
    role: 'admin' | 'super_admin';
    email: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
    profile_image: string | null;
    __v?: number;
}

export interface AdminLoginRequest {
    email: string;
    password: string;
}

export interface AdminLoginResponse {
    token: string;
    user_details: AdminUser;
}

// User Types
export interface User {
    _id: string;
    uuid: string;
    email: string;
    register_type: 'normal' | 'google' | 'apple';
    social_auth_id?: string;
    device_token?: string;
    country_code?: string;
    phone_number?: number;
    name: string;
    age?: string;
    gender?: 'male' | 'female' | 'other';
    location: {
        type: string;
        coordinates: [number, number]; // [longitude, latitude]
    };
    address: {
        full_address: string;
        city: string;
        country: string;
        pin: string;
        partial_code: string;
    };
    hobbies: string[];
    about: string;
    meetup_availability: string[];
    submit_personal_details: boolean;
    blocked_users: string[];
    registration_priority_status: 'not_selected' | 'selected' | 'completed';
    email_notifications: boolean;
    push_notifications: boolean;
    status: 'active' | 'inactive' | 'blocked' | 'deleted';
    terms_and_conditions: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

// Dog Types
export interface Dog {
    _id: string;
    user_id: User | string;
    profile_type: 'dating' | 'breeding' | 'both';
    dog_name: string;
    breed: Breed | string;
    gender: 'male' | 'female';
    age: number;
    colour: string;
    character: DogCharacter[] | string[];
    personality: string;
    dog_likes: DogLike[] | string[];
    dog_date_tagline: string;
    favorite_dog_treat: string;
    breeding_price: number;
    available_for_breeding: boolean;
    breed_classification: 'purebred' | 'mixed';
    profile_status: 'submitted' | 'approved' | 'rejected';
    status: 'active' | 'inactive';
    registration_priority_status: 'not_selected' | 'selected' | 'completed';
    profile_picture?: {
        file_path: string;
        file_type: string;
        file_hash: string;
    } | null;
    pictures?: Array<{
        file_path: string;
        file_type: string;
        file_hash: string;
    }>;
    video?: {
        file_path: string;
        file_type: string;
        file_hash: string;
    } | null;
    thumbnail?: {
        file_path: string;
        file_type: string;
        file_hash: string;
    } | null;
    health_document?: Array<{
        title: string;
        file_path: string;
        file_type: string;
        file_hash: string;
    }>;
    pedigree?: Array<{
        title: string;
        file_path: string;
        file_type: string;
        file_hash: string;
    }>;
    breed_certification?: {
        file_path: string;
        file_type: string;
        file_hash: string;
    } | null;
    vaccination_certification?: {
        file_path: string;
        file_type: string;
        file_hash: string;
    } | null;
    flea_documents?: {
        file_path: string;
        file_type: string;
        file_hash: string;
    } | null;
    user_details?: {
        name: string;
        email: string;
        phone_number?: number;
        address?: any;
    };
    created_at: string;
    updated_at: string;
}

// Content Management Types
export interface Breed {
    _id: string;
    name: string;
    description?: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

export interface DogCharacter {
    _id: string;
    name: string;
    description?: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

export interface Hobby {
    _id: string;
    name: string;
    description?: string;
    status: 'active' | 'inactive' | 'deleted';
    created_at: string;
    updated_at: string;
}

export interface DogLike {
    _id: string;
    name: string;
    description?: string;
    status: 'active' | 'inactive' | 'deleted';
    created_at: string;
    updated_at: string;
}

export interface DogAge {
    _id: string;
    name: string;
    min_age: number;
    max_age: number;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

export interface MeetupAvailability {
    _id: string;
    name: string;
    description?: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

// Payment Types
export interface PaymentHistory {
    _id: string;
    user_id: string;
    relation_id?: string;
    relation_with: 'dog_profile_express_registeration' | 'one_time_payment_for_match' | 'subscription_for_match' | 'subscription_renewal_for_match' | 'use_of_redeemable_coins_for_match_to_enable_chat' | 'use_of_playdate_premium_paws_subscription_for_match_to_enable_chat';
    transaction_id: string;
    iap_signed_date: string;
    purchase_id?: string;
    payment_region: string;
    payment_region_id: string;
    transaction_type: 'Consumable' | 'Auto-Renewable Subscription' | 'use_of_redeemable_coins_for_match_to_enable_chat' | 'use_of_playdate_premium_paws_subscription_for_match_to_enable_chat';
    iap_product_id?: string;
    paid_price: number;
    payment_time: string;
    payment_platform: 'ios_iap' | 'android_iap';
    refund_reference_payment_id?: string;
    product_details?: any;
    status: 'paid' | 'skipped';
    refund_reason?: string;
    created_at: string;
    user_details?: {
        name: string;
        email: string;
        phone_number?: number;
        address?: any;
    };
    dog_details?: {
        dog_name: string;
        breed: string;
        profile_type: 'dating' | 'breeding' | 'both';
        gender?: 'male' | 'female';
        age?: number;
        profile_picture?: {
            file_path: string;
            file_type: string;
            file_hash: string;
        };
    };
}

export interface PaymentFilters extends PaginationRequest {
    status?: 'paid' | 'skipped';
    payment_platform?: 'ios_iap' | 'android_iap';
    relation_with?: string;
    transaction_type?: string;
    from_date?: string;
    to_date?: string;
}

export interface PaymentStats {
    total_payments: number;
    paid_payments: number;
    skipped_payments: number;
    payment_platforms: {
        ios: number;
        android: number;
    };
    transaction_types: {
        consumable: number;
        subscription: number;
    };
    new_payments_last_30_days: number;
    total_revenue: number;
    revenue_last_month: number;
}

export interface SubscriptionPackage {
    _id: string;
    type: "Breeding" | "Playmates";
    title: string;
    amount: number;
    interval: "One time" | "Monthly" | "Yearly";
    matches: string;
    features: string[];
    iap_product_id: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface SubscriptionFilters {
    page?: number;
    limit?: number;
    search?: string;
    type?: "Breeding" | "Playmates";
    interval?: "One time" | "Monthly" | "Yearly";
    is_active?: boolean;
}

export interface SubscriptionStats {
    total_packages: number;
    active_packages: number;
    inactive_packages: number;
    package_types: {
        breeding: number;
        playmates: number;
    };
    intervals: {
        one_time: number;
        monthly: number;
        yearly: number;
    };
    total_value: number;
}

export interface ContactFilters {
    page?: number;
    limit?: number;
    search?: string;
    query_status?: "pending" | "replied" | "resolved";
    status?: "active" | "inactive";
}

export interface ContactStats {
    total_queries: number;
    pending_queries: number;
    replied_queries: number;
    resolved_queries: number;
    active_queries: number;
    inactive_queries: number;
}

export interface SendContactReply {
    contact_id: string;
    reply_message: string;
    admin_name: string;
}

export interface ReportFilters {
    page?: number;
    limit?: number;
    search?: string;
    action?: "pending" | "processed";
    status?: "active" | "deleted";
}

export interface ReportStats {
    total_reports: number;
    pending_reports: number;
    processed_reports: number;
    active_reports: number;
    deleted_reports: number;
}

// Dog Breed Types
export interface DogBreed {
    _id: string;
    name: string;
    status: "active" | "inactive" | "deleted";
    created_at: string;
}

export interface DogBreedFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: "active" | "inactive" | "deleted";
}

export interface HobbyFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: "active" | "inactive" | "deleted";
}

export interface DogLikeFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: "active" | "inactive" | "deleted";
}

export interface DogCharacterFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: "active" | "inactive" | "deleted";
}

// Page Types
export interface Page {
    _id: string;
    title: "About Us" | "Terms & Conditions" | "Privacy Policy" | "FAQ's";
    description: string | any;
    identity_number: number;
    created_at: string;
}

export interface PageFilters {
    search?: string;
}

// FAQ Types
export interface FAQ {
    _id: string;
    order: number;
    question: string;
    answer: string;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
}

export interface FAQFilters {
    search?: string;
    status?: "active" | "inactive";
}

export interface FAQStats {
    total_faqs: number;
    active_faqs: number;
    inactive_faqs: number;
}

// Admin Profile Types
export interface AdminProfile {
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface UpdateProfileData {
    name?: string;
    email?: string;
}

export interface ChangePasswordData {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

// Report Types
export interface Report {
    _id: string;
    report_from: string | User;
    report_against: string | User;
    message: string;
    action: "pending" | "processed";
    status: "active" | "deleted";
    created_at: string;
}

// Contact Us Types
export interface ContactUs {
    _id: string;
    user_id: string | User;
    name: string;
    email: string;
    country_code: string;
    phone_number: number | null;
    query: string;
    query_status: "pending" | "replied" | "resolved";
    status: "active" | "inactive";
    created_at: string;
    updated_at?: string;
}

// Dashboard Types
export interface DashboardStats {
    total_users: number;
    total_dogs: number;
    total_active_users: number;
    total_inactive_users: number;
    total_approved_dogs: number;
    total_pending_dogs: number;
    breedings_completed: number;
    playmates_completed: number;
    total_revenue: number;
    recent_registrations: User[];
    recent_dog_registrations: Dog[];
}

// Account Request Types
export interface AccountRequest {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
        phone_number?: number;
        country_code?: string;
        profile_image?: string;
        created_at: string;
    };
    dog: {
        _id: string;
        dog_name: string;
        breed: string;
        profile_type: 'dating' | 'breeding' | 'both';
        profile_status: 'submitted' | 'approved' | 'rejected';
        dog_images?: string[];
    };
    plan?: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

// Chart Data Types
export interface UserGrowthData {
    month: string;
    users: number;
    dogs: number;
}

export interface RevenueData {
    month: string;
    income: number;
    subscriptions: number;
    total_transactions: number;
}

// Dashboard Overview Response
export interface DashboardOverview {
    stats: DashboardStats;
    account_requests: AccountRequest[];
    user_growth: UserGrowthData[];
    revenue_data: RevenueData[];
    recent_activities: any[];
}

// Request Types for Dog Profile Management
export interface ApproveRejectDogRequest {
    dog_id: string;
    admin_id: string;
    remarks?: string;
}

export interface DeleteDogRequest {
    dog_id: string;
    admin_id: string;
    reason?: string;
}

// Pagination Request
export interface PaginationRequest {
    page?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

// Filter Types
export interface UserFilters extends PaginationRequest {
    status?: 'active' | 'inactive' | 'blocked';
    register_type?: 'normal' | 'google' | 'apple';
    from_date?: string;
    to_date?: string;
}

export interface DogFilters extends PaginationRequest {
    profile_status?: 'submitted' | 'approved' | 'rejected';
    profile_type?: 'dating' | 'breeding' | 'both';
    breed_id?: string;
    gender?: 'male' | 'female';
}

// Auth Types
export interface ForgotPasswordRequest {
    email: string;
}

export interface VerifyOtpRequest {
    email: string;
    otp: string;
}

export interface ResetPasswordRequest {
    email: string;
    otp: string;
    new_password: string;
    confirm_password: string;
} 