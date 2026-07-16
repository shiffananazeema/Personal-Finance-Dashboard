# Finance Dashboard

A simple personal finance dashboard built with React, Material UI, Django REST Framework, and PostgreSQL.

## Live Demo

[View the Finance Dashboard](https://personal-finance-dashboard-web.onrender.com)

## Demo Preview

![Finance Dashboard Demo](assets/Recording.gif)

## Features

- Track income and expenses
- View the current balance
- Add, edit, and delete transactions
- Track savings goals
- View monthly savings
- See spending by category
- Use the dashboard on desktop and mobile devices

## Tech Stack

- React
- Material UI
- Django
- Django REST Framework
- PostgreSQL

## Run the Project

### Backend

cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

### Frontend

cd frontend
npm install
npm run dev
