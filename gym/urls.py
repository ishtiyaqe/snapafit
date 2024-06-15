from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('/About_us/', views.About_Us, name='About_us'),
    path('/Price/', views.PricePage, name='Price_page'),
    path('/Privacy_policy/', views.privacyPage, name='privacyPage'),
    path('/Checkout/<int:package_id>/', views.CheckOutPage, name='CheckOutPage'),
    path('/Terms_conditions/', views.TermsPage, name='TermsPage'),
    path('/order_success/', views.OrderSuccessPage, name='order_success'),
     path('fb/webhook', views.fb_webhook),
]
