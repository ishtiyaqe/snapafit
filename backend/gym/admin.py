from django.contrib import admin
from .forms import *
from .models import *

class GymPackageElementsInline(admin.TabularInline):
    model = Gym_Pakage_elements
    extra = 1  # Number of extra forms to display

class GymPackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'duration_months', 'price_usd', 'discount', 'discounted_price_usd')
    list_filter = ('duration_months',)
    search_fields = ('name',)
    inlines = [GymPackageElementsInline]  # Inline the GymPackageElements

    class Media:
        css = {'all': ('custom.css',)}

admin.site.register(GymPackage, GymPackageAdmin)





class WorkoutScheduleInline(admin.TabularInline):
    model = WorkoutScheduleDay
    extra = 1  # Number of extra forms to display

@admin.register(WorkoutSchedule)
class WorkoutScheduleAdmin(admin.ModelAdmin):
    list_display = [field.name for field in WorkoutSchedule._meta.fields]
    inlines = [WorkoutScheduleInline]
  


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Exercise._meta.fields]
    search_fields = ['name']


@admin.register(UserWorkoutTaken)
class UserWorkoutTakenAdmin(admin.ModelAdmin):
    list_display = [field.name for field in UserWorkoutTaken._meta.fields]
  


@admin.register(UserAssessmentHistory)
class UserAssessmentHistoryAdmin(admin.ModelAdmin):
    list_display = [field.name for field in UserAssessmentHistory._meta.fields]
  


@admin.register(WorkoutScheduleDay)
class WorkoutScheduleDayAdmin(admin.ModelAdmin):
    list_display = [field.name for field in WorkoutScheduleDay._meta.fields]
  


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Order._meta.fields]
  
  


@admin.register(UserAssessment)
class UserAssessmentAdmin(admin.ModelAdmin):
    list_display = [field.name for field in UserAssessment._meta.fields]


@admin.register(affiliate)
class affiliateAdmin(admin.ModelAdmin):
    list_display = [field.name for field in affiliate._meta.fields]
  

@admin.register(WorkoutPlan)
class WorkoutPlanAdmin(admin.ModelAdmin):
    list_display = ('user', 'goal', 'preferences', 'days_per_week', 'created_at')
    list_filter = ('goal', 'days_per_week')
    search_fields = ('user__user_id', 'goal')



class ConversationInline(admin.TabularInline):
    model = Message
    extra = 1  # Number of extra forms to display

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Conversation._meta.fields]
    inlines = [ConversationInline]



@admin.register(Quotes)
class QuotesAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Quotes._meta.fields]



@admin.register(Token)
class TokenAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Token._meta.fields]


@admin.register(Token_package)
class Token_packageAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Token_package._meta.fields]



@admin.register(Gym_Coach)
class Gym_CoachAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Gym_Coach._meta.fields]


@admin.register(equipment_list)
class equipment_listAdmin(admin.ModelAdmin):
    list_display = [field.name for field in equipment_list._meta.fields]



class NutritionItemAdmin(admin.ModelAdmin):
    list_display = [field.name for field in NutritionItem._meta.fields]
    search_fields = ('name',)

class MealAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Meal._meta.fields]
    search_fields = ('name',)

class NutritionPlanAdmin(admin.ModelAdmin):
    list_display = [field.name for field in NutritionPlan._meta.fields]
    search_fields = ('day_number',)
    # No need for filter_horizontal here

admin.site.register(NutritionItem, NutritionItemAdmin)
admin.site.register(Meal, MealAdmin)
admin.site.register(NutritionPlan, NutritionPlanAdmin)