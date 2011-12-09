from django.contrib import admin
from myproject.myapp.models import TodoItem

class TodoItemAdmin(admin.ModelAdmin):
    list_display = ('pk', 'user', 'todo')
    list_filter = ('timestamp',)
    list_editable = ('todo',)

admin.site.register(TodoItem, TodoItemAdmin)
