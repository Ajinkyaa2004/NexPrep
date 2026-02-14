# NexPrep AI Mock Interview Platform

An AI-powered mock interview platform that simulates real-time voice-based interviews with intelligent feedback, ATS resume checker, and resume builder. Built with Next.js 15, React 19, Firebase, MongoDB, and Google Gemini AI.

## 🚀 Features

### Core Features
- 🎤 **AI-Powered Mock Interviews** - Real-time voice-based interviews using react-speech-to-text and browser speech synthesis
- 🤖 **Intelligent Question Generation** - AI generates custom interview questions based on job position, experience, and description  
- 📊 **Detailed Feedback & Analytics** - Get comprehensive feedback with ratings, suggestions, and performance metrics
- 🎯 **Multiple Interview Modes** - Choose between Easy, Medium, or Hard difficulty levels
- ⏱️ **Flexible Duration** - Select interview duration (15, 30, 45, or 60 minutes)
- 📹 **Video Recording** - Webcam recording during interviews for self-review

### Additional Tools
- 📄 **ATS Resume Checker** - Upload your resume (PDF/DOCX) and get AI-powered ATS compatibility analysis
- ✏️ **Resume Builder** - Create professional resumes with 4 beautiful templates (Modern, Professional, Creative, Executive)
- 📈 **Dashboard Analytics** - Track your progress with stats on interviews completed, questions solved, and average scores
- 🔐 **Secure Authentication** - Firebase-based user authentication with email/password
- 💾 **Cloud Storage** - All interview data stored securely in MongoDB

## 🛠 Tech Stack

- **Framework:** Next.js 15.4.1 (with Turbopack)
- **React:** 19.1.0
- **UI Components:** ShadCN UI, Radix UI
- **Styling:** Tailwind CSS, Framer Motion
- **Authentication:** Firebase Auth
- **Database:** MongoDB with Mongoose
- **AI:** Google Gemini AI
- **Voice:** react-speech-to-text, Browser Web Speech API
- **File Parsing:** pdf-parse, mammoth (for DOCX)
- **Deployment:** Vercel

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/NexPrep-main.git
cd NexPrep-main
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# MongoDB Database
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_MONGODB_URI=your_mongodb_connection_string

# Google Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Firebase Admin SDK (for server-side)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key

# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

**Important Notes:**
- Get your MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Firebase credentials can be obtained from your [Firebase Console](https://console.firebase.google.com/)

### 4. Database Setup

The project uses MongoDB with Mongoose. The database models are defined in `utils/models.js`. No migration is needed - the collections will be created automatically when you first run the application.

### 5. Seed Demo Data (Optional)

To populate the database with demo interviews and feedback:
```bash
node scripts/seed_demo_feedback.mjs
```

### 6. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔑 Getting API Keys & Setup

### MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user and whitelist your IP (or allow access from anywhere for development)
4. Get your connection string (replace `<password>` with your actual password)
5. Add to `MONGODB_URI` in `.env.local`

### Google Gemini AI
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to `NEXT_PUBLIC_GEMINI_API_KEY` in `.env.local`

### Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Get your Firebase config from Project Settings
5. For Firebase Admin, generate a service account key (Settings > Service Accounts > Generate new private key)
6. Add credentials to `.env.local`

## 📁 Project Structure

```
NexPrep-main/
├── app/                          # Next.js app directory
│   ├── auth/                     # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── dashboard/                # Main dashboard
│   │   ├── _components/          # Dashboard components
│   │   ├── ats-checker/          # ATS Resume Checker
│   │   ├── interview/            # Interview pages
│   │   │   └── [interviewid]/
│   │   │       ├── feedback/     # Feedback display
│   │   │       └── start/        # Interview session
│   │   ├── questions/            # Questions library
│   │   ├── resume/               # Resume builder
│   │   └── upgrade/              # Upgrade plans
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/                   # Reusable UI components
│   └── ui/                       # ShadCN UI components
├── firebase/                     # Firebase configuration
│   ├── admin.js
│   └── client.js
├── utils/                        # Utility functions
│   ├── db.js                     # Database connection
│   ├── GeminiAIModal.js          # AI chat session
│   ├── GeminiATS.js              # ATS analysis
│   └── schema.js                 # Database schema
├── public/                       # Static assets
└── scripts/                      # Database seed scripts
```

## 🎯 Key Features Explained

### Mock Interview Flow
1. User creates a new interview from dashboard
2. Provides job details (position, description, experience, difficulty)
3. AI generates relevant interview questions
4. User answers questions via voice or text
5. AI analyzes responses and provides detailed feedback with ratings

### ATS Resume Checker
1. Upload resume (PDF or DOCX format)
2. AI analyzes for ATS compatibility
3. Get detailed feedback on:
   - Overall ATS score
   - Keyword optimization
   - Format compatibility
   - Section analysis
   - Actionable improvements

### Resume Builder
1. Choose from 4 professional templates
2. Fill in your details with an intuitive editor
3. Real-time preview
4. Export as PDF

### 🔐 Authentication
<img src="Screenshot 2025-08-27 at 10.36.13 AM.png" width="800" />

### 🏠 Landing Page
<img src="Screenshot 2025-08-27 at 10.36.43 AM.png" width="800" />

### ⚙️ Settings
<img src="Screenshot 2025-08-27 at 10.37.31 AM.png" width="800" />

### 🎤 Interview Session
<img src="Screenshot 2025-08-27 at 10.37.02 AM.png" width="800" />
<img src="Screenshot 2025-08-27 at 10.37.10 AM.png" width="700"/>

### 📝 Feedback & Reports
<img src="Screenshot 2025-08-27 at 10.37.20 AM.png" width="800" />

## 🐛 Known Issues & Security Considerations

⚠️ **FIXED:** The hardcoded Firebase credentials and database URL have been moved to environment variables.

### Fixed Issues:
1. ✅ **Environment Variables** - All sensitive credentials now use `.env.local`
2. ✅ **Security Patches** - Reduced vulnerabilities from 8 to 5
3. ✅ **Duplicate Folder** - Removed nested `NexPrep-main/` directory

### Remaining Issues:
1. **Next.js Security Update** (CRITICAL) - Update to Next.js 15.5.12 to fix security vulnerabilities
2. **Minor esbuild vulnerabilities** - Dev-only, not critical for production

## 🔧 Troubleshooting

### Environment Variables Not Loading

If you see errors like "NEXT_PUBLIC_OPENROUTER_API_KEY environment variable is not set":

1. **Verify `.env.local` exists:**
   ```bash
   ls -la .env.local
   ```

2. **Check file content:**
   ```bash
   cat .env.local
   ```

3. **Restart the development server:**
   ```bash
   pkill -9 node             # Kill all node processes
   rm -rf .next              # Clear Next.js cache
   npm run dev               # Start fresh
   ```

4. **If still not working, try running without Turbopack:**
   ```bash
   next dev     # Instead of next dev --turbopack
   ```

### Port Already in Use

If you see "Port 3000 is in use":
```bash
lsof -ti:3000 | xargs kill -9   # Kill process on port 3000
npm run dev                      # Restart server
```

### Database Connection Errors

If you see "No database connection string provided":
1. Double-check your `.env.local` file has `NEXT_PUBLIC_DRIZZLE_DB_URL`
2. Restart the dev server with cache clear (see above)
3. Verify the Neon database is accessible

## ✅ Recommended Improvements

### ✅ Completed
1. ✅ **Environment Variables for Firebase Client** - Moved to environment variables with fallbacks
2. ✅ **Database Connection Security** - Removed hardcoded URL   
3. ✅ **Security Patches** - Fixed 3/8 vulnerabilities (jws, node-forge, tar)
4. ✅ **Project Structure** - Cleaned up duplicate nested folder

### High Priority
5. **Next.js Security Update** ⚠️  CRITICAL
   - Update from 15.4.1 to 15.5.12
   - Run: `npm install next@15.5.12`
   - Fixes multiple security vulnerabilities (RCE, DoS, SSRF)

6. **Remaining Security Patches**
   - 2 moderate esbuild vulnerabilities (dev-only)
   - Consider running `npm audit fix --force` (may cause breaking changes)

7. **Error Handling**
   - Add comprehensive error boundaries
   - Improve API error handling with user-friendly messages

4. **Loading States**
   - Add skeleton loaders for better UX
   - Implement proper loading states for all async operations

### Medium Priority
5. **Database Connection Hardcoding**
   - Remove hardcoded database URL from `utils/db.js`
   - Use environment variable only

6. **Export Functionality**
   - Add PDF export for interview feedback
   - Add download option for resume (currently only preview available)

7. **Mobile Responsiveness**
   - Improve mobile layout for interview session
   - Test and optimize for tablet devices

8. **Interview Features**
   - Add ability to pause/resume interviews
   - Save draft interviews for later completion
   - Add interview history with filtering/search

### Nice to Have
9. **Analytics Dashboard**
   - Add charts for performance trends over time
   - Compare performance across different job roles
   - Add weekly/monthly progress reports

10. **Social Features**
    - Share interview results (anonymously)
    - Add leaderboards
    - Practice with friends

11. **Additional Interview Types**
    - Behavioral interview mode
    - System design interviews
    - Coding interview integration

12. **Accessibility**
    - Add keyboard navigation
    - Improve screen reader support
    - Add high contrast mode

13. **Internationalization**
    - Add multi-language support
    - Localized interview questions

14. **Email Notifications**
    - Send interview completion emails
    - Weekly progress summaries
    - Reminders for scheduled practice

## 🔒 Environment Variables Checklist

Before deploying to production, ensure you have:

- [ ] Created `.env.local` file
- [ ] Added `NEXT_PUBLIC_DRIZZLE_DB_URL`
- [ ] Added `NEXT_PUBLIC_OPENROUTER_API_KEY`
- [ ] Added Firebase Admin credentials (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`)
- [ ] (Optional but recommended) Moved Firebase client config to environment variables
- [ ] Added `.env.local` to `.gitignore`

## 🚀 Deploying to Vercel

### Prerequisites for Deployment
1. A Vercel account ([sign up here](https://vercel.com))
2. MongoDB Atlas database set up and accessible
3. All API keys ready (Firebase, Gemini)

### Step-by-Step Deployment

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Environment Variables**
   In the Vercel project settings, add all environment variables from your `.env.local`:
   - `MONGODB_URI` - Your MongoDB connection string
   - `NEXT_PUBLIC_MONGODB_URI` - Same MongoDB connection string
   - `NEXT_PUBLIC_GEMINI_API_KEY` - Your Gemini API key
   - `FIREBASE_PROJECT_ID` - Firebase project ID
   - `FIREBASE_CLIENT_EMAIL` - Firebase service account email
   - `FIREBASE_PRIVATE_KEY` - Firebase private key (include quotes and `\n` for line breaks)
   - `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase API key
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project ID
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
   - `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase app ID

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application
   - Once deployed, you'll get a production URL

5. **Configure Firebase for Production**
   - Go to Firebase Console > Authentication > Settings
   - Add your Vercel domain to authorized domains

6. **Configure MongoDB Atlas for Production**
   - Go to MongoDB Atlas > Network Access
   - Add `0.0.0.0/0` to allow connections from Vercel (or use Vercel's IP ranges for better security)

### Troubleshooting Deployment

**Build Errors:**
- Check that all environment variables are set correctly
- Ensure `MONGODB_URI` doesn't have any special characters that need URL encoding
- For `FIREBASE_PRIVATE_KEY`, make sure newlines are preserved as `\n`

**Runtime Errors:**
- Check Vercel function logs for detailed error messages
- Verify MongoDB connection string is accessible from Vercel
- Ensure Firebase authorized domains include your Vercel domain

**Database Connection Issues:**
- MongoDB Atlas: Check IP whitelist settings
- Test connection string locally first
- Ensure database user has proper permissions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

Created by Ajinkya

🔗 Live Demo: https://nexprep-ai.vercel.app/auth/sign-in

🔗 Portfolio: https://itsajinkya.vercel.app  
📫 LinkedIn: https://www.linkedin.com/in/ajinkya2004

## 🙏 Acknowledgments

- ShadCN UI for the beautiful component library
- Vercel for hosting
- Google Gemini AI for intelligent responses
- MongoDB Atlas for cloud database
- Firebase for authentication

---

**Note:** This is an educational project. Please ensure you comply with all API terms of service and data protection regulations when deploying to production.
