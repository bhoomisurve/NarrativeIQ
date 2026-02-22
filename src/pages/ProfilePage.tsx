import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { User as UserIcon, Mail, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!name.trim()) return toast.error("Name is required");
    if (!email.trim()) return toast.error("Email is required");
    setSaving(true);
    try {
      await api.updateProfile({ name, email });
      await refreshUser();
      toast.success("Profile updated successfully");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) return toast.error("Fill in both password fields");
    if (newPassword.length < 6) return toast.error("New password must be at least 6 characters");
    setSaving(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password changed successfully");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Password change failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold">Profile Settings</h1>
        <p className="text-sm text-muted-foreground">Update your personal details and password.</p>
      </div>

      {/* Avatar & Info */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card"
      >
        <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <span className="text-2xl font-display font-bold text-primary">
            {user?.name?.charAt(0)?.toUpperCase() || "?"}
          </span>
        </div>
        <div>
          <h2 className="font-semibold text-lg">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <p className="text-xs text-primary mt-1">{user?.credits ?? 0} credits remaining</p>
        </div>
      </motion.div>

      {/* Profile Details */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4 p-5 rounded-xl border border-border bg-card"
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Personal Details</h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <UserIcon className="h-3 w-3" /> Full Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="bg-muted border-border"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3 w-3" /> Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-muted border-border"
            />
          </div>
        </div>
        <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 p-5 rounded-xl border border-border bg-card"
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Change Password</h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-muted border-border"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-muted border-border"
            />
          </div>
        </div>
        <Button onClick={handleChangePassword} disabled={saving} variant="outline" className="w-full">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Update Password
        </Button>
      </motion.div>
    </div>
  );
}
