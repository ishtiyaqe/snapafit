from django.shortcuts import render
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
from .models import *

PAGE_ACCESS_TOKEN = 'EAAL5xJ4bub0BO0vQsxrvZB404Nz5GbQ75GikHaSX9RUaW67nT9UkBFJhvs9pQBy4bvfpniuvcC86WBfGj4B6zuCAC5Bu2OXRQxwHqEA7K3YBLut4F8782U2csZA42lA4FqiWfqEwGfQaPKBZBLfOHE0598rTOYmZCQ8TsMC4gHtknguH8hx7wYZA30Hy1UIxsPtbw95UsFKZBtDXlFTsrRxVifILo2UBFI'

@csrf_exempt
def fb_webhook(request):
    if request.method == 'GET':
        mode = request.GET.get('hub.mode')
        token = request.GET.get('hub.verify_token')
        challenge = request.GET.get('hub.challenge')
        if mode == 'subscribe' and token == 'EAAL5xJ4bub0BO95BuuoZBL7eyBBP8jZA76Q5mCy1ELTaJjAEuwFYN8AVty0lQtvF9nYhIhIaZBtrqfxnZAqHZBBq1yNpVdjh706bapMILZBtqM1vccZCX2BqRU5JWxQuwKp8mdhraA7nB5FMjvIhM3QLtPMAdsgAkgaPi0znNh10ZCRORc6AV2IZCUkpq6e7EZCluNSDOtB6BEUVXxCTZCZBQ3xOQicZARAZDZD':
            return HttpResponse(challenge)
        else:
            return HttpResponse('Error, invalid verification token')
    elif request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        for entry in data['entry']:
            for messaging_event in entry['messaging']:
                if messaging_event.get('message'):
                    sender_id = messaging_event['sender']['id']
                    recipient_id = messaging_event['recipient']['id']
                    message_text = messaging_event['message']['text']
                    send_message(sender_id, 'You said: ' + message_text)
        return HttpResponse('OK')

def send_message(recipient_id, message_text):
    params = {
        'access_token': PAGE_ACCESS_TOKEN,
        'recipient': json.dumps({'id': recipient_id}),
        'message': json.dumps({'text': message_text})
    }
    headers = {'Content-type': 'application/json'}
    r = requests.post('https://graph.facebook.com/v12.0/me/messages', params=params, headers=headers)
    
    
    

def home(request):
    return render(request, 'pages/HomePage.html')

def PricePage(request):
    packages = GymPackage.objects.all()
    return render(request, 'pages/PricePage.html', {'packages': packages})

@login_required
def CheckOutPage(request, package_id):
    package = get_object_or_404(GymPackage, id=package_id)

    if request.method == 'POST':
        # Create the order
        Order.objects.create(user=request.user, gym_package=package)
        return redirect('order_success')  # Assuming you have a success page

    return render(request, 'pages/CheckOutPage.html', {'package': package})

def OrderSuccessPage(request):
    return render(request, 'pages/OrderSuccessPage.html')


def About_Us(request):
    return render(request, 'pages/About_Us.html')


def privacyPage(request):
    return render(request, 'pages/privacyPage.html')


def TermsPage(request):
    return render(request, 'pages/TermsPage.html')



