# 📸 SnapAFit

**SnapAFit** is an AI-powered smart fitting solution that enables users to preview clothes, accessories, or items virtually using image-based personalization and computer vision.

🔗 [View on GitHub](https://github.com/ishtiyaqe/snapafit)

---

## 🚀 Features

- 👤 AI-based user detection and segmentation
- 🧠 Virtual item fitting using deep learning (e.g., clothes, glasses)
- ⚡ Real-time preview with drag-and-drop interface
- 🖼️ Upload and try any item using automatic image alignment
- 💾 Save snapshots for download or sharing

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite, Tailwind CSS  
- **Backend**: Django REST Framework  
- **Image Processing**: OpenCV, MediaPipe, Pillow  
- **Database**: SQLite / PostgreSQL  
- **Deployment**: Docker

---

## 📦 Installation

Clone the repository and run both the backend and frontend locally:

```bash
# Clone the repository
git clone https://github.com/ishtiyaqe/snapafit
cd snapafit

# Backend (Django)
cd backend
pip install -r requirements.txt
python manage.py runserver

# Frontend (React + Vite)
cd ../frontend
npm install
npm run dev
