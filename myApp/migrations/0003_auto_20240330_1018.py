# Generated by Django 3.2.25 on 2024-03-30 04:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myApp', '0002_auto_20240328_2300'),
    ]

    operations = [
        migrations.CreateModel(
            name='Registration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('aadhar_no', models.CharField(max_length=10)),
                ('name', models.CharField(max_length=50)),
                ('phone_no', models.CharField(max_length=15)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password', models.CharField(max_length=50)),
                ('image', models.ImageField(blank=True, null=True, upload_to='media/register/')),
            ],
        ),
        migrations.DeleteModel(
            name='CustomUser',
        ),
    ]