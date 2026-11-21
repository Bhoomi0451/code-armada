import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  Trophy,
  Settings as SettingsIcon,
  User,
  LogOut,
  Swords,
  Bell,
  Volume2,
  Moon,
  Shield,
  Save,
  RotateCcw,
} from "lucide-react";

function SettingsPage() {
  const [preferences, setPreferences] = useState({
    notifications: true,
    sound: true,
    battleAlerts: true,
    emailUpdates: false,
    darkMode: true,
  });

  const [displayName, setDisplayName] = useState("Kirti");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedPreferences = localStorage.getItem("codeArmadaSettings");
    const savedName = localStorage.getItem("codeArmadaDisplayName");

    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }

    if (savedName) {
      setDisplayName(savedName);
    }
  }, []);

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(
      "codeArmadaSettings",
      JSON.stringify(preferences)
    );

    localStorage.setItem("codeArmadaDisplayName", displayName);

    setSaved(true);
  };

  const handleReset = () => {
    const defaultPreferences = {
      notifications: true,
      sound: true,
      battleAlerts: true,
      emailUpdates: false,
      darkMode: true,
    };

    setPreferences(defaultPreferences);
    setDisplayName("Kirti");
    localStorage.removeItem("codeArmadaSettings");
    localStorage.removeItem("codeArmadaDisplayName");
    setSaved(false);
  };

  const Toggle = ({ label, description, setting }) => (
    <div className="settings-option">
      <div className="settings-option-info">
        <h4>{label}</h4>
        <p>{description}</p>
      </div>

      <button
        type="button"
        className={`settings-toggle ${
          preferences[setting] ? "enabled" : ""
        }`}
        onClick={() => handleToggle(setting)}
        aria-label={`Toggle ${label}`}
        aria-pressed={preferences[setting]}
      >
        <span></span>
      </button>
    </div>
  );

  return (
    <div className="settings-page">
      <aside className="settings-sidebar">
        <h2 className="settings-logo">⚔ Code Armada</h2>

        <nav>
          <Link to="/dashboard">
            <LayoutDashboard size={19} /> Dashboard
          </Link>

          <Link to="/problems">
            <Swords size={19} /> Practice Problems
          </Link>

          <Link to="/matchmaking">
            <Swords size={19} /> 1v1 Battles
          </Link>

          <Link to="/history">
            <History size={19} /> Battle History
          </Link>

          <Link to="/leaderboard">
            <Trophy size={19} /> Leaderboard
          </Link>

          <Link to="/profile">
            <User size={19} /> My Profile
          </Link>

          <Link to="/settings" className="active">
            <SettingsIcon size={19} /> Settings
          </Link>

          <Link to="/">
            <LogOut size={19} /> Logout
          </Link>
        </nav>
      </aside>

      <main className="settings-main">
        <div className="settings-heading">
          <h1>Settings</h1>
          <p>Manage your account preferences and application settings.</p>
        </div>

        {/* PROFILE SETTINGS */}
        <section className="settings-card">
          <div className="settings-card-heading">
            <User size={22} />
            <div>
              <h2>Profile Preferences</h2>
              <p>Customize your display information.</p>
            </div>
          </div>

          <div className="settings-form">
            <label htmlFor="displayName">Display Name</label>

            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                setSaved(false);
              }}
              placeholder="Enter your name"
            />
          </div>
        </section>

        {/* NOTIFICATION SETTINGS */}
        <section className="settings-card">
          <div className="settings-card-heading">
            <Bell size={22} />
            <div>
              <h2>Notifications</h2>
              <p>Choose which notifications you want to receive.</p>
            </div>
          </div>

          <Toggle
            label="Push Notifications"
            description="Receive application notifications."
            setting="notifications"
          />

          <Toggle
            label="Battle Alerts"
            description="Get alerts about new battle invitations."
            setting="battleAlerts"
          />

          <Toggle
            label="Email Updates"
            description="Receive updates and announcements by email."
            setting="emailUpdates"
          />
        </section>

        {/* APPEARANCE SETTINGS */}
        <section className="settings-card">
          <div className="settings-card-heading">
            <Moon size={22} />
            <div>
              <h2>Appearance</h2>
              <p>Customize your application experience.</p>
            </div>
          </div>

          <Toggle
            label="Dark Mode"
            description="Keep the application in dark appearance."
            setting="darkMode"
          />

          <Toggle
            label="Sound Effects"
            description="Enable or disable interface sound effects."
            setting="sound"
          />
        </section>

        {/* PRIVACY SETTINGS */}
        <section className="settings-card">
          <div className="settings-card-heading">
            <Shield size={22} />
            <div>
              <h2>Privacy & Security</h2>
              <p>Information about your account preferences.</p>
            </div>
          </div>

          <div className="settings-security-info">
            <Shield size={20} />
            <div>
              <h4>Your preferences are stored locally</h4>
              <p>
                These settings are saved in your browser using localStorage.
                They are not synced with a server.
              </p>
            </div>
          </div>
        </section>

        {/* ACTION BUTTONS */}
        <div className="settings-actions">
          <button className="settings-save-btn" onClick={handleSave}>
            <Save size={18} />
            Save Changes
          </button>

          <button className="settings-reset-btn" onClick={handleReset}>
            <RotateCcw size={18} />
            Reset Settings
          </button>
        </div>

        {saved && (
          <p className="settings-success">
            ✓ Your settings have been saved successfully!
          </p>
        )}
      </main>
    </div>
  );
}

export default SettingsPage;