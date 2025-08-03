from django.urls import path
from snipet import views
from .views import *
from .openai import *
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('home/', home, name='home'),
    path('About_us/', About_Us, name='About_us'),
    path('Pkg_Price/<int:id>/', PricePage, name='Price_page'),
    path('Privacy_policy/', privacyPage, name='privacyPage'),
    path('checkout/<int:package_id>/', checkout, name='checkout'),
    path('Terms_conditions/', TermsPage, name='TermsPage'),
    path('order_success/', OrderSuccessPage, name='order_success'),
    path('search_blog_post/', search_post_list_json, name='post_list_json'),
    path('post/<int:pk>/', post_detail, name='post-detail'),
    path('create-checkout-session/', create_checkout_session, name='create-checkout-session'),
    path('create-token-checkout-session/', create_token_checkout_session, name='create-token-checkout-session'),
    path('search_nutration_blog_post/', search_nutration_post_list_json, name='nutration_post_list_json'),
    path('nutrato_post/<int:pk>/', nutration_post_detail, name='nutration-post-detail'),
    path('nutrition/', today_nutrition_plan, name='today_nutrition_plan'),
    path('success/', success_view, name='success'),
    path('cancel/', cancel_view, name='cancel'),
    path('get-checkout-session/<str:session_id>/', get_checkout_session, name='get-checkout-session'), 
    path('validate_coupon/', validate_coupon, name='validate_coupon'),
    path('Token_package/', Token_packageView, name='Token_packageView'),
    path('send_whatsapp_message/', send_custom_whatsapp_message, name='send_custom_whatsapp_message'),
    path('success/<int:pk>/', success, name='success'),
    path('workout/', workout_view, name='workout_view'),
    path('assessment/', user_assessment_page, name='user-assessment'),
    path('process-assessment/', process_assessment, name='process-assessment'),
    path('Token_View/', TokenView, name='TokenView'),
    path('create-payment/', create_payment, name='create_payment'),
    path('user_profiles/', user_profiles, name='user_profiles'),
    path('payment/success/<int:order_id>/', payment_success, name='payment_success'),
    path('payment/cancel/', payment_cancel, name='payment_cancel'),
    path('payment/failed/', payment_failed, name='payment_failed'),


    
    path('user-assessment/', user_assessment_detail, name='user_assessment_detail'),
    path('update-user-assessment/', update_user_assessment, name='update_user_assessment'),
    path('equipment_list/', equipment_lists, name='equipment_list' ),
    path('target_list/', target_list, name='target_list' ),
    path('exercise-details/', exercise_details_view, name='exercise_details'),
    path('user/affiliate/', user_affiliate, name='user-affiliate'),
    path('get_daily_quotes/', get_daily_quotes, name='get_daily_quotes'),
    path('complete_workout/', complete_workout, name='complete_workout'),
    path('progress-data/', get_user_progress_data, name='user_progress'),
    path('chart/get_workout_data/', get_workout_chart_data, name='user_progress'),
    path('GymCoach/', GymCoach, name='GymCoach'),
    path('current_weight/', Current_weight, name="current_weight"),
    path('total_burn_today/', Total_burun, name="total_burn_today"),
    path('user-data/', UserProfileCreateView.as_view(), name='user-profile-create'),
    path('user-data/detail/', UserProfileDetailView.as_view(), name='user-profile-detail'),
    
    path('user/', UserView.as_view(), name='user'),
    path('auth/logout/', UserLogout.as_view(), name='user-logout'),
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('myaccount/', MyAccountView.as_view(), name='my-account'),
    path('signup/' , UserRegister.as_view() , name="signup"),
    path('login/' , UserLogin.as_view() , name="login"),
    path('exercises/<str:name>/', ExerciseDetailView.as_view(), name='exercise-detail'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)