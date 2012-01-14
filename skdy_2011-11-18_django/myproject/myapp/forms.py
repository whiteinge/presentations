from django import forms
from myproject.myapp.models import TodoItem

class TodoItemForm(forms.ModelForm):
    class Meta:
        model = TodoItem
