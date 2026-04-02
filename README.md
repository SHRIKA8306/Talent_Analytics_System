# 🎯 Talent Analytics Mini System

A full-stack MERN application for managing student talent profiles, calculating scores, ranking students, and providing admin analytics.

## Features

### 1. **Authentication**
- User signup and login with JWT
- Two roles: Student and Admin
- Secure password hashing with bcryptjs

### 2. **Student Module**
- Create and update profile with:
  - Name, Email, CGPA (0-10)
  - Skills (array of strings)
  - Number of Projects
- **Automatic Score Calculation:**
  ```
  Score = (CGPA × 10) + (Skills Count × 5) + (Projects × 10)
  ```
- View personal score and rank
- View leaderboard

### 3. **Admin Module**
- View all students in a table
- Search students by name
- Filter by minimum CGPA
- Filter by skill
- Access to analytics dashboard

### 4. **Dashboard & Analytics**
- Average CGPA of all students
- Top 3 students by score
- Skills distribution charts
- Skills pie chart
- Total student count

### 5. **UI Features**
- Clean, modern interface with Bootstrap
- Responsive design
- Gradient-based theming
- Easy navigation

---

## Tech Stack

### Backend
- **Node.js** + **Express** - Server
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **Joi** - Input validation

### Frontend
- **React** 19 - UI Framework
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Bootstrap 5** - Styling
- **Recharts** - Data visualization

---

## Installation & Setup

### 1. **Prerequisites**
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 2. **Backend Setup**

```bash
cd backend

# Install dependencies
npm install

# Create .env file (already created with defaults)
# Edit .env with your MongoDB connection string if using Atlas
# Example: DB=mongodb+srv://username:password@cluster.mongodb.net/talent_analytics

# Start the server
npm run dev
# Server runs on http://localhost:4000
```

### 3. **Frontend Setup**

```bash
cd frontend

# Install dependencies
npm install

# Start React app
npm start
# App runs on http://localhost:3000
```

---

## API Endpoints

### Authentication
- `POST /api/auth` - Login user
- `POST /api/users/register` - Register new user  
- `GET /api/me` - Get current user (requires JWT)

### Student Profile
- `GET /api/profile` - Get user's profile
- `POST /api/profile` - Create student profile
- `PUT /api/profile` - Update student profile
- `GET /api/profile/leaderboard/all` - Get all profiles sorted by score

### Analytics (Admin Only)
- `GET /api/analytics/dashboard` - Get dashboard stats
- `GET /api/analytics/students` - Get filtered students with search & filters

---

## Database Schema

### User Model
```javascript
{
  username: String (required),
  email: String (required, unique),
  passwordHash: String,
  role: 'student' | 'admin' (default: 'student'),
  timestamps: true
}
```

### Profile Model
```javascript
{
  user: ObjectId (User ref),
  name: String (required),
  cgpa: Number (0-10, required),
  skills: [String],
  projects: Number (default: 0),
  score: Number (auto-calculated),
  rank: Number,
  timestamps: true
}
```

---

## Score Calculation Formula

```
Score = (CGPA × 10) + (Number of Skills × 5) + (Projects × 10)
```

**Example:**
- CGPA: 8.5 → 85 points
- Skills: 3 → 15 points
- Projects: 2 → 20 points
- **Total Score: 120**

---

## User Roles & Permissions

### Student
- Create and update own profile
- View own profile and score
- View leaderboard
- Cannot access admin features

### Admin
- View all students
- Search and filter students
- View analytics dashboard
- Access skills distribution charts
- View top 3 students

---

## How to Use

### Student Flow
1. **Sign Up** - Create account as Student
2. **Create Profile** - Fill in name, CGPA, skills, projects
3. **View Dashboard** - See your score and rank
4. **View Leaderboard** - Compare with other students

### Admin Flow
1. **Sign Up** - Create account as Admin
2. **Navigate to Admin** - Click "Navigate to admin dashboard" or go to `/admin`
3. **View Students** - See all students in table format
4. **Filter/Search** - Use filters to find specific students
5. **Analytics** - View analytics dashboard with charts

---

## Environment Variables

### Backend (.env)
```
PORT=4000
DB=mongodb://localhost:27017/talent_analytics
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPRIRES_IN=7d
SALT_ROUNDS=10
```

---

## Testing the Application

### Test Student Account
1. Sign up with username: `student1` and any password
2. Create profile with CGPA: 8.5, Skills: 3-4, Projects: 2
3. View score (should be around 120)
4. Go to leaderboard to see ranking

### Test Admin Account
1. Sign up with username: `admin1`, select role: Admin
2. Create a few student accounts
3. Go to `/admin` to access admin dashboard
4. View student list, filters, and analytics

---

## Project Structure

```
Talent_Analytics_System/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── model/
│   │   ├── user.js
│   │   └── profile.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── profile.js
│   │   └── analytics.js
│   ├── config/
│   │   └── passport.js
│   ├── db.js
│   ├── index.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.js
    │   │   ├── Signup.js
    │   │   ├── StudentDashboard.js
    │   │   ├── AdminDashboard.js
    │   │   ├── ProfileForm.js
    │   │   ├── Leaderboard.js
    │   │   └── Analytics.js
    │   ├── api.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```

---

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas: Ensure IP whitelist includes your IP

### Frontend not connecting to Backend
- Backend must be running on port 4000
- Frontend runs on port 3000
- Check CORS is enabled in backend

### JWT Token Issues
- Clear localStorage and login again
- Check JWT_SECRET in .env
- Token expires after 7 days by default

---

## Future Enhancements

- Event management system
- Certificates and achievements
- Email notifications
- Advanced analytics and reporting
- Profile picture upload
- Export student data as PDF

---

## License

MIT License - Feel free  to use this project!

---

## Support

For issues or questions, please create an issue in the repository or contact the development team.

**Happy Coding! 🚀**
