from django import forms
from .models import *
from ckeditor.widgets import CKEditorWidget


        
class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = [
            'gym_package', 'payment_id', 'payment_status'
        ]