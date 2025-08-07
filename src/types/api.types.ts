// Common API Response Types
export interface ApiResponse<T = any> {
    status: number; // 1 for success, 0 for error
    message: string;
    data?: T;
    error?: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
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
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

export interface DogLike {
    _id: string;
    name: string;
    description?: string;
    status: 'active' | 'inactive';
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
    purchased_plan_id: string;
    payment_method: 'stripe' | 'apple_pay' | 'google_pay';
    amount: number;
    currency: string;
    payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
    payment_date: string;
    created_at: string;
    updated_at: string;
}

// Report Types
export interface Report {
    _id: string;
    reported_by: string;
    reported_user: string;
    reported_dog?: string;
    reason: string;
    description: string;
    status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
    created_at: string;
    updated_at: string;
}

// Contact Us Types
export interface ContactUs {
    _id: string;
    user_id?: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'pending' | 'replied' | 'resolved';
    created_at: string;
    updated_at: string;
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