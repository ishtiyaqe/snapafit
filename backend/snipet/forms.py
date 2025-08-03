from django import forms
from .models import *
from ckeditor.widgets import CKEditorWidget
class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title','image', 'content']
        widgets = {
            'content': CKEditorWidget(),
        }