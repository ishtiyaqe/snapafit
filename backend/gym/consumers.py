import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Conversation, Message, UserAssessment
from django.contrib.auth.models import User
import openai
from openai import OpenAI


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        
        if not self.user.is_authenticated:
            await self.close()
            return

        self.conversation = await self.get_or_create_conversation()
        
        if self.conversation is None:
            # Handle case where conversation could not be created
            await self.close()
            return

        self.room_group_name = f'chat_{self.conversation.room}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Send chat history
        await self.send_chat_history()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message_text = text_data_json['message']

            # Save the user's message
            user_message = await self.save_message(message_text, 'user')

            # Broadcast the user's message immediately
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'role': 'user',  # Ensure user message role is 'user'
                    'message': message_text,
                    'user': self.user.username,
                    'timestamp': user_message.timestamp.isoformat()
                }
            )

            # Generate a response from OpenAI asynchronously
            openai_response = await self.generate_openai_response(message_text)
            
            # Save the coach's response
            coach_message = await self.save_message(openai_response, 'coach')

            # Broadcast the coach's actual response
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'role': 'coach',  # Ensure coach message role is 'coach'
                    'message': openai_response,
                    'user': self.conversation.coach.coach_name,
                    'timestamp': coach_message.timestamp.isoformat()
                }
            )

        except Exception as e:
            print(f"Error in WebSocket receive: {e}")

    @database_sync_to_async
    def generate_openai_response(self, message_text):
        client = OpenAI(api_key='your api key')  # Make sure to replace with your actual OpenAI key
        pb = f"Your name is {self.conversation.coach.coach_name}. You are a fitness expert and coach."
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": pb},
                {"role": "user", "content": message_text}
            ],
            temperature=0.7,
            max_tokens=4096
        )
        return response.choices[0].message.content.strip()

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'user': event['user'],
            'timestamp': event['timestamp']
        }))

    @database_sync_to_async
    def get_or_create_conversation(self):
        try:
            user_assessment = UserAssessment.objects.get(user=self.user)
            coach = user_assessment.coach
            conversation, created = Conversation.objects.get_or_create(
                user=self.user,
                coach=coach
            )
            return conversation
        except UserAssessment.DoesNotExist:
            # Handle the case where UserAssessment does not exist
            return None

    @database_sync_to_async
    def save_message(self, text, role):
        if role == 'user':
            return Message.objects.create(
                conversation=self.conversation,
                user_sender=self.user,
                text=text,
                role='user'
            )
        elif role == 'coach':
            return Message.objects.create(
                conversation=self.conversation,
                coach_sender=self.conversation.coach,
                text=text,
                role='coach'
            )

    @database_sync_to_async
    def get_chat_history(self):
        messages = Message.objects.filter(conversation=self.conversation).order_by('timestamp')
        return [
            {
                'message': message.text,
                'role': message.role,
                'user': message.user_sender.username if message.user_sender else message.coach_sender.coach_name,
                'timestamp': message.timestamp.isoformat()
            }
            for message in messages
        ]

    async def send_chat_history(self):
        history = await self.get_chat_history()
        for message in history:
            await self.send(text_data=json.dumps(message))
