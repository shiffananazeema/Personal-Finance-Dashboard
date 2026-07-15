import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = [("auth", "0012_alter_user_first_name_max_length")]
    operations = [
        migrations.CreateModel(
            name="SavingsGoal",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=100)),
                ("target_amount", models.DecimalField(decimal_places=2, max_digits=12)),
                ("current_amount", models.DecimalField(decimal_places=2, default=0, max_digits=12)),
                ("deadline", models.DateField()),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="savings_goals", to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name="Transaction",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=100)),
                ("amount", models.DecimalField(decimal_places=2, max_digits=12)),
                ("transaction_type", models.CharField(choices=[("income", "Income"), ("expense", "Expense")], max_length=10)),
                ("category", models.CharField(choices=[("food", "Food"), ("rent", "Rent"), ("transport", "Transport"), ("shopping", "Shopping"), ("salary", "Salary"), ("bills", "Bills"), ("health", "Health"), ("other", "Other")], max_length=20)),
                ("date", models.DateField()),
                ("notes", models.TextField(blank=True)),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="transactions", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ["-date", "-id"]},
        ),
    ]

