from datetime import date
from decimal import Decimal
from django.contrib.auth import authenticate
from django.db.models import Sum
from django.db.models.functions import Coalesce
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import SavingsGoal, Transaction
from .serializers import SavingsGoalSerializer, TransactionSerializer, UserSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key, "username": user.username}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    user = authenticate(username=request.data.get("username"), password=request.data.get("password"))
    if not user:
        return Response({"detail": "Invalid username or password."}, status=status.HTTP_400_BAD_REQUEST)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key, "username": user.username})


@api_view(["POST"])
def logout(request):
    request.auth.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SavingsGoalViewSet(viewsets.ModelViewSet):
    serializer_class = SavingsGoalSerializer

    def get_queryset(self):
        return SavingsGoal.objects.filter(user=self.request.user).order_by("deadline")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


def totals(queryset):
    zero = Decimal("0.00")
    income = queryset.filter(transaction_type="income").aggregate(total=Coalesce(Sum("amount"), zero))["total"]
    expenses = queryset.filter(transaction_type="expense").aggregate(total=Coalesce(Sum("amount"), zero))["total"]
    return income, expenses


@api_view(["GET"])
def dashboard(request):
    queryset = Transaction.objects.filter(user=request.user)
    income, expenses = totals(queryset)
    today = date.today()
    monthly_income, monthly_expenses = totals(queryset.filter(date__year=today.year, date__month=today.month))
    recent = TransactionSerializer(queryset[:5], many=True).data
    return Response({
        "total_income": income,
        "total_expenses": expenses,
        "balance": income - expenses,
        "monthly_income": monthly_income,
        "monthly_expenses": monthly_expenses,
        "monthly_savings": monthly_income - monthly_expenses,
        "recent_transactions": recent,
    })


@api_view(["GET"])
def monthly_summary(request):
    today = date.today()
    try:
        year = int(request.query_params.get("year", today.year))
        month = int(request.query_params.get("month", today.month))
        if month < 1 or month > 12:
            raise ValueError
    except ValueError:
        return Response({"detail": "Use a valid numeric year and month."}, status=status.HTTP_400_BAD_REQUEST)
    queryset = Transaction.objects.filter(user=request.user, date__year=year, date__month=month)
    income, expenses = totals(queryset)
    return Response({"year": year, "month": month, "income": income, "expenses": expenses, "balance": income - expenses})

