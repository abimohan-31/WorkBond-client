"use client";
import { useEffect, useState } from "react";
import { providerService } from "@/services/provider.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import CloudinaryImageUpload from "@/components/CloudinaryImageUpload";

export default function ProviderProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user?.role === "provider") loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const res = await providerService.getProfile();
      setProfile(res.data?.provider || null);
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  const handleUpdate = async () => {
    try {
      await providerService.updateProfile(profile);
      await refreshUser();
      toast.success("Profile updated");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handleImageUpdate = async (url: string) => {
    try {
      await providerService.updateProfileImage(url);
      setProfile((prev: any) => ({ ...prev, profileImage: url }));
      await refreshUser();
      toast.success("Profile image updated");
    } catch (err) {
      toast.error("Failed to update profile image");
    }
  };

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Provider Profile</h1>
      
      <div className="flex justify-center mb-6">
        <CloudinaryImageUpload
          currentImageUrl={profile.profileImage}
          onUploadSuccess={handleImageUpdate}
          buttonText="Change Profile Picture"
        />
      </div>

      <div className="space-y-4 p-6 border rounded-lg bg-card">
        <div className="grid gap-2">
            <label className="text-sm font-medium">Name</label>
            <Input disabled={!isEditing} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        </div>
        <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <Input disabled value={profile.email} />
        </div>
        <div className="grid gap-2">
            <label className="text-sm font-medium">Phone</label>
            <Input disabled={!isEditing} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
        </div>
        <div className="grid gap-2">
            <label className="text-sm font-medium">Address</label>
            <Textarea disabled={!isEditing} value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
        </div>
        <div className="grid gap-2">
            <label className="text-sm font-medium">Experience (Years)</label>
            <Input type="number" disabled={!isEditing} value={profile.experience_years} onChange={(e) => setProfile({ ...profile, experience_years: Number(e.target.value) })} />
        </div>
        <div className="grid gap-2">
            <label className="text-sm font-medium">Skills (comma separated)</label>
            <Input disabled={!isEditing} value={profile.skills?.join(", ")} onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(",").map((s: string) => s.trim()) })} />
        </div>

        <div className="flex justify-end gap-4 mt-6">
            {isEditing ? (
                <>
                    <Button variant="outline" onClick={() => { setIsEditing(false); loadProfile(); }}>Cancel</Button>
                    <Button onClick={handleUpdate}>Save Changes</Button>
                </>
            ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
        </div>
      </div>
    </div>
  );
}
