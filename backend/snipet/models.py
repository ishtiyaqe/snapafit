from django.db import models
from ckeditor.fields import RichTextField
from gym.models import *

# Create your models here.
    
class Home_hero_section_Images(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='Home_hero_section_Images/', null=True, blank=True)

class UserDetailsForm(models.Model):
    name = models.CharField(max_length=100)
    gif = models.FileField(upload_to='UserDetailsForm/', null=True, blank=True)
    

class WorkoutPge(models.Model):
    name = models.CharField(max_length=100)
    gif = models.FileField(upload_to='UserDetailsForm/', null=True, blank=True)
    

class Why_Choose_Us_Video(models.Model):
    name = models.CharField(max_length=100)
    video = models.FileField(upload_to='Why_Choose_Us_Video/', null=True, blank=True)
    
class Why_Choose_Us_Images(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='Why_Choose_Us_Images/', null=True, blank=True)
    
class What_our_Client_says(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='What_our_Client_says/', null=True, blank=True)
    comment = models.TextField()
    
    
class Home_how_it_work_Images(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='Home_hero_section_Images/', null=True, blank=True)
    
class Home_What_Our_Clients_Say_About_Us(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=1200)
    

    
class About_us_page(models.Model):
    image = models.ImageField(upload_to='About_us/', null=True, blank=True)
    content = RichTextField()

    

    
class Nutations(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='Post/', null=True, blank=True)
    content = RichTextField()
    date_posted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('post-detail', kwargs={'pk': self.pk})
    
class Post(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='Post/', null=True, blank=True)
    content = RichTextField()
    date_posted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('post-detail', kwargs={'pk': self.pk})
    
class FAQ(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()

    def __str__(self):
        return self.question
