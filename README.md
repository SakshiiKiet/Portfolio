# Sakshi Maan - Portfolio Website 🚀

A modern, interactive portfolio website built with React and Node.js, featuring dynamic themes, blog articles, project showcases, and real-time analytics.

## 🌐 Live Demo

🔗 **Website**: [your-portfolio-url.vercel.app](https://your-portfolio-url.vercel.app) *(Update this after deployment)*

## ✨ Features

- 🎨 **Dynamic Theme Switcher** - Toggle between warm (coral/amber/teal) and cool (blue/purple/cyan) color schemes
- 📝 **Blog System** - Full-featured blog with AI, Development, and Tech articles
- 💼 **Project Showcase** - Detailed case studies with metrics and GitHub links
- 📊 **Analytics Dashboard** - Track visitor stats and project views
- 📬 **Contact Form** - Email notifications powered by Nodemailer
- 📰 **Newsletter** - Automated welcome emails for subscribers
- 🔒 **Security** - Rate limiting and input validation
- ⚡ **Performance** - Optimized with lazy loading and CDN images

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI with hooks and functional components
- **Tailwind CSS** - Utility-first styling with custom themes
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API calls
- **Framer Motion** - Smooth animations

### Backend
- **Node.js + Express** - RESTful API server
- **MongoDB + Mongoose** - NoSQL database with ODM
- **Nodemailer** - Email service integration
- **Express Rate Limit** - API protection
- **CORS** - Cross-origin resource sharing

### Infrastructure
- **MongoDB Atlas** - Cloud database (free tier)
- **Gmail SMTP** - Email delivery
- **Vercel** - Frontend hosting (recommended)
- **Render** - Backend hosting (recommended)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm installed
- MongoDB Atlas account ([free signup](https://www.mongodb.com/cloud/atlas))
- Gmail account with App Password ([setup guide](https://support.google.com/accounts/answer/185833))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/SakshiiKiet/portfolio.git
cd portfolio/test
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your credentials:
```env
MONGODB_URI=your_mongodb_atlas_uri
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
PORT=5000
FRONTEND_URL=http://localhost:3000
```

Start backend server:
```bash
npm start
```

3. **Frontend Setup** (in new terminal)
```bash
cd frontend
npm install
```

Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start development server:
```bash
npm start
```

4. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📦 How to Deploy

### Quick Deploy (Recommended - FREE)

**1. Frontend on Vercel:**
- Push code to GitHub
- Import repo on [vercel.com](https://vercel.com)
- Root directory: `test/frontend`
- Add env: `REACT_APP_API_URL=your_backend_url`
- Deploy and copy your URL

**2. Backend on Render:**
- Create Web Service on [render.com](https://render.com)
- Root directory: `test/backend`
- Add all environment variables from `.env.example`
- Deploy and copy your URL

**3. Update URLs:**
- Add backend URL to Vercel environment variables
- Add frontend URL to Render environment variables
- Update the "Live Demo" section in this README

**Total Cost: $0/month** with free tiers! 🎉

### Alternative Hosting
- **Netlify** - Frontend (free)
- **Railway** - Full-stack ($5/month after trial)
- **Heroku** - Backend ($7/month)

## 📁 Project Structure

```
test/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── Sakshi_Maan_Resume.pdf
│   └── src/
│       ├── components/
│       │   └── Portfolio.jsx (main component)
│       ├── data/
│       │   └── blogPosts.js (blog articles)
│       ├── App.js
│       └── index.js
├── backend/
│   ├── server.js (Express API)
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## 🎨 Key Features Explained

### Theme System
- Warm theme: Coral (#ff7c5c), Amber, Teal palette
- Cool theme: Blue, Purple, Cyan palette
- Smooth 700ms transitions
- Persistent across page navigation

### Blog System
- 4 comprehensive articles with researched content
- Categories: AI & ML, Developer Tools, Performance
- Full-text search and category filtering
- Modal view with hero images
- Sequential dates (Nov 2025 - Feb 2026)

### Projects Portfolio
- **NextStepAI** - AI-powered career guidance with XGBoost & Gemini Pro
- **Civic Platform** - GPT-4 powered civic campaign builder
- **DevScope** - GitHub portfolio automation tool
- Each with detailed case studies and metrics
- GitHub repository links
- View count tracking

### Contact & Newsletter
- Contact form saves to MongoDB
- Sends email notification to your Gmail
- Newsletter subscription with automated welcome email
- Admin notification on new subscribers
- Rate limiting to prevent spam

## 📊 Database Schema

### Collections
- **contacts** - Contact form submissions
- **newsletters** - Email subscribers
- **visitors** - Analytics data
- **projectviews** - Project engagement tracking

## 🔐 Security Features

- Rate limiting (100 requests/15 minutes)
- Input validation and sanitization
- CORS configured for production
- Environment variable protection
- MongoDB injection prevention

## 🐛 Troubleshooting

**Frontend won't start:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

**Backend connection error:**
- Check MongoDB URI in `.env`
- Verify IP whitelist in MongoDB Atlas
- Ensure port 5000 is available

**Email not sending:**
- Regenerate Gmail App Password
- Check EMAIL_USER and EMAIL_PASS in `.env`
- Verify 2FA is enabled on Gmail account

**CORS errors in production:**
- Update FRONTEND_URL in backend `.env`
- Check CORS configuration in server.js

## 📈 Performance Optimizations

- Lazy loading for images
- Debounced search inputs
- Optimized Unsplash image parameters
- Minimal re-renders with React hooks
- Rate limiting on API endpoints

## 🤝 Contributing

While this is a personal portfolio, you're welcome to:
- Report bugs via GitHub Issues
- Suggest improvements
- Use code as reference for your own portfolio

## 📝 License

MIT License - Feel free to use this as inspiration for your own portfolio!

## 👩‍💻 About

**Sakshi Maan**
- 🎓 Computer Science Student at KIET Group of Institutions
- 💻 Full-Stack Developer specializing in React & Node.js
- 🏆 LeetCode Rating: 1464 | 300+ Problems Solved
- 🥇 Winner of INNOTECH, 4th place DevNexus 2025

### Connect
- 🐙 GitHub: [@SakshiiKiet](https://github.com/SakshiiKiet)
- 💼 LinkedIn: [sakshii-maan](https://linkedin.com/in/sakshii-maan)
- 📧 Email: sakshiatkiet@gmail.com
- 💡 LeetCode: [Sakshikiet](https://leetcode.com/u/Sakshikiet)

### Featured Projects
- [NextStepAI](https://github.com/SakshiiKiet/NEXTSTEPAI) - AI Career Copilot
- [Civic Platform](https://github.com/SakshiiKiet/Civic-Platform) - AI Campaign Builder
- [DevScope](https://github.com/SakshiiKiet/DevScope) - GitHub Portfolio Generator

---

⭐ **Star this repo if you found it helpful!**

Built with ❤️ by Sakshi Maan | © 2026
