from django import forms
from myApp.models import *
from django.contrib.auth.forms import AuthenticationForm
from myApp.models import *


from django import forms


class Registration_Form(forms.Form):
    aadhar_no = forms.IntegerField(widget=forms.TextInput(attrs={'autofocus': 'True', 'class': 'form-control'}))
    name = forms.CharField(widget=forms.TextInput(attrs={'autofocus': 'True', 'class': 'form-control'}))
    phone_no = forms.IntegerField(widget=forms.TextInput(attrs={'autofocus': 'True', 'class': 'form-control'}))
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'autofocus': 'True', 'class': 'form-control'}))
    image = forms.ImageField(required=False)  # Add this line for the image field

    def save(self):
        # Create and save a new HR_Registration object
        registration = Registration(
           
            name=self.cleaned_data['name'],
            aadhar_no=self.cleaned_data['aadhar_no'],
            phone_no=self.cleaned_data['phone_no'],
            email=self.cleaned_data['email'],
            password=self.cleaned_data['password'],
            image=self.cleaned_data['image']
        )
        registration.save()


    class Meta:
        model = Registration
        fields = ['name', 'aadhar_no', 'phone_no', 'email', 'password', 'image']
        widgets = {
            'password': forms.PasswordInput(),
        }

class Login_Form(forms.Form):
    aadhar_no = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'autofocus': True}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}))



class Password_Reset_Form(forms.Form):
    aadhar_no = forms.IntegerField(widget=forms.TextInput(attrs={'class': 'form-control', 'autofocus': True}), label='aadhar no')

    new_password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}), label='New Password')
    confirm_new_password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}), label='Confirm New Password')





class Compliant_Form(forms.ModelForm):
    class Meta:
        model = Compliant
        exclude = ['status']  
        
        labels = { 
            'aadhar_no': '',
            'date': '',
            'name': '',
            'village': '',
            'state': '',
            'district' : '',
            'phone': '',
            'image1': '',
            'image2': '',
            'image3': '',
            'compliant': '',
            
        }
        widgets = {
            'aadhar_no': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter aadhar id'}),
            'date': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter Name'}),
            'village': forms.Select(attrs={'class': 'form-control'}),
            'state': forms.Select(attrs={'class': 'form-control'}),
            'district': forms.Select(attrs={'class': 'form-control'}),
            'phone': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter Phone'}),
            'image1': forms.FileInput(attrs={'class': 'form-control'}),
            'image2': forms.FileInput(attrs={'class': 'form-control'}),
            'image3': forms.FileInput(attrs={'class': 'form-control'}),
            'compliant': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter Compliant'}),
        }
    
    def __init__(self, *args, **kwargs):
        super(Compliant_Form, self).__init__(*args, **kwargs)
        self.fields['state'].empty_label = 'Select State'
        self.fields['district'].empty_label = 'Select District'
        self.fields['village'].empty_label = 'Select village'