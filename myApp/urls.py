from django.urls import path
from myApp.views import *
from django.contrib.admin.views.decorators import staff_member_required
from django.conf import settings
from django.conf.urls.static import static

# urls.py
from django.urls import path
from .views import event_list, create_event,  delete_event

urlpatterns = [
    
    path('',Home, name='home'),
    path('about/',About, name='about'),
    path('accounts/login/',login, name='login'),
    path('register/' , register, name='register'),
    #password reset path
    path('password_reset/', password_reset, name='password_reset'),
    path('events/', event_list, name='event_list'),
    path('create_event/', create_event, name='create_event'),
    path('events/<int:event_id>/edit/', edit_event, name='edit_event'),
    path('events/<int:event_id>/delete/', delete_event, name='delete_event'),
    path('compliant_status/',compliant_status, name='compliant_status'),
    
]
# Serve static files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


