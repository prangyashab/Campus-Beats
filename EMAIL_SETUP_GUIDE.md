# Email Configuration Setup Guide

## Problem
You're not receiving email verification messages because the email service is not properly configured with real SMTP credentials.

## Solution

### Step 1: Set up Gmail App Password (Recommended)

1. **Enable 2-Factor Authentication on your Gmail account**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled

2. **Generate an App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" as the app
   - Select "Other" as the device and name it "Campus Beats"
   - Copy the 16-character app password (e.g., `abcd efgh ijkl mnop`)

### Step 2: Set Environment Variables

#### Option A: Using Windows Environment Variables
1. Open Command Prompt as Administrator
2. Run these commands (replace with your actual email and app password):
```cmd
setx EMAIL_USERNAME "paramjitbaral44@gmail.com"
setx EMAIL_PASSWORD "lonx cnlv kyiz iaui"
```
3. Restart your IDE and terminal

#### Option B: Using .env file (Alternative)
1. Create a `.env` file in the backend directory
2. Add these lines:
```
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password-here
```

### Step 3: Restart the Backend Server
1. Stop the current backend server (Ctrl+C in the terminal)
2. Start it again with: `mvn spring-boot:run`

### Step 4: Test Email Sending
1. Try registering a new user with your email address
2. Check the backend logs for email sending confirmation
3. Check your email inbox (and spam folder)

## Alternative Email Providers

### Using Outlook/Hotmail
```yaml
spring:
  mail:
    host: smtp-mail.outlook.com
    port: 587
    username: ${EMAIL_USERNAME:your-email@outlook.com}
    password: ${EMAIL_PASSWORD:your-password}
```

### Using Yahoo Mail
```yaml
spring:
  mail:
    host: smtp.mail.yahoo.com
    port: 587
    username: ${EMAIL_USERNAME:your-email@yahoo.com}
    password: ${EMAIL_PASSWORD:your-app-password}
```

## Troubleshooting

### Common Issues:
1. **"Authentication failed"** - Check your app password is correct
2. **"Connection timeout"** - Check your firewall/antivirus settings
3. **"Email not received"** - Check spam folder, verify email address

### Check Backend Logs:
Look for these log messages:
- `Attempting to send verification email to: [email]`
- `Verification email sent successfully to: [email]`
- Any error messages about email configuration

### Security Notes:
- Never commit real email credentials to version control
- Use environment variables or secure configuration management
- App passwords are safer than using your main Gmail password

## Quick Fix Commands

If you want to test immediately with your Gmail:

1. **Set environment variables** (replace with your details):
```cmd
setx EMAIL_USERNAME "your-email@gmail.com"
setx EMAIL_PASSWORD "your-16-char-app-password"
```

2. **Restart backend server**:
```cmd
cd backend
mvn spring-boot:run
```

3. **Test registration** at http://localhost:5173

After following these steps, you should receive verification emails successfully!