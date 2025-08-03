# In serializers.py (create this file if it doesn't exist) within your app directory

from rest_framework import serializers
from .models import *
from snipet.models import *


class QuotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quotes
        fields = '__all__' 



class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = '__all__' 



class Token_packageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token_package
        fields = '__all__' 

class GymPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GymPackage
        fields = '__all__' 

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__' 

class UserProfileSerializersss(serializers.ModelSerializer):
    class Meta:
        model = UserAssessment
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class equipment_listSerializer(serializers.ModelSerializer):
    class Meta:
        model = equipment_list
        fields = '__all__'

class NutationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nutations
        fields = '__all__'


class affiliateSerializer(serializers.ModelSerializer):
    class Meta:
        model = affiliate
        fields = '__all__'

class GymCoachSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gym_Coach
        fields = '__all__'