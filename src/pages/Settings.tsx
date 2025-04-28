import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Moon, Sun, Settings as SettingsIcon, Code, Database, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const navigate = useNavigate();

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    // Add dark mode implementation here
  };

  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
    // Add notifications implementation here
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Moon className="h-5 w-5" />
              <Label>Dark Mode</Label>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <Label>Notifications</Label>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={handleNotificationsToggle}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">About</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span>Version 1.0.0</span>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>JSON Haven</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 