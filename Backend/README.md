# 🚀 DevSync Backend

Backend service for **DevSync**, a collaborative student platform built with **Django REST Framework**. It provides secure authentication, REST APIs, user management, and backend services for the frontend application.

---

## ✨ Highlights

* 🔐 JWT-based Authentication
* 👤 Custom User Model
* 🌐 Google OAuth Login
* 📧 Email Authentication & Password Reset
* ⚡ RESTful API Architecture
* 🗂️ Modular Django Apps
* 🔒 Environment-based Configuration
* 🚀 Deployment-ready Database Configuration

---

## 🛠️ Tech Stack

| Category       | Technology                              |
| -------------- | --------------------------------------- |
| Backend        | Django 6, Django REST Framework         |
| Authentication | SimpleJWT, dj-rest-auth, django-allauth |
| Database       | MySQL (via PyMySQL)                     |
| Security       | JWT, CORS Headers                       |
| Email          | Gmail SMTP                              |
| Configuration  | Python Dotenv                           |

---

# 🏗️ Architecture

```
Backend/
│
├── config/         # Django project configuration
├── accounts/       # Custom user & authentication
├── api/            # Serializers and REST endpoints
├── devsync/        # Core application logic
│
└── manage.py
```

The backend follows a modular architecture where each Django app is responsible for a specific domain, improving maintainability and scalability.

---

# 🔐 Authentication

Authentication is implemented using **SimpleJWT**, **dj-rest-auth**, and **django-allauth**.

### Supported methods

* Email & Password Login
* JWT Authentication
* Google OAuth
* Password Reset
* User Registration

### Why JWT?

JWT enables a stateless authentication flow, making it well suited for a decoupled frontend-backend architecture while simplifying API authorization.

---

# 🗄️ Database

Database configuration is environment-driven using `DATABASE_URL`.

This provides:

* Easy deployment
* Environment portability
* Minimal configuration changes between local and production environments

The project uses **PyMySQL** as the database driver.

---

# ⚙️ Environment Variables

Create a `.env` file containing:

```env
SECRET_KEY=
DEBUG=
DATABASE_URL=
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
FRONTEND_URL=
```

Keeping secrets outside the source code improves security and simplifies deployment.

---

# ▶️ Running the Project

```bash
git clone https://github.com/Shanmuk7347/DevSync.git

cd DevSync/Backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

python manage.py migrate

python manage.py createsuperuser

python manage.py runserver
```

---

# 🎯 Design Decisions

### Custom User Model

Implemented from the beginning to support future extensibility without migration issues.

### Modular Django Apps

Authentication, API logic, and core functionality are separated to improve maintainability.

### Environment Configuration

Sensitive information is stored using environment variables instead of hardcoding credentials.

### REST API First

The backend is designed primarily as an API service for frontend clients.

---

# 🔒 Security

* JWT Authentication
* Environment-based secrets
* Password validation
* CSRF trusted origins
* CORS configuration
* SMTP credentials stored in environment variables

---

# 📌 Future Improvements

* Unit & integration tests
* Production settings split
* Docker support
* CI/CD pipeline
* Rate limiting
* Monitoring & logging

---
