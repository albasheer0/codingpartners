# Habit Tracker - Full Stack Application

A comprehensive habit tracking application built with a React frontend and Node.js/Express backend, featuring streaks, history, statistics, filtering, pagination, and a beautiful, responsive UI.

---

## 🚀 Features

### Core
- **Create, view, edit, and delete habits**
- **Mark habits as done/not done for today**
- **Streak counter** and last completed date
- **View habit history** (7/14/30 days)
- **Filter history by habit** (dropdown)
- **Paginated habit and history lists**
- **Global summary in header** (total habits, completed today, completion rate)
- **Statistics dashboard**
- **Mock authentication** (demo login)
- **Modern, responsive UI** (Tailwind CSS, mobile-friendly)
- **Robust error/loading states**

### Tech Stack
- **Frontend:** React 18, Tailwind CSS, Axios, React Hot Toast, Lucide React
- **Backend:** Node.js, Express, Repository Pattern, Dependency Injection, CORS, Helmet, Morgan

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Quick Start
```bash
git clone <repository-url>
cd habit-tracker
npm run install:all
npm run dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
### Manual Setup

```bash
cd backend
npm install
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🔧 Configuration

Create a `.env` in `backend/`:
```
PORT=5000
NODE_ENV=development
REPOSITORY_TYPE=memory  # or 'file'
HABITS_FILE_PATH=habits.json
FRONTEND_URL=http://localhost:3000
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Habits
- `GET /habits` — Get paginated habits with today's status (`?limit=9&offset=0`)
- `GET /habits/list` — Get all habits (id and name only, for filter dropdown)
- `GET /habits/:id` — Get specific habit
- `POST /habits` — Create new habit
- `PUT /habits/:id` — Update habit
- `DELETE /habits/:id` — Delete habit
- `PATCH /habits/:id/toggle` — Toggle completion for today

#### History & Statistics
- `GET /habits/history?days=7&limit=9&offset=0&habitId=...` — Get paginated, optionally filtered history
- `GET /habits/stats/statistics` — Get habit statistics
- `GET /habits/summary` — Get global summary (totalHabits, completedToday, completionRate)

#### Health
- `GET /health` — Server health
- `GET /api` — API info

### Request/Response Example
```json
POST /habits
{
  "name": "Morning Exercise",
  "description": "30 minutes of cardio"
}

Response:
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Morning Exercise",
    "description": "30 minutes of cardio",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "completedDates": [],
    "streak": 0,
    "lastCompletedDate": null
  }
}
```

---

## 🎯 Demo Credentials
- **Username:** `demo`
- **Password:** `password`

---

## 🏗️ Architecture

### Backend
```
backend/
├── src/
│   ├── models/                # Habit model & repository interface
│   ├── repositories/          # InMemory & File repositories
│   ├── services/              # Business logic
│   ├── controllers/           # HTTP request handling
│   ├── routes/                # Express routes
│   ├── config/                # Dependency injection
│   └── server.js              # Main server file
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── HabitCard.js
│   │   ├── HabitModal.js      # Combined create/edit
│   │   ├── HistoryPage.js     # Filtering, pagination
│   │   ├── CalendarDayCard.js # Reusable calendar cell
│   │   ├── StatisticsModal.js
│   │   ├── Header.js, Navbar.js, LoginForm.js
│   ├── contexts/
│   │   └── HabitContext.js    # State, pagination, summary, filtering
│   ├── services/
│   │   └── api.js             # API service
│   ├── App.js
│   └── index.js
```

---

## 🧑‍💻 Usage & UI
- **Pagination:** Habits and history are paginated (default 9 per page).
- **Filter History:** Use the dropdown to view history for a specific habit or all habits.
- **Summary:** Header always shows up-to-date stats for all habits.
- **Responsive:** Works great on mobile and desktop.

---

## 🚀 Deployment

### Backend (Render/Heroku)
- Set env vars: `NODE_ENV=production`, `PORT=5000`, `REPOSITORY_TYPE=file`
- `cd backend && npm start`

### Frontend (Vercel/Netlify)
- `cd frontend && npm run build`
- Set env var: `REACT_APP_API_URL=https://your-backend-url.com/api`
- Deploy the build folder

---

## 🧪 Testing
- **Backend:** `cd backend && npm test`

---

## 🎨 UI/UX Features
- Responsive, mobile-friendly design
- Sticky navigation bar
- Smooth animations
- Loading spinners, error toasts
- Accessible (ARIA, keyboard navigation)

---

## 🔒 Security
- CORS, Helmet, input validation, error handling, rate limiting

---


## 📄 License
MIT

---

**Note:** This project demonstrates full-stack skills, clean architecture, and modern React/Node best practices. 