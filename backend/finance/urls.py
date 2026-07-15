from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import SavingsGoalViewSet, TransactionViewSet, dashboard, login, logout, monthly_summary, register

router = DefaultRouter()
router.register("transactions", TransactionViewSet, basename="transaction")
router.register("savings-goals", SavingsGoalViewSet, basename="savings-goal")

urlpatterns = [
    path("register/", register),
    path("login/", login),
    path("logout/", logout),
    path("dashboard/", dashboard),
    path("monthly-summary/", monthly_summary),
    path("", include(router.urls)),
]
