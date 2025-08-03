from django.contrib import admin
from .models import *
from .forms import *
# Register your models here.


class About_us_pageAdmin(admin.ModelAdmin):
    list_display = ('image','content')

admin.site.register(About_us_page, About_us_pageAdmin)

class What_our_Client_saysAdmin(admin.ModelAdmin):
    list_display = ('name', 'comment','image')

admin.site.register(What_our_Client_says, What_our_Client_saysAdmin)

class Why_Choose_Us_VideoAdmin(admin.ModelAdmin):
    list_display = ('name', 'video',)

admin.site.register(Why_Choose_Us_Video, Why_Choose_Us_VideoAdmin)

class Why_Choose_Us_ImagesAdmin(admin.ModelAdmin):
    list_display = ('name', 'image',)

admin.site.register(Why_Choose_Us_Images, Why_Choose_Us_ImagesAdmin)

class Home_hero_section_ImagesAdmin(admin.ModelAdmin):
    list_display = ('name', 'image',)

admin.site.register(Home_hero_section_Images, Home_hero_section_ImagesAdmin)

class Home_how_it_work_ImagesAdmin(admin.ModelAdmin):
    list_display = ('name', 'image',)

admin.site.register(Home_how_it_work_Images, Home_how_it_work_ImagesAdmin)

class Home_What_Our_Clients_Say_About_UsAdmin(admin.ModelAdmin):
    list_display = ('name', 'description',)

admin.site.register(Home_What_Our_Clients_Say_About_Us, Home_What_Our_Clients_Say_About_UsAdmin)

class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'answer',)

admin.site.register(FAQ, FAQAdmin)




class PostAdmin(admin.ModelAdmin):
    form = PostForm

admin.site.register(Post, PostAdmin)


  


@admin.register(UserDetailsForm)
class UserDetailsFormAdmin(admin.ModelAdmin):
    list_display = [field.name for field in UserDetailsForm._meta.fields]
  


@admin.register(WorkoutPge)
class WorkoutPgeAdmin(admin.ModelAdmin):
    list_display = [field.name for field in WorkoutPge._meta.fields]
 



@admin.register(Nutations)
class NutationsAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Nutations._meta.fields]
 