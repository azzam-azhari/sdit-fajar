export const STORAGE_BUCKETS = [
  'images',
  'lms-files',
  'registration-files',
  'marketplace-files',
] as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[number];

export interface BucketRule {
  bucket: StorageBucket;
  isPrivate: boolean;
  maxSizeBytes: number;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
}

export const STORAGE_BUCKET_RULES: Record<StorageBucket, BucketRule> = {
  images: {
    bucket: 'images',
    isPrivate: false,
    maxSizeBytes: 5 * 1024 * 1024, // 5 MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  },
  'lms-files': {
    bucket: 'lms-files',
    isPrivate: true,
    maxSizeBytes: 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/webp',
    ],
    allowedExtensions: [
      '.pdf',
      '.doc',
      '.docx',
      '.ppt',
      '.pptx',
      '.xls',
      '.xlsx',
      '.jpg',
      '.jpeg',
      '.png',
      '.webp',
    ],
  },
  'registration-files': {
    bucket: 'registration-files',
    isPrivate: true,
    maxSizeBytes: 5 * 1024 * 1024, // 5 MB
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
  },
  'marketplace-files': {
    bucket: 'marketplace-files',
    isPrivate: true,
    maxSizeBytes: 50 * 1024 * 1024, // 50 MB
    allowedMimeTypes: ['application/pdf', 'application/epub+zip'],
    allowedExtensions: ['.pdf', '.epub'],
  },
};

export const FORBIDDEN_FILE_EXTENSIONS = [
  '.exe',
  '.sh',
  '.bat',
  '.cmd',
  '.js',
  '.php',
  '.html',
  '.htm',
  '.vbs',
  '.bin',
] as const;
