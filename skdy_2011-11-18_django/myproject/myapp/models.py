from django.db import models

class TodoItem(models.Model):
    """This object store todos for an individual user

    """
    user = models.ForeignKey('auth.User')
    todo = models.CharField(max_length=150)
    timestamp = models.DateTimeField(
            auto_now_add=True)

