# tasks.py
from celery import shared_task
from datetime import datetime
from .models import WorkoutScheduleDay
from .utils import send_whatsapp_message

@shared_task
def send_daily_workout():
    today = datetime.now().date()
    workout_days = WorkoutScheduleDay.objects.filter(created_at__date=today, sent_to_user=False)

    for workout_day in workout_days:
        user = workout_day.workout.user
        message = f"Hello {user.username}, here is your workout plan for today:\n\n{workout_day.day}"
        
        response = send_whatsapp_message(user.profile.phone_number, "text", {"preview_url": False, "body": message})
        
        if response.status_code == 200:
            workout_day.sent_to_user = True
            workout_day.save()
