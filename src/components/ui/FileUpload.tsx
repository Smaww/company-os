"use client";

import { useState, useRef, useCallback } from "react";
import { 
  Upload, 
  X, 
  File, 
  FileText, 
  FileImage, 
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { appConfig } from "@/lib/config";
import type { UploadedFile } from "@/contexts/DataContext";

// ========================================
// FILE UPLOAD COMPONENT
// Drag & Drop file upload with preview
// ========================================

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  label?: string;
  description?: string;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
}

const fileTypeIcons: Record<string, typeof File> = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  jpg: FileImage,
  jpeg: FileImage,
  png: FileImage,
  gif: FileImage,
  webp: FileImage,
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  return fileTypeIcons[ext] || File;
}

export function FileUpload({
  accept = "*/*",
  multiple = false,
  maxSize = 10, // 10MB default
  label = "اسحب الملفات هنا أو انقر للاختيار",
  description = "PDF, Word, Excel, Images",
  files,
  onFilesChange,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    
    setError(null);
    const newFiles: UploadedFile[] = [];
    
    Array.from(fileList).forEach((file) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`الملف ${file.name} أكبر من ${maxSize}MB`);
        return;
      }
      
      // Create object URL for preview
      const url = URL.createObjectURL(file);
      
      newFiles.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: url,
        uploadedAt: new Date().toISOString(),
      });
    });
    
    if (multiple) {
      onFilesChange([...files, ...newFiles]);
    } else {
      // Clean up old URLs
      files.forEach(f => URL.revokeObjectURL(f.url));
      onFilesChange(newFiles.slice(0, 1));
    }
  }, [files, maxSize, multiple, onFilesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [processFiles]);

  const removeFile = useCallback((id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      URL.revokeObjectURL(file.url);
    }
    onFilesChange(files.filter(f => f.id !== id));
  }, [files, onFilesChange]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-8
          flex flex-col items-center justify-center text-center
          cursor-pointer transition-all duration-300
          ${isDragging 
            ? "border-green-500 bg-green-50" 
            : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center mb-4
          transition-all duration-300
          ${isDragging ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}
        `}>
          <Upload className="w-8 h-8" />
        </div>

        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        <p className="text-sm text-gray-400">{description}</p>
        <p className="text-xs text-gray-400 mt-2">الحد الأقصى: {maxSize}MB</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => {
            const FileIcon = getFileIcon(file.name);
            
            return (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 group"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <FileIcon className="w-5 h-5 text-gray-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                </div>

                {/* Status */}
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />

                {/* Remove */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ========================================
// IMAGE UPLOAD VARIANT
// For profile photos with preview
// ========================================

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (file: UploadedFile | null) => void;
}

export function ImageUpload({ currentImage, onImageChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    
    onImageChange({
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: url,
      uploadedAt: new Date().toISOString(),
    });
  };

  const handleRemove = () => {
    if (preview && preview !== currentImage) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onImageChange(null);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Preview */}
      <div 
        onClick={() => inputRef.current?.click()}
        className={`
          w-20 h-20 rounded-2xl overflow-hidden cursor-pointer
          flex items-center justify-center
          border-2 border-dashed border-gray-200 hover:border-gray-400
          transition-all duration-300
          ${preview ? "" : "bg-gray-50"}
        `}
      >
        {preview ? (
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
        ) : (
          <Upload className="w-6 h-6 text-gray-400" />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {/* Actions */}
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          {preview ? "تغيير الصورة" : "رفع صورة"}
        </button>
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="block text-sm text-red-500 hover:text-red-700"
          >
            إزالة
          </button>
        )}
      </div>
    </div>
  );
}
