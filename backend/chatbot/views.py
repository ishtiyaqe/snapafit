from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.contrib.auth.models import User
from allauth.account.models import EmailAddress
from django.views.decorators.csrf import csrf_exempt
import json
import requests
from .models import *

# Create your views here.
PAGE_ACCESS_TOKEN = 'Your page access token'
VERIFY_TOKEN = 'your varify token'

# url = f'https://graph.facebook.com/v20.0/me/messenger_profile?access_token={PAGE_ACCESS_TOKEN}'
# payload = {
#     'get_started': {
#         'payload': 'GET_STARTED_PAYLOAD'
#     }
# }
# headers = {
#     'Content-Type': 'application/json'
# }
# response = requests.post(url, json=payload, headers=headers)
# print(response.json())

@csrf_exempt
def fb_webhook(request):
    if request.method == 'GET':
        mode = request.GET.get('hub.mode')
        token = request.GET.get('hub.verify_token')
        challenge = request.GET.get('hub.challenge')
        if mode == 'subscribe' and token == VERIFY_TOKEN:
            return HttpResponse(challenge)
        else:
            return HttpResponse('Error, invalid verification token')
    elif request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        for entry in data['entry']:
            for messaging_event in entry['messaging']:
                sender_id = messaging_event['sender']['id']
                recipient_id = messaging_event['recipient']['id']

                if 'message' in messaging_event:
                    handle_message(sender_id, messaging_event['message'])

                if 'postback' in messaging_event:
                    handle_postback(sender_id, messaging_event['postback'])

        return HttpResponse('OK')

def handle_postback(sender_id, postback):
    payload = postback.get('payload', '')

    if payload == 'GET_STARTED_PAYLOAD':
        user, created = FacebookUser.objects.get_or_create(fb_id=sender_id)
        if created or not user.name or not user.email:
            url = f'https://graph.facebook.com/{sender_id}?fields=first_name,last_name,email&access_token={PAGE_ACCESS_TOKEN}'
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                user.name = f"{data.get('first_name', '')} {data.get('last_name', '')}".strip()
                user.email = data.get('email', '')

                if user.email:
                    try:
                        auth_user = User.objects.get(email=user.email)
                    except User.DoesNotExist:
                        auth_user = User.objects.create(
                            username=user.email,
                            email=user.email,
                            first_name=data.get('first_name', ''),
                            last_name=data.get('last_name', '')
                        )
                        auth_user.set_unusable_password()
                        auth_user.save()
                        
                        EmailAddress.objects.create(user=auth_user, email=user.email, verified=True, primary=True)

                    user.user = auth_user
                user.save()
        send_language_selection_message(sender_id)

def send_language_selection_message(recipient_id):
    message_data = {
        'recipient': {
            'id': recipient_id
        },
        'message': {
            'text': 'Please choose your language:',
            'quick_replies': [
                {
                    'content_type': 'text',
                    'title': 'Arabic',
                    'payload': 'LANGUAGE_ARABIC'
                },
                {
                    'content_type': 'text',
                    'title': 'English',
                    'payload': 'LANGUAGE_ENGLISH'
                }
            ]
        }
    }
    call_send_api(message_data)

# def handle_message(sender_id, message):
#     if 'attachments' in message:
#         send_message(sender_id, 'Sorry, I can only process text messages.')
#     elif 'quick_reply' in message:
#         payload = message['quick_reply']['payload']
#         user, created = FacebookUser.objects.get_or_create(fb_id=sender_id)
#         if payload == 'LANGUAGE_ARABIC':
#             user.language = 'Arabic'
#             user.save()
#             send_message(sender_id, f'You selected Arabic. Your name is {user.name}.')
#         elif payload == 'LANGUAGE_ENGLISH':
#             user.language = 'English'
#             user.save()
#             send_message(sender_id, f'You selected English. Your name is {user.name}.')
#         else:
#             send_message(sender_id, 'Sorry, I can only process text messages.')
#     elif 'text' in message:
#         message_text = message['text']
#         send_message(sender_id, 'You said: ' + message_text)
#     else:
#         send_message(sender_id, 'Sorry, I can only process text messages.')


# Define a function to find the best matching question
def find_best_match(models, message_text):
    print(models)
    print(message_text)
    for model in models:
        questions = model.objects.filter(question__icontains=message_text)  # Case-insensitive search
        print(questions)
        if questions:
            for question in questions:
                print(question)
                best_match = question
                print(best_match)
                return best_match


def build_link_message_response(message, recipient_id):
    """Builds a Facebook Messenger response for AutoLinkMessage objects."""

    # Access message properties
    title = message.title
    subtitle = message.subtitle
    image_url = f"https://snapafit.com{message.imegs.url}" if message.imegs else None  # Concatenate base URL with image path
    link = message.link
    link = message.link
    button_link = message.button_link
    button_name = message.button_name

    # Define the messenger-specific message structure
    response = {
        "recipient": {
            'id': recipient_id
        },
        "message":{       
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": title,
                            "subtitle": subtitle if subtitle else None,  # Include subtitle only if it exists
                            "image_url": image_url,  # Include image URL if available
                            "default_action": {
                                "type": "web_url",
                                "url": link,  # Set the default action to open the link
                            },
                            "buttons": [
                                {
                                    "type": "web_url",
                                    "title": button_name,
                                    "url": button_link,  # Set button URL
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    print(response)
    return response


def build_button_message_response(message, recipient_id):
    """Builds a Facebook Messenger response for ButtonLinkMessage objects."""

    # Access message properties
    text = message.text
    button_link = message.button_link
    button_name = message.button_name

    # Define the messenger-specific message structure
    response = {
        "recipient": {
            'id': recipient_id
        },
        "message":{       
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": text,
                    "buttons": [
                        {
                            "type": "web_url",
                            "title": button_name,
                            "url": button_link,  # Set button URL
                        }
                    ]
                }
            }
        }
    }
    print(response)
    return response

def call_send_api(message_data):
    url = f'https://graph.facebook.com/v20.0/me/messages?access_token={PAGE_ACCESS_TOKEN}'
    headers = {'Content-Type': 'application/json'}
    try:
        response = requests.post(url, json=message_data, headers=headers)
        response.raise_for_status()
        print(f"Message sent successfully: {response.json()}")
    except requests.exceptions.HTTPError as err:
        print(f"HTTP error occurred: {err}")
        print(f"Response content: {response.content}")
    except Exception as err:
        print(f"Other error occurred: {err}")
        
        

def handle_message(sender_id, message):
    if 'attachments' in message:
        send_message(sender_id, 'Sorry, I can only process text messages.')
    elif 'quick_reply' in message:
        payload = message['quick_reply']['payload']
        user, created = FacebookUser.objects.get_or_create(fb_id=sender_id)
        if payload == 'LANGUAGE_ARABIC':
            user.language = 'Arabic'
            user.save()
            send_message(sender_id, f'You selected Arabic. Your name is {user.name}.')
        elif payload == 'LANGUAGE_ENGLISH':
            user.language = 'English'
            user.save()
            send_message(sender_id, f'You selected English. Your name is {user.name}.')
        else:
            send_message(sender_id, 'Sorry, I can only process text messages.')
    elif 'text' in message:
        message_text = message['text'].lower()  # Lowercase for case-insensitive matching

        # Find the best matching question across all models 
        all_models = [
            AutoMessageQuestion, 
            AutoLinkMessageQuestion, 
            ButtonLinkMessageQuestion,
            # Add additional models containing questions here
        ]
       
        best_match_question = find_best_match(all_models, message_text)
             
             
        if best_match_question:
            # Get the corresponding answer based on the model
            if isinstance(best_match_question.q_id, AutoMessage):  # Check the model type of q_id
                # answer = get_object_or_404(best_match_question.q_id.answer)  # Assuming answer_set for AutoMessage
                print(best_match_question.q_id)
                print(best_match_question.q_id.answer)
                answer = best_match_question.q_id.answer
                
                print(answer)
                send_message(sender_id, answer)
            elif isinstance(best_match_question.q_id, AutoLinkMessage):  # Check for AutoLinkMessage
                answer = best_match_question.q_id  # Answer is the AutoLinkMessage object itself
                response = build_link_message_response(answer, sender_id)
                call_send_api(response)
                # send_message(sender_id, response)  # Send the messenger-specific response
            elif isinstance(best_match_question.q_id, ButtonLinkMessage):  # Check for ButtonLinkMessage
                answer = best_match_question.q_id  # Answer is the ButtonLinkMessage object itself
                response = build_button_message_response(answer, sender_id)
                call_send_api(response)
            else:
                # Handle other model types if applicable
                pass
        else:
            send_message(sender_id, 'Sorry, I couldn\'t find a matching answer for your question.')
    else:
        send_message(sender_id, 'Sorry, I can only process text messages.')

# Define a function to calculate similarity (replace with your preferred method)
def calculate_similarity(text1, text2):
    # Implement your similarity calculation logic here
    # You can use libraries like fuzzywuzzy or simple string comparison techniques
    # This is a placeholder for your specific implementation
    return len(set(text1.split()) & set(text2.split())) / len(set(text1.split()) | set(text2.split()))



def call_send_api(message_data):
    url = f'https://graph.facebook.com/v20.0/me/messages?access_token={PAGE_ACCESS_TOKEN}'
    headers = {'Content-Type': 'application/json'}
    try:
        response = requests.post(url, json=message_data, headers=headers)
        response.raise_for_status()
    except requests.exceptions.HTTPError as err:
        print(f"HTTP error occurred: {err}")
    except Exception as err:
        print(f"Other error occurred: {err}")

def send_message(recipient_id, message_text):
    message_data = {
        'recipient': {
            'id': recipient_id
        },
        'message': {
            'text': message_text
        }
    }
    call_send_api(message_data)
