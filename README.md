# Finance Dashboard

A simple personal finance dashboard built with React, Material UI, Django REST Framework, and PostgreSQL.

## Demo

![Finance Dashboard Demo](assets/Recording.gif)

## Features

- Track income and expenses
- View current balance
- Add, edit, and delete transactions
- Track savings goals
- View monthly savings
- See spending by category
- Responsive design

## Tech Stack

- React
- Material UI
- Django
- Django REST Framework
- PostgreSQL

## Run the Project

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```text
finance-dashboard/
├── backend/
├── frontend/
├── .gitignore
└── README.md
```
