export interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
  [key: string]: any;
}

export interface formData {
    file: File | null,
    title: string,
    description: string,
}