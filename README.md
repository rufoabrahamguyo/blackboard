# Blackboard Learn (Replica)

A learning management system inspired by Blackboard, with separate **backend** (Express + MongoDB) and **frontend** (React + Vite).

## Features

- **Role-based access** — sign in as a student or instructor
- **Dashboard** — course cards, stats, announcements, upcoming work
- **Courses** — create courses, enroll students, color-coded cards
- **Course home** — announcements (pin support)
- **Assignments** — publish, submit, grade
- **Gradebook** — per-course grid for instructors; student view of own grades
- **Due dates** — calendar-style list for students
- **Help / Issues** — course-linked support tickets
- **Course admin** — instructors create courses and add students

## Project structure

```
backend/     # REST API on port 5000
frontend/    # React UI on port 5173
```

## Quick start

```bash
# Terminal 1 — API
cd backend
npm install
# Set MONGO_URI in .env
npm run dev

# Terminal 2 — UI
cd frontend
npm install
npm run dev

# Or from root:
npm install
npm run dev
```

Open **http://localhost:5173**, pick a student or instructor account, and start using the LMS.

## Typical workflow

1. **Instructor** signs in → **Course Admin** → create a course and add students.
2. Open the course → **Roster** → enroll students.
3. **Course Home** → post announcements.
4. **Assignments** → create and grade submissions.
5. **Gradebook** → view all student scores.
6. **Student** signs in → sees **My Courses** on the dashboard → submits assignments and checks grades.

## API overview

| Area | Base path |
|------|-----------|
| Dashboard | `/api/dashboard` |
| Courses | `/api/courses` |
| Assignments | `/api/assignments` |
| Submissions | `/api/submissions` |
| Announcements | `/api/announcements` |
| Students / Lecturers / Issues | `/api/students`, `/api/lecturers`, `/api/issues` |
