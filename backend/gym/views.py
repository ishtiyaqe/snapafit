from multiprocessing import context
from venv import create
from django.shortcuts import render
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import HttpResponse, JsonResponse
import json
import requests
from sympy import content
from .forms import *
from .models import *
from snipet.models import *
from .openai import *
import stripe
from django.conf import settings
from django.forms.models import model_to_dict
import openai
from django.utils import timezone
from datetime import timedelta
from django.utils.dateparse import parse_datetime
from django.http import Http404
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import threading
from datetime import timedelta, date
from .utils import send_whatsapp_message
from decimal import Decimal
from .serializer import *

from django.utils.timezone import now, localtime, make_aware
from datetime import timedelta
from django.db.models import Count, Sum




def home(request):
    hr = Home_hero_section_Images.objects.first()
    pp = Why_Choose_Us_Images.objects.last()
    hw = list(Home_how_it_work_Images.objects.all()[:3].values())
    sy = list(What_our_Client_says.objects.all()[:3].values())
    tls = list(Home_What_Our_Clients_Say_About_Us.objects.all()[:3].values())
    packages = list(GymPackage.objects.all()[:2].values())
    faqs = list(FAQ.objects.all().values())
    
    package_elements = {}
    for package in packages:
        package_id = package['id']
        elements = Gym_Pakage_elements.objects.filter(gym_package_id=package_id).values()
        package_elements[package_id] = list(elements)

    # Extract fields to serialize hr and pp
    hr_data = {'id': hr.id, 'image_url': hr.image.url} if hr else None
    pp_data = {'id': pp.id, 'image_url': pp.image.url} if pp else None

    context = {
        'hr': hr_data,
        'pp': pp_data,
        'hw': hw,
        'sy': sy,
        'tls': tls,
        'faqs': faqs,
        'packages': packages,
        'package_elements': package_elements,
    }
    
    return JsonResponse(context, safe=False)


@login_required
def Current_weight(request):
    abs = UserAssessment.objects.get(user = request.user)
    count = abs.weight
    contect = {
        'count': count, 
    }
    return JsonResponse(contect, safe=False)


from rest_framework.decorators import api_view
@api_view(['GET'])
@login_required
def equipment_lists(request):
    eld =  equipment_list.objects.all()
    al=equipment_listSerializer(eld, many=True)
    
    return Response(al.data)


@login_required
def target_list(request):
    eld =  Exercise.objects.all()
    lsd = []
    for ield in eld:
        if ield.target not in lsd:
            lsd.append(ield.target)
    contect = {
        'eqp_list': lsd, 
    }
    return JsonResponse(contect, safe=False)

from django.utils.timezone import now
from django.db.models.functions import Cast
from django.db.models import FloatField

@login_required
def Total_burun(request):
    today = now().date()
    total_calories = UserWorkoutTaken.objects.filter(
        user=request.user,
        created_at__date=today
    ).annotate(
        calorys_decimal=Cast('calorys', FloatField())
    ).aggregate(
        total=Sum('calorys_decimal')
    )['total']
    
    # Handle case where total_calories might be None
    total_calories = total_calories if total_calories is not None else Decimal(0)
    
    context = {
        'count': total_calories,
    }
    return JsonResponse(context, safe=False)

# Set your Stripe secret key
stripe.api_key = 'sk_test_51QAD3j05xAWFmGaFNU4zRs7gSsDiP44nkltg7Rm5RlXrQc5yHOCvbIc8iUJji4RTntXy18BdBKwRCdJeKUr2Rttd00YX2WAxIV'

YOUR_DOMAIN = 'http://localhost:5173'  # Adjust your domain here
from django.http import JsonResponse, HttpResponseRedirect
@csrf_exempt
def create_checkout_session(request):

    print(request)
    if request.method == 'POST':
        try:
            # Extract data from JSON request body
            data = json.loads(request.body)
            print(data)

            package_id = data.get('package_id')
            coupon = data.get('coupon')  # Optional, can be None

            if not package_id:
                return JsonResponse({'error': 'Missing required parameters'}, status=400)
            gym_package=GymPackage.objects.get(price_id=package_id)
            pb = 0
            coupon_price = gym_package.discounted_price_usd
            order = Order.objects.create(user=request.user,gym_package=gym_package,cupon_code=coupon,price=coupon_price)
            pb = str(coupon_price)
           
     
            # Create Stripe Checkout session
            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        'price': package_id,
                        'quantity': 1,  # You can make this dynamic as needed
                    },
                ],
                discounts=[{"coupon": coupon}],
                mode='payment',
                success_url=f"{YOUR_DOMAIN}/success?session_id={{CHECKOUT_SESSION_ID}}&package_id={order.id}",
                cancel_url=YOUR_DOMAIN + '/canceled',
            )

            al = CheckoutSession.objects.create(
                session_id=checkout_session.id,  # Save the session ID
                package_id=package_id
            )
            order.payment_id = al.id
            order.save()

            return JsonResponse({'checkout_url': checkout_session.url})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    # Redirect to the Stripe Checkout session URL
    return HttpResponseRedirect(checkout_session.url)

@csrf_exempt
def create_token_checkout_session(request):

    print(request)
    if request.method == 'POST':
        try:
            # Extract data from JSON request body
            data = json.loads(request.body)
            print(data)

            package_id = data.get('package_id')

            if not package_id:
                return JsonResponse({'error': 'Missing required parameters'}, status=400)
           
            
            gym_package=Token_package.objects.get(stripe_name=package_id)
            # Create Stripe Checkout session
            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        'price': package_id,
                        'quantity': 1,  # You can make this dynamic as needed
                    },
                ],
                mode='payment',
                success_url=f"{YOUR_DOMAIN}/success?session_id={{CHECKOUT_SESSION_ID}}&package_id={gym_package.quantity}",
                cancel_url=YOUR_DOMAIN + '/canceled',
            )

            CheckoutSession.objects.create(
                session_id=checkout_session.id,  # Save the session ID
                package_id=gym_package.quantity
            )


            return JsonResponse({'checkout_url': checkout_session.url})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    # Redirect to the Stripe Checkout session URL
    return HttpResponseRedirect(checkout_session.url)



def get_checkout_session(request, session_id):
    user = request.user
    try:
        session = CheckoutSession.objects.get(session_id=session_id)
        try:
            order = get_object_or_404(Order, payment_id=session.id, user = user)
            order.payment_status = 'success'
            if order.cupon_code:
                affiliat = affiliate.objects.get(affiliate_code=order.cupon_code)
                package = GymPackage.objects.get(id=order.gym_package.id)
                customer_commission = Decimal(affiliat.his_comission or '0.00')
                discount_amount = (customer_commission / 100) * package.discounted_price_usd
                affiliat.total_amunt += discount_amount
                affiliat.total_order += 1
                affiliat.total_clicks += 1
                affiliat.save()
            order.save()
            return JsonResponse({
                'session_id': session.session_id,
                'package_id': session.package_id,
                'created_at': session.created_at
            })
        except:
            a = Token.objects.get(user=user)
            a.total_token += int(session.package_id)
            a.save()
            session.package_id = 0
            session.save()
            return JsonResponse({
                'session_id': session.session_id,
                'package_id': session.package_id,
                'created_at': session.created_at
            })

    except CheckoutSession.DoesNotExist:
        return JsonResponse({'error': 'Session not found'}, status=404)


def PricePage(request, id):
    package = GymPackage.objects.get(id=id)  # Fetch the package with that id
    sr = GymPackageSerializer(package)
    return JsonResponse(sr.data, safe=False)


def success_view(request):
    return JsonResponse({'message': 'Payment successful!', 'status': 'success'})

def cancel_view(request):
    return JsonResponse({'message': 'Payment canceled!', 'status': 'canceled'})

def OrderSuccessPage(request):
    return render(request, 'pages/OrderSuccessPage.html')


def About_Us(request):
    b = About_us_page.objects.last()
    context = {
        'b':b,
    }
    return render(request, 'pages/About_Us.html', context)


def privacyPage(request):
    return render(request, 'pages/privacyPage.html')


def TermsPage(request):
    return render(request, 'pages/TermsPage.html')

from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q

class PostPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100



@api_view(['GET'])
def search_post_list_json(request):
    query = request.GET.get('q', '')  # Get the search query from the request
    print(query)
    if query:
        posts = Post.objects.filter(title__icontains=query).order_by('-date_posted')
    else:
        posts = Post.objects.all().order_by('-date_posted')

    paginator = PostPagination()
    result_page = paginator.paginate_queryset(posts, request)
    serializer = PostSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
def post_detail(request, pk):
    posts = get_object_or_404(Post, pk=pk)
    serializer = PostSerializer(posts)
    return Response(serializer.data)




@api_view(['GET'])
def search_nutration_post_list_json(request):
    query = request.GET.get('q', '')  # Get the search query from the request
    print(query)
    if query:
        posts = Nutations.objects.filter(title__icontains=query).order_by('-date_posted')
    else:
        posts = Nutations.objects.all().order_by('-date_posted')

    paginator = PostPagination()
    result_page = paginator.paginate_queryset(posts, request)
    serializer = NutationsSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)
    

@api_view(['GET'])
def nutration_post_detail(request, pk):
    posts = get_object_or_404(Nutations, pk=pk)
    serializer = NutationsSerializer(posts)
    return Response(serializer.data)

@login_required
def checkout(request, package_id):
    package = GymPackage.objects.get(id=package_id)
    context = {
        'package': package,
        'stripe_public_key': settings.STRIPE_PUBLISHABLE_KEY,
    }
    return render(request, 'pages/CheckOutPage.html', context)


openai.api_key = 'Your api key '

def calculate_user_score(bmi):
    # Example scoring function based on BMI
    if bmi < 18.5:
        return 1
    elif 18.5 <= bmi < 24.9:
        return 2
    elif 25 <= bmi < 29.9:
        return 3
    else:
        return 4

def generate_practice_schedule(user_score):
    # Example practice schedule generation based on user score
    if user_score == 1:
        return "Beginner schedule: 2 days of light exercises, 2 days of rest."
    elif user_score == 2:
        return "Intermediate schedule: 3 days of moderate exercises, 1 day of rest."
    elif user_score == 3:
        return "Advanced schedule: 4 days of intense exercises."
    else:
        return "Custom schedule: tailored exercises based on specific needs."  
    
@login_required
def user_assessment_page(request):
    user = request.user  # Correctly access the current user object
    assessment_exists = UserAssessment.objects.filter(user=user).exists()
    l = UserDetailsForm.objects.last()
    if not assessment_exists:
        form = UserAssessmentForm()
        context = {
          'form': form,
          'l': l,
            
        }
        return render(request, 'pages/UserAssessmentPage.html', context)
    else:
        return redirect('workout_view')
@login_required
def workout_view(request):
    user = request.user
    try:
        obs = UserAssessment.objects.get(user=user)
    except:
        return JsonResponse('No User data. Please Fill Data First.', safe=False)
    try:
        # Retrieve the user's latest successful order
        order = Order.objects.filter(user=user, payment_status='success').last()
    except Order.DoesNotExist:
        order = None

    # Check if the order is valid
    if order:
        package_duration_days = order.gym_package.duration_months * 30  # Assuming 30 days per month
        expiration_date = order.created_at + timedelta(days=package_duration_days)
        remaining_days = (expiration_date - timezone.now()).days
        
        if remaining_days > 0:
            workout_schedules = WorkoutSchedule.objects.filter(user=user)
            
            if not workout_schedules.exists():
                obs = UserAssessment.objects.get(user=user)
                thread = threading.Thread(target=background_process_user_assessment, args=(request, obs))
                thread.start()
                return JsonResponse('No Workout. Please generate.', safe=False)
            
            workout_schedule = workout_schedules.first()  # Adjust as per your logic
            today = localtime(now()).date()

            bl = UserAssessment.objects.filter(user=user).last()
            total_days_gone = (today - bl.created_at.date()).days + 1
            print("Total day done:",total_days_gone)
            try:
                workout_days = WorkoutScheduleDay.objects.get(workout=workout_schedule, day_number =total_days_gone)
                day_numbers = workout_days.day_number
                workout_days_json = json.loads(workout_days.day)
               
                workout_pge = WorkoutPge.objects.last()

                if workout_pge:
                    wr_data = {
                        'name': workout_pge.name,
                        'gif_url': workout_pge.gif.url if workout_pge.gif else None,
                    }
                else:
                    wr_data = None
                context = {
                    'workout_schedule': workout_schedule.id,
                    'day_number': day_numbers,
                    'workout_data': workout_days_json,
                    'wr': wr_data,
                }
                print(context)
                return JsonResponse(context)
            except WorkoutScheduleDay.DoesNotExist:
                obs = UserAssessment.objects.get(user=user)
                thread = threading.Thread(target=background_process_user_assessment, args=(request, obs))
                thread.start()
                return JsonResponse('No Workout. Please generate.', safe=False)
        else:
            return JsonResponse('Free period finished, please create a new order to continue.', safe=False)     
    else:
        workout_schedules = WorkoutSchedule.objects.filter(user=user)
        
        if not workout_schedules.exists():
            obs = UserAssessment.objects.get(user=user)
            thread = threading.Thread(target=background_process_user_assessment, args=(request, obs))
            thread.start()
            thread.join()
            # return JsonResponse('No Workout. Please generate.', safe=False)
        
        workout_schedule = workout_schedules.first()
        today = localtime(now()).date()
        print(today)
        bl = UserAssessment.objects.filter(user=user).last()
        created_at = localtime(obs.created_at).date()
        total_days_gone = (today - created_at).days  # Calculate the difference in days

        print(total_days_gone)
        if total_days_gone  <= 7:
        
            try:
                workout_days = WorkoutScheduleDay.objects.get(workout=workout_schedule, day_number =total_days_gone)
                day_numbers = workout_days.day_number
                workout_days_json = json.loads(workout_days.day)
               
                workout_pge = WorkoutPge.objects.last()

                if workout_pge:
                    wr_data = {
                        'name': workout_pge.name,
                        'gif_url': workout_pge.gif.url if workout_pge.gif else None,
                    }
                else:
                    wr_data = None
                context = {
                    'workout_schedule': workout_schedule.id,
                    'day_number': day_numbers,
                    'workout_data': workout_days_json,
                    'wr': wr_data,
                }
                print(context)
                return JsonResponse(context)
            except WorkoutScheduleDay.DoesNotExist:
                obs = UserAssessment.objects.get(user=user)
                thread = threading.Thread(target=background_process_user_assessment, args=(request, obs))
                thread.start()
                return JsonResponse('No Workout. Please generate.', safe=False)
        else:
            return JsonResponse('Free period finished, please create a new order to continue.', safe=False)     


from rest_framework import generics
class ExerciseDetailView(generics.RetrieveAPIView):
    serializer_class = ExerciseSerializer
    lookup_field = 'name'  # This will use the exercise name in the URL for lookup

    def get_queryset(self):
        # Use the 'name' parameter from the URL to filter the queryset
        name = self.kwargs.get(self.lookup_field)
        return Exercise.objects.filter(name=name)  # Return the exercise that matches the name

    def get(self, request, *args, **kwargs):
        exercise = self.get_object()  # This retrieves the object based on the lookup_field
        serializer = self.get_serializer(exercise)
        return Response(serializer.data, status=status.HTTP_200_OK)


stripe.api_key = settings.STRIPE_SECRET_KEY



stripe.api_key = settings.STRIPE_SECRET_KEY

# This is your Stripe CLI webhook secret for testing your endpoint locally.
endpoint_secret = settings.STRIPE_WEBHOOK_SECRET


def background_process_user_assessment(request, user_assessment):
    result = process_user_assessments(request, user_assessment)
    print(result)


@login_required
def success(request, pk):
    session_id = request.GET.get('session_id')
    if not session_id:
        raise Http404("Session ID is missing")
    
    try:
        # Retrieve the session from Stripe
        checkout_session = stripe.checkout.Session.retrieve(session_id)
        
        # Retrieve the order from the database
        order = get_object_or_404(Order, id=pk)
        
        # Check if the session ID matches the one stored in the metadata
        if checkout_session.metadata.get('order_id') == str(order.id):
            order.payment_status = "success"
            if order.cupon_code:
                affiliat = affiliate.objects.get(affiliate_code=order.cupon_code)
                package = GymPackage.objects.get(id=order.gym_package.id)
                customer_commission = Decimal(affiliat.his_comission or '0.00')
                discount_amount = (customer_commission / 100) * package.discounted_price_usd
                affiliat.total_amunt += discount_amount
                affiliat.save()
            order.save()
            obs = UserAssessment.objects.get(user=request.user)
            
            thread = threading.Thread(target=background_process_user_assessment, args=(request, obs))
            thread.start()
           
           
            return render(request, 'pages/success.html', {'order': order})
            
           
        else:
            raise Http404("Session ID does not match the order")
    
    except stripe.error.StripeError as e:
        raise Http404(f"Stripe error: {str(e)}")
    
    except Order.DoesNotExist:
        raise Http404("Order not found")
    
    except Exception as e:
        raise Http404(f"An error occurred: {str(e)}")




@csrf_exempt
def validate_coupon(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            coupon_code = data.get('coupon_code')
            package_id = data.get('package_id')
            
            if not coupon_code or not package_id:
                return JsonResponse({'valid': False, 'message': 'Coupon code and package ID are required'})

            try:
                affiliat = affiliate.objects.get(affiliate_code=coupon_code)
                if affiliat.total_clicks is None:
                    affiliat.total_clicks = 0
                affiliat.total_clicks += 1
                affiliat.save()

                package = GymPackage.objects.get(id=package_id)
                customer_commission = Decimal(affiliat.customer_comission or '0.00')
                discount_amount = (customer_commission / 100) * package.discounted_price_usd
                new_price = package.discounted_price_usd - discount_amount

                return JsonResponse({
                    'valid': True,
                    'new_price': float(new_price),
                    'customer_commission': float(customer_commission)
                })
            except affiliate.DoesNotExist:
                return JsonResponse({'valid': False, 'message': 'Invalid coupon code'})
            except GymPackage.DoesNotExist:
                return JsonResponse({'valid': False, 'message': 'Invalid package ID'})
            except Exception as e:
                return JsonResponse({'valid': False, 'message': str(e)})

        except json.JSONDecodeError:
            return JsonResponse({'valid': False, 'message': 'Invalid JSON'})

    return JsonResponse({'valid': False, 'message': 'Invalid request method'})



def send_custom_whatsapp_message(request):
    if request.method == 'POST':
        recipient_number = request.POST.get('recipient_number')
        message_text = request.POST.get('message_text')

        response = send_whatsapp_message(recipient_number, "text", {"preview_url": False, "body": message_text})
        print(response)
        if response.status_code == 200:
            return JsonResponse({'status': 'success', 'message': 'Message sent successfully.'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Failed to send message.'})

    return render(request, 'pages/send_whatsapp_message.html')



from django.shortcuts import render, redirect
from django.urls import reverse
import paypalrestsdk


paypalrestsdk.configure({
    "mode":  "sandbox",  # sandbox or live
    "client_id": "AaQTjH38GHVrQCrx4QkZ5UcqYVfthMO4DT_7Gmxf735ybj2JVrgwq_oRD7R70dUdfuKB7UAM2Lh4vAFY",
    "client_secret": "EMVgltJDegAfYvifj-HZO6ryDoGk7iLcSlqICMWrIXtyCrcMqbrDXFSTYTqhpRd9yGxZAcTgWfhb5aUY",
})


def create_payment(request):
    if request.method == 'POST':
        coupon_price = request.POST.get('coupon_price')
        pakage_id = request.POST.get('pakage_id')
        coupon_code = request.POST.get('v_cupon_code')
        gym_package=GymPackage.objects.get(id=pakage_id)
        pb = 0
        order = Order.objects.create(user=request.user,gym_package=gym_package,cupon_code=coupon_code,price=coupon_price)
        pb = str(coupon_price)
        payment = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": request.build_absolute_uri(reverse('payment_success', args=[order.id])),
                "cancel_url": request.build_absolute_uri(reverse('payment_cancel'))
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": gym_package.name,
                        "price": pb,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "total": pb,
                    "currency": "USD"
                },
                "description": f"Payment for Order #{order.id}"
            }]
        })

        if payment.create():
            order.payment_id = payment.id
            order.save()
            return redirect(payment.links[1].href)  # Redirect to PayPal for payment
        else:
            return JsonResponse({'error': payment.error})
    else:
        return JsonResponse({'error': 'Invalid request method'})

def payment_success(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    payment_id = request.GET.get('paymentId')
    payer_id = request.GET.get('PayerID')

    payment = paypalrestsdk.Payment.find(payment_id)
    if payment.execute({"payer_id": payer_id}):
        order.payment_status = 'success'
        order.payment_id = payment_id
        order.save()

        # Update Affiliate model if coupon code exists
        if order.cupon_code:
            try:
                affiliates = affiliate.objects.get(affiliate_code=order.cupon_code)
                package_price = order.gym_package.discounted_price_usd
                commission = Decimal(affiliates.his_comission)
                discount_amount = (commission / 100) * package_price
                affiliates.total_amunt += discount_amount
                affiliates.total_order += 1
                affiliates.save()
            except affiliate.DoesNotExist:
                pass  # Handle if affiliate not found

        # Run another job or process here if needed
        obs = UserAssessment.objects.get(user=request.user)
        thread = threading.Thread(target=background_process_user_assessment, args=(request, obs))
        thread.start()

        return render(request, 'pages/success.html')
    else:
        print(payment.error)
        return redirect('payment_failed')

def payment_cancel(request):
    return render(request, 'pages/cancel.html')

def payment_failed(request):
    return render(request, 'pages/cancel.html')




def user_assessment_detail(request):
    try:
        user_assessment = get_object_or_404(UserAssessment, user=request.user)
        form = UserAssessmentForm(instance=user_assessment)
        return render(request, 'pages/user_assessment_detail.html', {'user_assessment': user_assessment, 'form': form})
    except:
        return redirect(user_assessment_page)
def update_user_assessment(request):
    if request.method == 'POST':
        user_assessment = get_object_or_404(UserAssessment, user=request.user)
        form = UserAssessmentForm(request.POST, request.FILES, instance=user_assessment)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors})
    return JsonResponse({'status': 'invalid request'})



def exercise_details_view(request):
    if request.method == 'GET' and 'exercise_name' in request.GET:
        exercise_name = request.GET['exercise_name']
        exercise_name_lower = exercise_name.lower()
        print(exercise_name_lower)
        exercises = Exercise.objects.filter(name = exercise_name_lower).last()
        print(exercises)
        if exercises:
            serializer = ExerciseSerializer(exercises)
            print(serializer.data)
            return JsonResponse(serializer.data)
        else:
            return JsonResponse({"error": "Exercise not found"}, status=404)
    return JsonResponse({"error": "Exercise name not provided"}, status=400)





@csrf_exempt
@require_POST
def complete_workout(request):
    try:
        data = json.loads(request.body)
        day_number = data.get('day_number')
        workout_name = data.get('workout_name')
        calories = data.get('calories')
        
        # Convert calories to integer if it's a number in string format
        if isinstance(calories, str):
            calories = int(calories.replace(" kcal", "").strip())
        elif isinstance(calories, int):
            calories = calories  # Already an integer

        print(day_number, workout_name, calories)  # Debugging print
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)

    if request.user.is_authenticated:
        user = request.user
        
        # Create a new instance of UserWorkoutTaken
        UserWorkoutTaken.objects.get_or_create(
            user=user,
            day_number=day_number,
            workout_name=workout_name,
            calorys=calories,
            user_completed=True
        )
        
        return JsonResponse({'status': 'success', 'message': 'Workout marked as completed'})
    else:
        return JsonResponse({'status': 'error', 'message': 'User not authenticated'}, status=401)

def calculate_calories(day_json):
    total_calories = 0
    for section in day_json.values():
        for exercise in section:
            for exercise_name, details in exercise.items():
                calories = details.get("calories", "0 kcal")
                calories_value = int(calories.split()[0])  # Extract numerical value
                total_calories += calories_value
    return total_calories

@login_required
def get_user_progress_data(request):
    user = request.user
    today = localtime(now()).date()  # Get today's date in the local timezone
    start_of_month = today.replace(day=1)
    print(today)
    print(start_of_month)
    print(today)
    # Completed exercises and calories today
    exercises_today = UserWorkoutTaken.objects.filter(
        user=user,
        user_completed=True,
        updated_at__date=today
    ).aggregate(total_exercises=Count('id'))['total_exercises'] or 0
    
    calories_today = UserWorkoutTaken.objects.filter(
        user=user,
        user_completed=True,
        updated_at__date=today
    ).aggregate(total_calories=Sum('calorys'))['total_calories'] or 0
    
    # Completed exercises and calories this month
    exercises_month = UserWorkoutTaken.objects.filter(
        user=user,
        user_completed=True,
        created_at__date__gte=start_of_month
    ).aggregate(total_exercises=Count('id'))['total_exercises'] or 0
    
    calories_month = UserWorkoutTaken.objects.filter(
        user=user,
        user_completed=True,
        created_at__date__gte=start_of_month
    ).aggregate(total_calories=Sum('calorys'))['total_calories'] or 0
    
    print(f"exercises_today: {exercises_today}, calories_today: {calories_today}")
    print(f"exercises_month: {exercises_month}, calories_month: {calories_month}")
    
    data = {
        'exercises_today': exercises_today,
        'exercises_month': exercises_month,
        'calories_today': calories_today,
        'calories_month': calories_month,
    }
    
    return JsonResponse(data)


@login_required
def get_workout_chart_data(request):
    user = request.user
    today = date.today()
    start_of_week = today - timedelta(days=today.weekday())  # Monday of the current week

    # Aggregate data for the current week
    weekly_data = UserWorkoutTaken.objects.filter(
        user=user,
        user_completed=True,
        updated_at__date__gte=start_of_week
    ).values('updated_at__date').annotate(
        total_calories=Sum('calorys'),
        total_exercises=Count('id')
    )

    data = {
        'days': [],
        'calories': [],
        'exercises': []
    }

    for day in range(7):  # Iterate over the days of the week
        current_day = start_of_week + timedelta(days=day)
        day_data = next((item for item in weekly_data if item['updated_at__date'] == current_day), None)
        data['days'].append(current_day.strftime('%a'))  # Abbreviated weekday name
        if day_data:
            data['calories'].append(day_data['total_calories'])
            data['exercises'].append(day_data['total_exercises'])
        else:
            data['calories'].append(0)
            data['exercises'].append(0)

    return JsonResponse(data)


def check_workout_status(request):
    workout_name = request.GET.get('workout_name')
    day_number = request.GET.get('day_number')
    user = request.user
    
    try:
        workout = UserWorkoutTaken.objects.get(user=user,day_number=day_number, workout_name=workout_name)
        if workout.user_completed:
            return JsonResponse({'completed': True})
    except UserWorkoutTaken.DoesNotExist:
        pass
    
    return JsonResponse({'completed': False})






from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.models import SocialAccount
from rest_framework.authtoken.models import Token
from django.core.exceptions import ValidationError
from allauth.socialaccount.helpers import complete_social_login
from allauth.exceptions import ImmediateHttpResponse
from django.contrib.auth import authenticate
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm

from rest_framework.settings import api_settings
from rest_framework.test import APIClient
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import permission_classes, authentication_classes

from rest_framework import status, permissions, views
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

from .serializers import *
from rest_framework.views import APIView


class UserView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	##
	def get(self, request):
		serializer = UserSerializer(request.user)
		return Response({'user': serializer.data}, status=status.HTTP_200_OK)
    
class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        data = request.data
        username = data.get('username')
        password = data.get('password')
        serializer = UserLoginSerializer(data=data)

        if not username or not password:
            return Response({'error': 'Invalid input data'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request=request, username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            error_message = 'User not found or incorrect password'
            return Response({'error': error_message}, status=status.HTTP_401_UNAUTHORIZED)
        
        

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

    def post(self, request, *args, **kwargs):
        # Perform Google login
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            # Google login successful, retrieve the user data
            token_key = response.data.get('key')
            if token_key:
                print(token_key)
                try:
                    # Query the SocialToken model to find the user associated with the provided key
                    social_token = Token.objects.get(key=token_key)
                    user = social_token.user
                    print(social_token)
                    print(user)
                    # Authenticate and log in the user
                    if user:
                        user = authenticate(request=request, username=user.username)
                        login(request, user)
                        return Response({'message': 'Login successful','key':token_key}, status=status.HTTP_200_OK)
                    else:
                        error_message = 'User not found'
                        return Response({'error': error_message}, status=status.HTTP_404_NOT_FOUND)
                except Token.DoesNotExist:
                    error_message = 'Social token does not exist'
                    return Response({'error': error_message}, status=status.HTTP_404_NOT_FOUND)
        return response
    
    
 
    
    
class UserLogout(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)


    
class MyAccountView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def get(self, request, format=None):
        user = request.user

        # Fetch all search queries associated with the current user
        # search_queries = SearchQuery.objects.filter(user=user)

        # Serialize the search queries
        search_query_data = []
        # for query in search_queries:
        #     search_query_data.append({
        #         'id': query.id,
        #         'query': query.query,
        #         'status': query.status,
        #         # 'product': ProductSerializer(query.product).data if query.product else None,
        #     })

        # Serialize the user data
        user_serializer = UserSerializer(user)

        # Return the serialized data
        return Response({
            'user': user_serializer.data,
            # 'search_queries': search_query_data,
        })

    def delete(self, request, format=None):
        user = request.user
        query_id = request.data.get('query_id')

        if not query_id:
            return Response({"error": "Query ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        # try:
        #     search_query = SearchQuery.objects.get(id=query_id, user=user)
        #     search_query.delete()
        #     return Response({"message": "Search query deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        # except SearchQuery.DoesNotExist:
        #     return Response({"error": "Search query not found"}, status=status.HTTP_404_NOT_FOUND)
        
  
    
        


from .validations import *

class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        clean_data = custom_validation(request.data)
        serializer = UserRegisterSerializer(data=clean_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(clean_data)

   
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET'])
def user_affiliate(request):
    if request.user.is_authenticated:
        try:
            user_affiliate = affiliate.objects.get(user=request.user)
            serializer = affiliateSerializer(user_affiliate)
            return Response(serializer.data)
        except affiliate.DoesNotExist:
            return Response({'error': 'Affiliate data not found'}, status=404)
    else:
        return Response({'error': 'User not authenticated'}, status=401)


@api_view(['GET'])
def GymCoach(request):
    queryset = Gym_Coach.objects.all()
    serializer_class = GymCoachSerializer(queryset, many=True)
    return Response(serializer_class.data)



class UserProfileCreateView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        coach = data.pop('coach', None)
        find_coach = Gym_Coach.objects.get(id = coach)
        # Map the incoming data fields to match the model fields
        data['practice_location'] = data.pop('practiceLocation', None)
        data['schedule'] = data.pop('shidule', None)
        data['target_area'] = data.pop('targetArea', None)
        data['equipment'] = data.pop('equipment', None)
        data['fit'] = data.pop('fit', None)
        data['gender'] = data.pop('gender', None)
        data['height'] = data.pop('height', None)
        data['weight'] = data.pop('weight', None)
        data['coach'] = find_coach
        
        # Add the logged-in user to the data
        data['user'] = request.user

        # Use the user field as the lookup key
        profile, created = UserAssessment.objects.update_or_create(
            user=request.user,
            defaults=data
        )

        serializer = UserProfileSerializersss(profile)
        return Response(serializer.data, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)

    





class UserProfileDetailView(APIView):
    def get(self, request, *args, **kwargs):
        # Filter the UserAssessment by the logged-in user
        try:
            user_assessment = UserAssessment.objects.get(user=request.user)
        except UserAssessment.DoesNotExist:
            return Response({"detail": "User assessment not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileSerializersss(user_assessment)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

# Cache to store image URLs
image_cache = {}
import time
def get_first_image_url(query, token):
    if query in image_cache:
        return image_cache[query]
    
    url = "https://api.pexels.com/v1/search"
    headers = {
        "Authorization": token
    }
    params = {
        "query": query,
        "per_page": 1
    }

    for attempt in range(5):  # Retry up to 5 times
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            response_data = response.json()
            if response_data.get('photos'):
                image_url = response_data['photos'][0]['src']['original']
                image_cache[query] = image_url  # Cache the result
                return image_url
            else:
                print("No images found.")
                return None
        elif response.status_code == 429:
            print("Rate limit exceeded. Retrying...")
            time.sleep(2 ** attempt)  # Exponential backoff
        else:
            print(f"Error: {response.status_code} - {response.text}")
            return None

def user_profiles(request):
    user = request.user.username
    content = {
        'user': user, 
    }
    return JsonResponse(content, safe=False)

def TokenView(request):
    user = request.user
    a = Token.objects.get(user = user)
    daa = TokenSerializer(a)
    return JsonResponse(daa.data, safe=False)



def Token_packageView(request):
    user = request.user
    a = Token_package.objects.all()
    daa = Token_packageSerializer(a, many=True)
    return JsonResponse(daa.data, safe=False)


def get_daily_quotes(request):
    today = date.today()
    a = Quotes.objects.filter(created_at__date=today).last()  # Get today's last quote
    
    if a:  # Check if a quote exists
        se = QuotesSerializer(a)  # Serialize the single instance
        return JsonResponse(se.data, safe=False)  # Return serialized data as a JSON response
    else:
        # No quote exists for today, generate a new one
        new_quote = generate_daily_quote()  # Generate and save new quote
        se = QuotesSerializer(new_quote)  # Serialize the new quote
        return JsonResponse(se.data, safe=False)  # Return the new quote as a JSON response


# Replace with your Pexels API key
API_KEY = "CJg8u7m8TTKv4jwF1oZlxptTe9TpYEIUuCpVAFrICMAEzdKHfM7W8aVy"

def today_nutrition_plan(request):
    user = request.user
    
    try:
        # Get the user's assessment data
        obs = UserAssessment.objects.get(user=user)
    except UserAssessment.DoesNotExist:
        return JsonResponse('No User data. Please fill in the data first.', safe=False)

    try:
        # Retrieve the user's latest successful order
        order = Order.objects.filter(user=user, payment_status='success').last()
    except Order.DoesNotExist:
        order = None
    import time
    def fetch_image(name):
        query = f"Only food image {name}"
        time.sleep(0.1)
        return get_first_image_url(query, API_KEY)
    
    # Check if the user has a valid order
    if order:
        package_duration_days = order.gym_package.duration_months * 30  # Assuming 30 days per month
        expiration_date = order.created_at + timedelta(days=package_duration_days)
        remaining_days = (expiration_date - timezone.now()).days
        
        if remaining_days > 0:
            try:
                today = localtime(now()).date()
                total_days_gone = (today - obs.created_at.date()).days + 1
                workout_schedules = NutritionPlan.objects.filter(user_assessment=obs, day_number=total_days_gone)
                
                if not workout_schedules.exists():
                    thread = threading.Thread(target=fetch_nutrition_data_from_api, args=(request, obs, total_days_gone))
                    thread.start()
                    return JsonResponse('No Nutrition Plan. Please generate one.', safe=False)
                
                nutrition_day = NutritionPlan.objects.get(user_assessment=obs, day_number=str(total_days_gone))
                day_numbers = nutrition_day.day_number

                # Retrieve the nutrition data (food items and their details)
                nutrition_data = {
                    'breakfast': list(nutrition_day.breakfast.items.values('name','image_url', 'calories','protein','carbs','fat')),
                    'lunch': list(nutrition_day.lunch.items.values('name','image_url', 'calories','protein','carbs','fat')),
                    'snack': list(nutrition_day.snack.items.values('name', 'image_url','calories','protein','carbs','fat')),
                    'dinner': list(nutrition_day.dinner.items.values('name', 'image_url','calories','protein','carbs','fat')),
                }
                context = {
                    'day_number': day_numbers,
                    'nutrition_data': nutrition_data,
                    'totalCalories':nutrition_day.total_calories,
                    'totalProtein':nutrition_day.total_protein,
                    'totalCarbs':nutrition_day.total_carbs,
                    'totalFat':nutrition_day.total_fat,
                }
                return JsonResponse(context, safe=False)
            except NutritionPlan.DoesNotExist:
                # Handle the case where the nutrition plan for today does not exist
                obs = UserAssessment.objects.get(user=user)
                thread = threading.Thread(target=fetch_nutrition_data_from_api, args=(request, obs, total_days_gone))
                thread.start()
                return JsonResponse('No Nutrition Plan for today. Please generate.', safe=False)

        else:
            return JsonResponse('Free period finished, please create a new order to continue.', safe=False)

    else:
            # Retrieve existing nutrition plans for the user
        nutrition_schedules = NutritionPlan.objects.filter(user_assessment=obs)
        
        today = localtime(now()).date()
        print(today)
        
        created_at = localtime(obs.created_at).date()
        total_days_gone = (today - created_at).days  # Calculate the difference in days
        # total_days_gone = 8
        print(total_days_gone)
        if not nutrition_schedules.exists():
            # If no nutrition schedules exist, generate one
            obs = UserAssessment.objects.get(user=user)
            thread = threading.Thread(target=fetch_nutrition_data_from_api, args=(request, obs, total_days_gone))
            thread.start()
            thread.join()

     
        
        if total_days_gone <= 7:  # Assuming a 7-day nutrition plan period
        
            try:
                # Fetch the corresponding nutrition plan for the current day
                nutrition_day = NutritionPlan.objects.get(user_assessment=obs, day_number=str(total_days_gone))
                day_numbers = nutrition_day.day_number

                # Retrieve the nutrition data (food items and their details)
                nutrition_data = {
                    'breakfast': list(nutrition_day.breakfast.items.values('name', 'image_url','calories','protein','carbs','fat')),
                    'lunch': list(nutrition_day.lunch.items.values('name', 'image_url','calories','protein','carbs','fat')),
                    'snack': list(nutrition_day.snack.items.values('name', 'image_url','calories','protein','carbs','fat')),
                    'dinner': list(nutrition_day.dinner.items.values('name','image_url', 'calories','protein','carbs','fat')),
                }
                
                # Fetch additional data from other related models (if applicable)
                workout_pge = WorkoutPge.objects.last()

                if workout_pge:
                    wr_data = {
                        'name': workout_pge.name,
                        'gif_url': workout_pge.gif.url if workout_pge.gif else None,
                    }
                else:
                    wr_data = None

                # Prepare the context for the response
                context = {
                    'day_number': day_numbers,
                    'nutrition_data': nutrition_data,
                    'totalCalories':nutrition_day.total_calories,
                    'totalProtein':nutrition_day.total_protein,
                    'totalCarbs':nutrition_day.total_carbs,
                    'totalFat':nutrition_day.total_fat,
                }
                print(context)
                return JsonResponse(context)

            except NutritionPlan.DoesNotExist:
              
                return JsonResponse('No Nutrition Plan for today. Please generate.', safe=False)

        else:
            # If the free period is over, inform the user to create a new order
            return JsonResponse('Free period finished, please create a new order to continue.', safe=False)
