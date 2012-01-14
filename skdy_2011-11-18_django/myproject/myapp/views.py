from django.views.generic.base import \
        TemplateView
from myproject.myapp.models import TodoItem

class MyTodos(TemplateView):
    """This is a test view

    Objects available to the template:

    todos
        A list of :model:`myapp.TodoItem` objects.

    """
    template_name = 'my_todos.html'

    def get(self, request, **kwargs):
        context = {
            'todos': TodoItem.objects.all()}
        return self.render_to_response(context)
