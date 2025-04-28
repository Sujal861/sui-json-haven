import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Moon, Sun, Settings as SettingsIcon, Code, Database, Bell } from "lucide-react";

interface SettingsProps {
  isDarkMode: boolean;
  onThemeChange: (isDark: boolean) => void;
}

const Settings = ({ isDarkMode, onThemeChange }: SettingsProps) => {
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [formatOnSave, setFormatOnSave] = useState(true);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-8">
        <SettingsIcon className="h-6 w-6 mr-2 text-blue-400" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="space-y-6">
        <Card className="p-6 glassmorphism">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Sun className="h-5 w-5 mr-2 text-amber-400" />
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle">Dark Mode</Label>
            <Switch
              id="theme-toggle"
              checked={isDarkMode}
              onCheckedChange={onThemeChange}
            />
          </div>
        </Card>

        <Card className="p-6 glassmorphism">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Code className="h-5 w-5 mr-2 text-blue-400" />
            Editor
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-save">Auto Save</Label>
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="format-save">Format on Save</Label>
              <Switch
                id="format-save"
                checked={formatOnSave}
                onCheckedChange={setFormatOnSave}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 glassmorphism">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-purple-400" />
            Notifications
          </h2>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Enable Notifications</Label>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </Card>

        <Card className="p-6 glassmorphism">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Database className="h-5 w-5 mr-2 text-emerald-400" />
            Storage
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Storage Used</Label>
                <p className="text-sm text-gray-400">1.2 GB of 5 GB</p>
              </div>
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Upgrade Storage
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings; 