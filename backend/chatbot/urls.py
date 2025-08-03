from django.urls import path
from . import views

urlpatterns = [
    path('fb/webhook', views.fb_webhook),
]
