import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CldUploadWidget } from "next-cloudinary";
import { Upload, X } from "lucide-react";

interface UploadBoxProps {
  label: string;
  value: string;
  onUpload: (url: string) => void;
  onClear: () => void;
}

export function UploadBox({ label, value, onUpload, onClear }: UploadBoxProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors relative min-h-[200px] flex flex-col items-center justify-center">
        {value ? (
          <div className="relative w-full h-full">
            <img
              src={value}
              alt={label}
              className="max-h-[200px] mx-auto object-contain rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-0 right-0 h-6 w-6"
              onClick={onClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <CldUploadWidget
            uploadPreset="WorkBond"
            options={{
              maxFiles: 1,
              maxFileSize: 10000000,
              clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
              sources: ["local", "camera"],
            }}
            onSuccess={(result: any) => {
              if (result?.info?.secure_url) {
                onUpload(result.info.secure_url);
              }
            }}
          >
            {({ open }) => (
              <div
                className="cursor-pointer w-full h-full flex flex-col items-center justify-center py-8"
                onClick={() => open()}
              >
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload {label}
                </p>
              </div>
            )}
          </CldUploadWidget>
        )}
      </div>
    </div>
  );
}
