# Generated by Django 5.0.6 on 2024-06-13 15:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gym', '0002_gympackage_discounted_price_usd'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gympackage',
            name='discount',
            field=models.DecimalField(decimal_places=2, default=0.0, editable=False, max_digits=5),
        ),
        migrations.AlterField(
            model_name='gympackage',
            name='discounted_price_usd',
            field=models.DecimalField(decimal_places=2, max_digits=6, null=True),
        ),
    ]
