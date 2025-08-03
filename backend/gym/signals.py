# yourapp/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from .models import Message, Conversation

@receiver(post_save, sender=Message)
def notify_message_update(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    group_name = f'chat_{instance.conversation.room}'

    # Notify all WebSocket clients in the room about the new message
    channel_layer.group_send(
        group_name,
        {
            'type': 'chat_message',
            'message': instance.text,
            'user': instance.user_sender.username if instance.user_sender else instance.coach_sender.coach_name,
            'timestamp': instance.timestamp.isoformat()
        }
    )
