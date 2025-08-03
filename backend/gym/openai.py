from httpx import request
from openai import OpenAI
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import *
from .forms import *
import re
from django.db.models import Count
import requests


# Initialize OpenAI API key
client = OpenAI(api_key = 'Your api key ')

def calculate_bmi(height_ft, height_in, weight_kg):
    height_cm = (height_ft * 30.48) + (height_in * 2.54)
    bmi = weight_kg / ((height_cm / 100) ** 2)
    return round(bmi, 2)





p = """
{
    "warm_up": [
        {
            "exercise name": {
                "duration": "time",
                "calories": "total Calory Burn"
            }
        }
    ],
    "main_exercises": {
        "target_muscle_groups": "Target Area",
        "exercises": [
            {
                "exercise_name": {
                    "duration": "time",
                    "calories": "total Calory Burn"
                }
            }
        ]
    },
    "cool_down": [
        {
            "exercise name": {
                "duration": "time",
                "calories": "total Calory Burn"
            }
        }
    ]

}
"""


def generate_prompt(request, user_assessment):
    try:
        workout_schedule = WorkoutSchedule.objects.get(user=request.user)
        total_workout_days = WorkoutScheduleDay.objects.filter(workout=workout_schedule).count()
    except WorkoutSchedule.DoesNotExist:
        total_workout_days = 0

    next_days = range(total_workout_days + 1, total_workout_days + 8)
    equipment_list = user_assessment.equipment.split(",") if user_assessment.equipment else []
    target_list = user_assessment.target_area.split(",") if user_assessment.target_area else []

    equipment_exercises = Exercise.objects.filter(equipment__in=equipment_list).values_list('name', flat=True)
    target_exercises = Exercise.objects.filter(target__icontains=target_list).values_list('name', flat=True)

    unique_exercises = list(set(equipment_exercises) | set(target_exercises))

    # Use filter instead of get to handle multiple matches
    filtered_exercises = []
    for name in unique_exercises:
        matching_exercises = Exercise.objects.filter(name=name, equipment__in=equipment_list)
        if matching_exercises.exists():
            filtered_exercises.append(name)

    custom_prompt = f"""
    You are a fitness expert. Please generate a detailed 1-day workout plan for a user based on the following details:
    - Height: {user_assessment.height} 
    - Weight: {user_assessment.weight} 
    - Gender: {user_assessment.gender}
    - Fitness Goal: {user_assessment.coach.text}
    - Target Muscle: {user_assessment.target_area}
    - Equipment Available: {user_assessment.equipment}

    For the day, include:
    1. Warm-up exercises (5-10 minutes).
    2. Main exercises focusing on the target muscle groups.
    3. Cool down exercises (5-10 minutes).

    Ensure the workout is varied and balanced. Only use exercises from the following list: {filtered_exercises}. Additionally, include calorie burn information for each exercise. Please provide the response in JSON format.

    The format should follow this structure:{p}
    
    """

    print(custom_prompt)
    return custom_prompt





def is_valid_json(data):
    try:
        json.loads(data)
        return True
    except ValueError:
        return False

@csrf_exempt
def process_assessment(request):
    if request.method == 'POST':
        form = UserAssessmentForm(request.POST, request.FILES)

        if form.is_valid():
            user_assessment = form.save(commit=False)
            user_assessment.user = request.user

            # Perform BMI calculation
            user_assessment.bmi = calculate_bmi(
                form.cleaned_data['height_ft'],
                form.cleaned_data['height_in'],
                form.cleaned_data['weight_kg']
            )

            # Save the user assessment
            user_assessment.save()

            # Generate prompt for OpenAI
            prompt = generate_prompt(request,user_assessment)

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a fitness expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=4096  # Adjust this value if needed  
            )

            ai_response = response.choices[0].message.content.strip()
            print(ai_response)

            # Find and extract the workout schedule for each day
            workout_schedule_regex = r'Day\s+\d+:(.*?)((?=\nDay\s+\d+:)|\Z)'
            matches = re.findall(workout_schedule_regex, ai_response, re.DOTALL)

            if matches:
                workout_schedule_days = [day.strip() for day, _ in matches]

                # Create WorkoutSchedule instance
                workout_schedule = WorkoutSchedule.objects.create(user=request.user,user_assessment=user_assessment)

                # Save each day's workout schedule to WorkoutScheduleDay instances
                for index, day_schedule in enumerate(workout_schedule_days):
                    # Count total WorkoutScheduleDay instances for the user
                    total_workout_days = WorkoutScheduleDay.objects.filter(workout=workout_schedule).count()
                    pl = total_workout_days + 1
                    WorkoutScheduleDay.objects.create(workout=workout_schedule,day_number=pl, day=day_schedule)

                return JsonResponse({
                    'status': 'success',
                })

            else:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Workout schedule not found in AI response.'
                })

        else:
            print(form.errors) 
            return JsonResponse({'status': 'error', 'message': 'Invalid form data!'})

    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method!'})
 
    
def process_user_assessments(request, user_assessment):
    try:
        # Retrieve the latest order for the user
        # order = Order.objects.filter(user=request.user).last()

        # Calculate the expected number of workout days based on package duration
        # package_duration_days = order.gym_package.duration_months * 30

        # Retrieve or create WorkoutSchedule instance
        workout_schedule, created = WorkoutSchedule.objects.get_or_create(user=request.user, defaults={'user_assessment': user_assessment})

        # Count total WorkoutScheduleDay instances for the user
        total_workout_days = WorkoutScheduleDay.objects.filter(workout=workout_schedule).count()

        # Determine how many times to repeat the process
        # repeat_count = (package_duration_days - total_workout_days) // 7  # Assuming 7 days per week
        # if repeat_count < 1:
        #     return {'status': 'error', 'message': 'Package duration is already fulfilled.'}

        # Generate prompt for OpenAI
        prompt = generate_prompt(request,user_assessment)

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a fitness expert."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=4096  # Adjust this value if needed  
        )

        ai_response = response.choices[0].message.content.strip()
        print(ai_response)
        total_workout_days = WorkoutScheduleDay.objects.filter(workout=workout_schedule).count()
        pl = total_workout_days + 1
        WorkoutScheduleDay.objects.get_or_create(workout=workout_schedule, day_number= pl,day=ai_response)
        
       
    except Order.DoesNotExist:
        return {'status': 'error', 'message': 'Order not found for the user.'}
    except json.JSONDecodeError:
        return {'status': 'error', 'message': 'Failed to parse AI response as JSON.'}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}

from datetime import date
class NutritionData:
    def __init__(self, data):
        self.breakfast = data.get('breakfast', [])
        self.lunch = data.get('lunch', [])
        self.snack = data.get('snack', [])
        self.dinner = data.get('dinner', [])
        self.total_calories = data.get('totalCalories', 0)
        self.total_protein = data.get('macros', {}).get('protein', '0g')
        self.total_carbs = data.get('macros', {}).get('carbs', '0g')
        self.total_fat = data.get('macros', {}).get('fat', '0g')

    def get_or_create_nutrition_item(self, item_data):
        item, created = NutritionItem.objects.get_or_create(
            name=item_data['name'],
            defaults={
                'calories': item_data['calories'],
                'protein': item_data['protein'],
                'carbs': item_data['carbs'],
                'fat': item_data['fat'],
            }
        )
        return item

    def create_meal(self, meal_name, items_data):
        meal = Meal.objects.create(name=meal_name)
        for item_data in items_data:
            item = self.get_or_create_nutrition_item(item_data)
            meal.items.add(item)
        return meal

    def save_to_db(self):
        breakfast = self.create_meal('Breakfast', self.breakfast)
        lunch = self.create_meal('Lunch', self.lunch)
        snack = self.create_meal('Snack', self.snack)
        dinner = self.create_meal('Dinner', self.dinner)

        # Create the NutritionPlan
        NutritionPlan.objects.create(
            date=date.today(),
            breakfast=breakfast,
            lunch=lunch,
            snack=snack,
            dinner=dinner,
            total_calories=self.total_calories,
            total_protein=self.total_protein,
            total_carbs=self.total_carbs,
            total_fat=self.total_fat
        )
        print("Nutrition data saved successfully!")


from django.utils import timezone

def create_nutrition_prompt():
    return (
        "Create a balanced nutrition plan for a day, including breakfast, lunch, snack, "
        "and dinner with their respective macros. Please format the output as a JSON object with the following structure:\n"
        "{\n"
        "  \"breakfast\": {\"food\": [...], \"macros\": {\"calories\":0,\"carbohydrates\": 0, \"proteins\": 0, \"fats\": 0}},\n"
        "  \"lunch\": {\"food\": [...], \"macros\": {\"calories\":0,\"carbohydrates\": 0, \"proteins\": 0, \"fats\": 0}},\n"
        "  \"snack\": {\"food\": [...], \"macros\": {\"calories\":0,\"carbohydrates\": 0, \"proteins\": 0, \"fats\": 0}},\n"
        "  \"dinner\": {\"food\": [...], \"macros\": {\"calories\":0,\"carbohydrates\": 0, \"proteins\": 0, \"fats\": 0}},\n"
        "  \"total\": {\"calories\": 0, \"macros\": {\"calories\":0,\"carbohydrates\": 0, \"proteins\": 0, \"fats\": 0}}\n"
        "}"
    )

def parse_nutrition_response(response_content):
    try:
        nutrition_data = json.loads(response_content)
    except json.JSONDecodeError:
        raise ValueError("Invalid JSON response from API")

    parsed_data = {
        "breakfast": {},
        "lunch": {},
        "snack": {},
        "dinner": {},
        "total_macros": {}
    }

    for meal in ['breakfast', 'lunch', 'snack', 'dinner']:
        if meal in nutrition_data:
            parsed_data[meal] = {
                "food": nutrition_data[meal]["food"],
                "macros": nutrition_data[meal]["macros"]
            }
        else:
            parsed_data[meal] = {"food": [], "macros": {"calories":0,"carbohydrates": 0, "proteins": 0, "fats": 0}}

    total_calories = 0
    total_proteins = 0
    total_carbs = 0
    total_fats = 0

    for meal in ['breakfast', 'lunch', 'snack', 'dinner']:
        food_items = parsed_data[meal]["food"]
        for food in food_items:
            nutrition_item = NutritionItem.objects.filter(name=food).first()
            if nutrition_item:
                total_calories += nutrition_item.calories
                total_proteins += nutrition_item.protein
                total_carbs += nutrition_item.carbs
                total_fats += nutrition_item.fat

    parsed_data["total_macros"] = {
        "calories": total_calories,
        "carbohydrates": total_carbs,
        "proteins": total_proteins,
        "fats": total_fats
    }

    return parsed_data
def get_first_image_url(query, token):
    url = "https://api.pexels.com/v1/search"
    headers = {
        "Authorization": token
    }
    params = {
        "query": query,
        "per_page": 1
    }
    
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        response_data = response.json()
        if response_data.get('photos'):
            return response_data['photos'][0]['src']['original']  # Get the URL of the original image
        else:
            print("No images found.")
            return None
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None

# Replace with your Pexels API key
API_KEY = "OLXro7YzhepNccLjDtITajINbOsDOVKGcHGYUTf7871FaND2Tm0RHnur"

# Example usage

def save_nutrition_data_to_db(nutrition_data,obs):
    today = timezone.now().date()
    
    meals = {}
    for meal_name in ['breakfast', 'lunch', 'snack', 'dinner']:
        meal = Meal.objects.create(name=meal_name.capitalize(),user_assessment=obs)
        for food in nutrition_data[meal_name]['food']:
            # Get the corresponding macros for the food item
            macros = nutrition_data[meal_name]['macros']
            calories = macros.get('calories', 0)  # Use 0 if calories not provided
            protein = macros.get('proteins', 0)
            carbs = macros.get('carbohydrates', 0)
            fat = macros.get('fats', 0)
            image_url = get_first_image_url(food, API_KEY)
            # Create or get the NutritionItem with all relevant macros
            nutrition_item, created = NutritionItem.objects.get_or_create(
                name=food,
                user_assessment=obs,
                image_url=image_url,
                defaults={
                    'calories': calories,
                    'protein': protein,
                    'carbs': carbs,
                    'fat': fat,
                }
            )
            meal.items.add(nutrition_item)
        meals[meal_name] = meal

    # Total macros calculation
    total_calories = sum(item.calories for meal in meals.values() for item in meal.items.all())
    total_protein = sum(item.protein for meal in meals.values() for item in meal.items.all())
    total_carbs = sum(item.carbs for meal in meals.values() for item in meal.items.all())
    total_fat = sum(item.fat for meal in meals.values() for item in meal.items.all())

    total_day = NutritionPlan.objects.filter(user_assessment=obs).count() + 1
    # Create NutritionPlan
    nutrition_plan = NutritionPlan(
        day_number=total_day,
        user_assessment=obs,
        breakfast=meals['breakfast'],
        lunch=meals['lunch'],
        snack=meals['snack'],
        dinner=meals['dinner'],
        total_calories=total_calories,
        total_protein=total_protein,
        total_carbs=total_carbs,
        total_fat=total_fat,
    )
    nutrition_plan.save()

# Assuming you have a function that generates a new quote
def generate_daily_quote():
    prompt = "Generate a motivational quote to encourage exercise and health.In only one sentance"
    
    response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a fitness expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=4096  # Adjust this value if needed  
            )

    ai_response = response.choices[0].message.content.strip()

    # Save the new quote to the database
    new_quote = Quotes.objects.create(quote=ai_response)
    return new_quote


def fetch_nutrition_data_from_api(request, obs, tm):
    print('prem installize')
    prompt = create_nutrition_prompt()  
    print(prompt)

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a fitness expert."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=4096
        )
    except Exception as e:
        print(f"API call failed: {e}")
        return

    # Parse the API response
    response_content = response.choices[0].message.content.strip()
    print("Raw response content:", response_content)

    # Instead of expecting JSON, parse the response content
    nutrition_data = parse_nutrition_response(response_content)
    
    # Save nutrition data to the database
    save_nutrition_data_to_db(nutrition_data, obs)
    print("Nutrition data saved successfully!")

