# 📅 TimeBlock Calendar

A smart daily planner app designed as a full-screen productivity dashboard. It helps users organize their day efficiently with a visual time-block interface.

🔗 **Live Demo:** [Open Calendar](https://sanskar-joshi.github.io/time-block-calendar/)

## 🚀 Features
* **Full-Screen Dashboard:** Immersive layout that utilizes 100% of the screen space.
* **Smart Persistence:** Events are saved to `localStorage`, keeping your schedule safe between sessions.
* **Dynamic Visuals:**
    * **Current Time Indicator:** A glowing red line tracking real-time progress.
    * **Visual Duration:** Event height corresponds to duration (1 pixel = 1 minute).
    * **Conflict Handling:** Semi-transparent events allow visibility of overlapping schedules.
* **Interactive Controls:**
    * Click-to-add on any time slot.
    * Drag-and-drop feel (visual positioning).
    * Color-coded tags for different event types.

## 🛠️ Tech Stack
* **HTML5**
* **CSS3** (CSS Variables, Flexbox, Grid, Custom Scrollbars)
* **JavaScript** (ES6+, DOM Manipulation, LocalStorage API, Date Objects)

## 👤 Author
**Sanskar Joshi**
- [LinkedIn](https://www.linkedin.com/in/sanskar-joshi-417630358/)
- [GitHub](https://github.com/sanskar-joshi/)

## 📂 Project Structure
```text
/
├── index.html      # Dashboard Structure
├── style.css       # Full-screen layout & Glassmorphism styles
├── script.js       # Time calculation & Data persistence logic
├── favicon.png     # App Icon
└── README.md       # Documentation
