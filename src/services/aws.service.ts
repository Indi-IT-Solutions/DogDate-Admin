import { apiClient } from './api.config';
import { AWS_ENDPOINTS } from '../config/api.endpoints';
import type { ApiResponse } from '../types/api.types';

export interface PresignedUrlRequest {
    file_name: string;
    file_type: string;
}

export interface PresignedUrlResponse {
    presignedUrl: string;
    fileUrl: string;
}

export interface MultiplePresignedUrlRequest {
    files: PresignedUrlRequest[];
}

export interface MultiplePresignedUrlResponse {
    files: Array<{
        file_name: string;
        file_type: string;
        presignedUrl: string;
        fileUrl: string;
    }>;
}

export class AWSService {
    // Generate presigned URL for single file upload
    static async generatePresignedUrl(request: PresignedUrlRequest): Promise<ApiResponse<PresignedUrlResponse>> {
        try {
            const response = await apiClient.post(AWS_ENDPOINTS.GENERATE_PRESIGNED_URL, request);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Generate presigned URLs for multiple file uploads
    static async generateMultiplePresignedUrls(request: MultiplePresignedUrlRequest): Promise<ApiResponse<MultiplePresignedUrlResponse>> {
        try {
            const response = await apiClient.post(AWS_ENDPOINTS.GENERATE_PRESIGNED_URL_MULTIPLE, request);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    }

    // Upload file to S3 using presigned URL
    static async uploadFileToS3(presignedUrl: string, file: File): Promise<void> {
        try {
            await fetch(presignedUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });
        } catch (error: any) {
            throw new Error(`Failed to upload file to S3: ${error.message}`);
        }
    }

    // Upload multiple files to S3
    static async uploadMultipleFilesToS3(files: Array<{ presignedUrl: string; file: File }>): Promise<void> {
        try {
            const uploadPromises = files.map(({ presignedUrl, file }) =>
                this.uploadFileToS3(presignedUrl, file)
            );
            await Promise.all(uploadPromises);
        } catch (error: any) {
            throw new Error(`Failed to upload files to S3: ${error.message}`);
        }
    }
}
