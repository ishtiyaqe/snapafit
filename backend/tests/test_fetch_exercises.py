# test_fetch_exercises.py

import unittest
import requests
from django.test import TestCase
from gym.models import Exercise
import os
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile

class ExerciseTestCase(TestCase):
    
    def save_exercise_with_image(self, name, equipment, image_url, target, instructions):
        response = requests.get(image_url)
        
        # Create a temporary file
        img_temp = NamedTemporaryFile(delete=False)  # delete=False by default on Windows

        try:
            # Write response content to the temporary file
            img_temp.write(response.content)
            img_temp.flush()

            # Create Exercise object and save it
            exercise = Exercise(
                name=name,
                equipment=equipment,
                target=target,
                instructions=instructions,
            )
            
            # Save the image file
            exercise.image.save(f"{name}.jpg", File(img_temp), save=True)
            exercise.save()
        finally:
            # Close and delete the temporary file
            img_temp.close()
            os.unlink(img_temp.name)  # Delete the temporary file

    def fetch_and_process_exercises(self):
        url = 'https://exercisedb.p.rapidapi.com/exercises'
        querystring = {"offset": "0", "limit": "10"}  # Reduce limit for faster testing

        headers = {
            "x-rapidapi-key": "638225bfa7mshceef384c42bbd61p156cebjsn3067c2af82ae",
            "x-rapidapi-host": "exercisedb.p.rapidapi.com"
        }

        response = requests.get(url, headers=headers, params=querystring)

        # Parse the JSON response
        data = response.json()

        for exercise_data in data:
            name = exercise_data.get('name', 'N/A')
            equipment = exercise_data.get('equipment', 'N/A')
            gifUrl = exercise_data.get('gifUrl', 'N/A')
            target = exercise_data.get('target', 'N/A')
            instructions = exercise_data.get('instructions', [])

            # Format the instructions
            formatted_instructions = "\n".join([f"{i + 1}. {instruction}" for i, instruction in enumerate(instructions)])

            # Save the exercise with image
            self.save_exercise_with_image(
                name=name,
                equipment=equipment,
                image_url=gifUrl,
                target=target,
                instructions=formatted_instructions
            )

        # Count total exercises
        total_exercise_count = len(data)
        self.assertGreater(total_exercise_count, 0)  # Assert at least one exercise was processed

    def test_fetch_and_process_exercises(self):
        self.fetch_and_process_exercises()

if __name__ == '__main__':
    unittest.main()
