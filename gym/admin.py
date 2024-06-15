from django.contrib import admin

from .models import *

class GymPackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'duration_months', 'price_usd', 'discount', 'discounted_price_usd')
    list_filter = ('duration_months',)
    search_fields = ('name',)

admin.site.register(GymPackage, GymPackageAdmin)