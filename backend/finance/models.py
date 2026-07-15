from django.contrib.auth.models import User
from django.db import models


class Transaction(models.Model):
    TYPES = [("income", "Income"), ("expense", "Expense")]
    CATEGORIES = [(value, value.title()) for value in [
        "food", "rent", "transport", "shopping", "salary", "bills", "health", "other"
    ]]
    title = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TYPES)
    category = models.CharField(max_length=20, choices=CATEGORIES)
    date = models.DateField()
    notes = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")

    class Meta:
        ordering = ["-date", "-id"]


class SavingsGoal(models.Model):
    name = models.CharField(max_length=100)
    target_amount = models.DecimalField(max_digits=12, decimal_places=2)
    current_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    deadline = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="savings_goals")

