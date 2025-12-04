"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2, User } from "lucide-react";
import { toast } from "sonner";

interface CloudinaryImageUploadProps {
  currentImageUrl?: string;
  onUploadSuccess: (url: string) => void;
  buttonText?: string;
  disabled?: boolean;
}

export default function CloudinaryImageUpload({
  currentImageUrl,
  onUploadSuccess,
  buttonText = "Upload Profile Image",
  disabled = false,
}: CloudinaryImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Image Preview */}
      <Avatar className="h-24 w-24">
        <AvatarImage src={currentImageUrl} alt="Profile" />
        <AvatarFallback>
          <User className="h-12 w-12" />
        </AvatarFallback>
      </Avatar>

      {/* Upload Widget */}
      <CldUploadWidget
        uploadPreset="WorkBond"
        options={{
          maxFiles: 1,
          maxFileSize: 10000000, // 10MB
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          sources: ["local", "camera"],
        }}
        onSuccess={(result: any) => {
          setIsUploading(false);
          if (result?.info?.secure_url) {
            onUploadSuccess(result.info.secure_url);
            toast.success("Image uploaded successfully!");
          }
        }}
        onError={(error: any) => {
          setIsUploading(false);
          console.error("Upload error:", error);
          toast.error("Failed to upload image. Please try again.");
        }}
        onOpen={() => setIsUploading(true)}
        onClose={() => setIsUploading(false)}
      >
        {({ open }) => (
          <Button
            type="button"
            variant="outline"
            onClick={() => open()}
            disabled={disabled || isUploading}
            className="w-full max-w-xs"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {buttonText}
              </>
            )}
          </Button>
        )}
      </CldUploadWidget>

      {currentImageUrl && (
        <p className="text-xs text-muted-foreground">
          Click to upload a new image
        </p>
      )}
    </div>
  );
}
