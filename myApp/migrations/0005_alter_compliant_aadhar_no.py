# Generated by Django 3.2.25 on 2024-03-30 09:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myApp', '0004_auto_20240330_1108'),
    ]

    operations = [
        migrations.AlterField(
            model_name='compliant',
            name='aadhar_no',
            field=models.CharField(max_length=12),
        ),
    ]
