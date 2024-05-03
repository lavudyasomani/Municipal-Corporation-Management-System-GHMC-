from django.contrib import admin
from .models import Compliant, State, District, Village, Registration
from django.contrib import admin
from .models import Compliant
from .models import Village, State, District

class StatusFilter(admin.SimpleListFilter):
    title = 'Status'
    parameter_name = 'status'

    def lookups(self, request, model_admin):
        return (
            ('closed', 'Closed'),
            ('pending', 'Pending'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'closed':
            return queryset.filter(status='Closed')
        if self.value() == 'pending':
            return queryset.filter(status='Pending')

class CompliantAdmin(admin.ModelAdmin):
    list_display = ('date', 'name', 'phone', 'status')  # Replace 'complaint_date' with 'date'
    list_filter = (StatusFilter,)  # Register the custom status filter

    actions = ['segregate_by_date']  # Register the custom admin action

    def segregate_by_date(self, request, queryset):
        dates = set(queryset.values_list('date', flat=True))  # Replace 'complaint_date' with 'date'
        for date in dates:
            complaints = queryset.filter(date=date)  # Replace 'complaint_date' with 'date'
            self.message_user(request, f"{complaints.count()} complaints on {date} segregated successfully.")
            # Perform any operation with 'complaints' for the current date

    segregate_by_date.short_description = "Segregate complaints by date"  # Set the action description

admin.site.register(Compliant, CompliantAdmin)
admin.site.register(State)
admin.site.register(District)
admin.site.register(Village)
admin.site.register(Registration)
