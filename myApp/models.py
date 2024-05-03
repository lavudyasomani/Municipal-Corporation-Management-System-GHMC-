# models.py
from django.db import models

from django.contrib.auth.models import User
from django.db import models
# models.py
from django.db import models
from django.contrib.auth.models import AbstractUser


class Registration(models.Model):
    aadhar_no = models.CharField(max_length=12)
    name = models.CharField(max_length=50)
    phone_no = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=50)
    image = models.ImageField(upload_to='media/register/', null=True, blank=True)
    
    def __str__(self):
        return f"{self.name}"



class State(models.Model):
    name = models.CharField(max_length=100, null=True, unique=True)
    def __str__(self):
        return str(self.name)

class District(models.Model):
    name = models.CharField(max_length=100, null=True, unique=True)

    def __str__(self):
        return str(self.name)

class Village(models.Model):
    name = models.CharField(max_length=100, null=True, unique=True)

    def __str__(self):
        return str(self.name)
    
    
class Compliant(models.Model):
    aadhar_no = models.CharField(max_length=12, unique=False)
    name = models.CharField(max_length=100, unique=True)
    village = models.ForeignKey(Village, on_delete=models.CASCADE)
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    phone = models.CharField(max_length=10)
    date = models.DateField()
    image1 = models.ImageField(upload_to='images')
    image2 = models.ImageField(upload_to='images', null=True, blank=True)
    image3 = models.ImageField(upload_to='images', null=True, blank=True)
    compliant = models.TextField(max_length=1000, null=True, blank=True)
    status = models.BooleanField(default=False,null=True, blank=True)

    def __str__(self):
        return str(self.name)



