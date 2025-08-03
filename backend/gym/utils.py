# utils.py
import requests
from django.conf import settings

def send_whatsapp_message(recipient_number, message_type, message_content):
    url = f"https://graph.facebook.com/{settings.WHATSAPP_VERSION}/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {settings.WHATSAPP_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }
    data = {
        "messaging_product": "whatsapp",
        "to": recipient_number,
        "type": message_type,
        message_type: message_content,
    }
    response = requests.post(url, json=data, headers=headers)
    return response
