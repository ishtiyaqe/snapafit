from ctypes import pointer
from django.db import models
from django.contrib.auth.models import User
import json
from django.core.exceptions import ValidationError
from django.urls import reverse
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
# Create your models here.

class CheckoutSession(models.Model):
    session_id = models.CharField(max_length=255, unique=True)
    package_id = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)


class GymPackage(models.Model):
    name = models.CharField(max_length=100)
    duration_months = models.IntegerField()
    price_usd = models.DecimalField(max_digits=6, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2,  editable=False,default=0.0)
    discounted_price_usd = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    price_id = models.CharField(max_length=100, null=True)
    image = models.ImageField(upload_to='gym_packages/', null=True, blank=True)
    
    def save(self, *args, **kwargs):
        self.discount = ((self.price_usd - self.discounted_price_usd)/self.price_usd) * 100
        super(GymPackage, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.duration_months} months for ${self.price_usd} (Discount: {self.discount}%, Discounted Price: ${self.discounted_price_usd})"

    
class Gym_Pakage_elements(models.Model):
    gym_package = models.ForeignKey(GymPackage, on_delete=models.CASCADE)
    pointer = models.CharField(max_length=255, null=True)

    def __str__(self):
        return f"Gym Pakage {self.id} by {self.pointer} for {self.gym_package.name}"


class Gym_Coach(models.Model):
    coach_name = models.CharField(max_length=120,unique=True)      
    text = models.TextField()
    image = models.ImageField(upload_to='coach/',null=True)

    def __str__(self):
        return self.coach_name


class UserAssessment(models.Model):
    GENDER_CHOICES = [
        ('man', 'Man'),
        ('woman', 'Woman'),
    ]

    FIT_CHOICES = [
        ('Ectomorph', 'Ectomorph'),
        ('Athletic', 'Athletic'),
        ('Endomorph', 'Endomorph'),
    ]

 

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    coach = models.ForeignKey(Gym_Coach, to_field='id', on_delete=models.CASCADE, null=True)
    equipment = models.CharField(max_length=255,null=True)
    fit = models.CharField(max_length=255,null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    height = models.CharField(max_length=50,null=True)
    practice_location = models.CharField(max_length=50,null=True)
    schedule = models.CharField(max_length=50,null=True)
    target_area = models.CharField(max_length=255,null=True)
    weight = models.CharField(max_length=50,null=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True)
    updated_at = models.DateTimeField(auto_now=True,null=True)

    def __str__(self):
        return f"Profile of coach {self.coach} with height {self.height} and weight {self.weight}"
 

class equipment_list(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='equipment/')


class UserAssessmentHistory(models.Model):
    user_assessment = models.ForeignKey(UserAssessment, on_delete=models.CASCADE)
    height_ft = models.IntegerField()
    height_in = models.IntegerField()
    weight_kg = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user_assessment.user.username} History - {self.created_at}' 
   
class WorkoutSchedule(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,blank=True,null=True)
    user_assessment = models.OneToOneField(UserAssessment, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Workout Schedule for {self.user_assessment.user.username}"
   
class UserWorkoutTaken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,blank=True,null=True)
    day_number = models.CharField(max_length=480, blank=True,null=True)
    workout_name = models.CharField(max_length=480, blank=True,null=True)
    calorys = models.CharField(max_length=480, blank=True,null=True)
    user_completed = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Workout Schedule for {self.user.username}"
    
     
    # def save(self, *args, **kwargs):
    #     if self.calorys:
    #         # Remove "Kal" text and any leading/trailing whitespace
    #         self.calorys = self.calorys.replace(" kcal", "").strip()
    #     super().save(*args, **kwargs)

class WorkoutScheduleDay(models.Model):
    workout = models.ForeignKey(WorkoutSchedule, on_delete=models.CASCADE)
    day_number = models.CharField(max_length=480, blank=True,null=True)
    day = models.JSONField(null=True)
    sent_to_user = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def clean_day_json(self):
        """
        Validates the `day` JSON field.
        If it's not valid JSON, raise a ValidationError.
        """
        try:
            # Check if the day field contains valid JSON
            json.loads(self.day)
        except (json.JSONDecodeError, TypeError):
            raise ValidationError("The `day` field contains invalid JSON data.")

    def save(self, *args, **kwargs):
        # Validate the day field before saving
        if self.day:
            try:
                self.clean_day_json()
            except ValidationError as e:
                # If validation fails, do not save the instance
                print(f"Failed to save WorkoutScheduleDay: {e}")
                return
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Day {self.pk} of Workout Schedule for {self.workout.user_assessment.user.username}"
    
class UserProfile(models.Model):
    user_id = models.AutoField(primary_key=True)
    language = models.CharField(max_length=50)
    gender = models.CharField(max_length=10)
    height = models.DecimalField(max_digits=5, decimal_places=2)
    weight = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.user_id}: {self.height}cm, {self.weight}kg"

class WorkoutPlan(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    goal = models.CharField(max_length=100)
    preferences = models.TextField()
    days_per_week = models.IntegerField()
    equipment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Workout Plan for User {self.user.user_id}"

class Order(models.Model):
 
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    gym_package = models.ForeignKey(GymPackage, on_delete=models.CASCADE)
    cupon_code = models.CharField(max_length=50, null=True, blank=True)
    price = models.CharField(max_length=50, null=True, blank=True)
    payment_id = models.CharField(max_length=50, null=True, blank=True)
    payment_status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

class affiliate(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    affiliate_code = models.CharField(max_length=255, unique=True, blank=True)
    total_amunt = models.IntegerField(default='0')  # Assuming this should be a DecimalField, use '0' instead of 0 for CharField
    total_order = models.IntegerField(default=0)
    paypal_address = models.CharField(max_length=255)
    total_clicks = models.IntegerField(default=0, blank=True, null=True)  # Ensure default value is 0
    his_comission = models.CharField(max_length=255, blank=True, null=True)
    customer_comission = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}"

    
class Quotes(models.Model):
    quote = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)


class Exercise(models.Model):
    name = models.CharField(max_length=255)
    equipment = models.CharField(max_length=255)
    image = models.ImageField(upload_to='exercises/')
    target = models.CharField(max_length=255)
    instructions = models.TextField()

    def __str__(self):
        return self.name
    
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    coach = models.ForeignKey('Gym_Coach', on_delete=models.CASCADE)
    room = models.CharField(max_length=10, unique=True, editable=False)  # Adjust length as needed
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.room:
            self.room = self.generate_room_id()
        super().save(*args, **kwargs)

    def generate_room_id(self):
        # Generate a unique random number as a string
        import random
        import string
        random_number = ''.join(random.choices(string.digits, k=10))  # Adjust length as needed
        return random_number

    def __str__(self):
        return f"Conversation between {self.user.username} and {self.coach.coach_name}"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    user_sender = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='user_messages')
    coach_sender = models.ForeignKey('Gym_Coach', null=True, blank=True, on_delete=models.SET_NULL, related_name='coach_messages')
    text = models.TextField()
    role = models.CharField(max_length=10, choices=[('user', 'User'), ('coach', 'Coach')])
    timestamp = models.DateTimeField(auto_now_add=True)

    def clean(self):
        # Ensure only one of the sender fields is set
        if self.user_sender and self.coach_sender:
            raise ValidationError("Message can only have one sender.")
        if not self.user_sender and not self.coach_sender:
            raise ValidationError("Message must have a sender.")

    def save(self, *args, **kwargs):
        self.clean()  # Ensure validation is performed
        if self.user_sender:
            self.role = 'user'
        elif self.coach_sender:
            self.role = 'coach'
        super().save(*args, **kwargs)

    def __str__(self):
        sender_name = self.user_sender.username if self.user_sender else (self.coach_sender.coach_name if self.coach_sender else 'Unknown')
        return f"Message from {sender_name} at {self.timestamp}"
    

class NutritionItem(models.Model):
    user_assessment = models.ForeignKey(UserAssessment, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=255)
    image_url = models.CharField(max_length=255,null=True)
    calories = models.IntegerField(null=False)
    protein = models.IntegerField()  # Changed to IntegerField
    carbs = models.IntegerField()     # Changed to IntegerField
    fat = models.IntegerField()       # Changed to IntegerField

    def __str__(self):
        return self.name

class Meal(models.Model):
    name = models.CharField(max_length=50)  # e.g., "Breakfast", "Lunch", etc.
    items = models.ManyToManyField(NutritionItem)
    user_assessment = models.ForeignKey(UserAssessment, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name

class NutritionPlan(models.Model):
    user_assessment = models.ForeignKey(UserAssessment, on_delete=models.CASCADE, null=True)
    day_number = models.CharField(max_length=480, blank=True,null=True)
    breakfast = models.ForeignKey(Meal, related_name='breakfast', on_delete=models.CASCADE)
    lunch = models.ForeignKey(Meal, related_name='lunch', on_delete=models.CASCADE)
    snack = models.ForeignKey(Meal, related_name='snack', on_delete=models.CASCADE)
    dinner = models.ForeignKey(Meal, related_name='dinner', on_delete=models.CASCADE)
    total_calories = models.IntegerField()
    total_protein = models.IntegerField()  # Changed to IntegerField
    total_carbs = models.IntegerField()     # Changed to IntegerField
    total_fat = models.IntegerField()       # Changed to IntegerField
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'Nutrition Plan for {self.day_number}'
    

class Token(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,null=True)
    total_token = models.IntegerField()


class Token_package(models.Model):
    quantity = models.IntegerField(max_length=255)
    price = models.IntegerField(null=True)
    stripe_name = models.CharField(max_length=255)

