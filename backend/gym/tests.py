from django.test import TestCase
from .models import NutritionItem, Meal, NutritionPlan
from datetime import date

class NutritionPlanTestCase(TestCase):
    def setUp(self):
        # Provided JSON data
        self.nutrition_data = {
            "breakfast": [
                {
                    "name": "Oatmeal with Berries",
                    "calories": 350,
                    "protein": "10g",
                    "carbs": "50g",
                    "fat": "10g"
                },
                {
                    "name": "Scrambled Eggs with Spinach",
                    "calories": 200,
                    "protein": "15g",
                    "carbs": "2g",
                    "fat": "15g"
                }
            ],
            "lunch": [
                {
                    "name": "Grilled Chicken Salad",
                    "calories": 450,
                    "protein": "40g",
                    "carbs": "15g",
                    "fat": "20g"
                },
                {
                    "name": "Quinoa and Black Beans",
                    "calories": 300,
                    "protein": "10g",
                    "carbs": "50g",
                    "fat": "5g"
                }
            ],
            "snack": [
                {
                    "name": "Greek Yogurt with Honey",
                    "calories": 150,
                    "protein": "10g",
                    "carbs": "15g",
                    "fat": "5g"
                }
            ],
            "dinner": [
                {
                    "name": "Baked Salmon with Asparagus",
                    "calories": 500,
                    "protein": "35g",
                    "carbs": "10g",
                    "fat": "30g"
                },
                {
                    "name": "Brown Rice",
                    "calories": 200,
                    "protein": "5g",
                    "carbs": "45g",
                    "fat": "2g"
                }
            ],
            "totalCalories": 2150,
            "macros": {
                "protein": "110g",
                "carbs": "187g",
                "fat": "87g"
            }
        }

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

    def test_create_nutrition_plan(self):
        # Create meals from the data
        breakfast = self.create_meal('Breakfast', self.nutrition_data['breakfast'])
        lunch = self.create_meal('Lunch', self.nutrition_data['lunch'])
        snack = self.create_meal('Snack', self.nutrition_data['snack'])
        dinner = self.create_meal('Dinner', self.nutrition_data['dinner'])

        # Create the NutritionPlan
        nutrition_plan = NutritionPlan.objects.create(
            date=date.today(),
            breakfast=breakfast,
            lunch=lunch,
            snack=snack,
            dinner=dinner,
            total_calories=self.nutrition_data['totalCalories'],
            total_protein=self.nutrition_data['macros']['protein'],
            total_carbs=self.nutrition_data['macros']['carbs'],
            total_fat=self.nutrition_data['macros']['fat']
        )

        # Assertions to check if the data was saved correctly
        self.assertEqual(NutritionPlan.objects.count(), 1)
        self.assertEqual(Meal.objects.count(), 4)
        self.assertEqual(NutritionItem.objects.count(), 9)
        self.assertEqual(nutrition_plan.total_calories, self.nutrition_data['totalCalories'])
        self.assertEqual(nutrition_plan.breakfast.name, 'Breakfast')
        self.assertEqual(nutrition_plan.lunch.name, 'Lunch')
        self.assertEqual(nutrition_plan.snack.name, 'Snack')
        self.assertEqual(nutrition_plan.dinner.name, 'Dinner')
        self.assertEqual(breakfast.items.count(), len(self.nutrition_data['breakfast']))
        self.assertEqual(lunch.items.count(), len(self.nutrition_data['lunch']))
        self.assertEqual(snack.items.count(), len(self.nutrition_data['snack']))
        self.assertEqual(dinner.items.count(), len(self.nutrition_data['dinner']))

        print("Test for creating NutritionPlan passed successfully!")
