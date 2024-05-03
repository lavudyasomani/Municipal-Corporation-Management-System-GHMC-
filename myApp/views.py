from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from myApp.forms import *
from myApp.models import *
from django.contrib.auth import login as auth_login  
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login  # Alias to avoid conflict with the view function name
from django.contrib import messages






def Home(request):
    return render(request, 'index.html')

def About(request):
    return render(request, 'about.html')

def success_page(request):
    return render(request, 'success_page.html')


def register(request):
    if request.method == 'POST':
        aadhar_no = request.POST.get('aadhar_no')
        name = request.POST.get('name')
        phone_no = request.POST.get('phone_no')
        email = request.POST.get('email')
        password = request.POST.get('password')
        image = request.FILES.get('image') 
        
    

        if Registration.objects.filter(aadhar_no = aadhar_no).exists():
          messages.error(request, 'user already exists')
          return redirect('register')
        
        if Registration.objects.filter(name = name).exists():
          messages.error(request, 'user name already exists')
          return redirect('register')
        
        if Registration.objects.filter(email = email).exists():
          messages.error(request, 'user email already exists')
          return redirect('register')
        
        if Registration.objects.filter(password = password).exists():
          messages.error(request, 'user password already exists')
          return redirect('register')
        if email:
          reg_data = Registration(
              aadhar_no=aadhar_no,
              name=name,
              phone_no=phone_no,
              email=email,
              password=password,
              image=image  
          )

          reg_data.save()

          request.session['profile_pic'] = reg_data.image.url
          request.session['username'] = reg_data.name
          return redirect('login')
        else:
          pass
    else:
        form = Registration_Form()

    return render(request, 'register.html', {'form': form})

def login(request):
    if request.method == 'POST':
        form = Login_Form(request.POST)
        if form.is_valid():
            aadhar_no = form.cleaned_data['aadhar_no']
            password = form.cleaned_data['password']
            try:
                user = Registration.objects.get(aadhar_no=aadhar_no)
                if user.password == password:
                    request.session['aadhar_no'] = aadhar_no
                    request.session['user_id'] = user.id
                    request.session['username'] = user.name
                    # No image field associated with login form, so no need to set 'profile_pic'
                    return redirect('create_event')
                else:
                    messages.error(request, 'Login failed. Please check your credentials.')
            except Registration.DoesNotExist:
                messages.error(request, 'User does not exist. Please check your credentials.')
    else:
        form = Login_Form()

    return render(request, 'login.html', {'form': form})


def password_reset(request):
    if request.method == 'POST':
        form = Password_Reset_Form(request.POST)
        if form.is_valid():
            aadhar_no = form.cleaned_data['aadhar_no']
            new_password = form.cleaned_data['new_password']
            confirm_new_password = form.cleaned_data['confirm_new_password']
            print(aadhar_no,new_password,confirm_new_password)
            try:
                user = Registration.objects.get(aadhar_no=aadhar_no)
                if new_password == confirm_new_password:
                    user.password = new_password
                    user.save()
                    messages.success(request, 'Password reset successful.')
                    
                    request.session['aadhar_no'] = aadhar_no
                    request.session['user_id'] = user.id
                    request.session['username'] = user.name
                    return redirect('login')  
                else:
                    messages.error(request, 'Passwords do not match.')
            except Registration.DoesNotExist:
                messages.error(request, 'User does not exist. Please check your credentials.')
    else:
        form = Password_Reset_Form()

    return render(request, 'password_reset.html', {'form': form})



def LogOut(request):
  
  
  if 'aadhar_no' in request.session:
      del request.session['aadhar_no']
 

  return render(request, 'login.html')




@login_required
def user_logout(request):
    logout(request)
    # Clear the session variable when user logs out
    request.session.pop('logged_in', None)
    return redirect('login')


@login_required
def event_list(request):
    # Filter complaints to only include those belonging to the logged-in user
    events = Compliant.objects.filter(aadhar_no=request.aadhar_no)
    return render(request, 'govt_event/event_list.html', {'events': events})


@login_required
def create_event(request):
    if request.method == 'POST':
        form = Compliant_Form(request.POST, request.FILES)
        if form.is_valid():
            # Associate the complaint with the currently logged-in user
            complaint = form.save(commit=False)
            complaint.user = request.user
            complaint.save()
            return redirect('compliant_status')
    else:
        form = Compliant_Form()

    return render(request, 'govt_event/create_event.html', {'form': form})



@login_required
def edit_event(request, event_id):
    event = get_object_or_404(Compliant, id=event_id)
    if event.user != request.user:
        # Ensure that the logged-in user owns the complaint being edited
        return HttpResponseForbidden()

    if request.method == 'POST':
        form = Compliant_Form(request.POST, request.FILES, instance=event)
        if form.is_valid():
            form.save()
            return redirect('event_list')
    else:
        form = Compliant_Form(instance=event)
    return render(request, 'govt_event/edit_event.html', {'form': form, 'event': event})




@login_required
def delete_event(request, event_id):
    event = get_object_or_404(Compliant, pk=event_id)
    if event.user != request.user:
        # Ensure that the logged-in user owns the complaint being deleted
        return HttpResponseForbidden()

    event.delete()
    return redirect('event_list')

from django.contrib.auth.decorators import login_required


from django.contrib.auth.decorators import login_required

@login_required
def compliant_status(request):
    # Retrieve aadhar_no from session if available
    aadhar_no = request.session.get('aadhar_no')
    if aadhar_no is not None:
        # Filter complaints based on aadhar_no
        events = Compliant.objects.filter(aadhar_no=aadhar_no)
        return render(request, 'compliant_status.html', {'events': events})
    else:
        # Handle the case where aadhar_no is not available in session
        messages.error(request, 'User session data not found.')
        return redirect('login')  # Redirect to login page or handle appropriately
