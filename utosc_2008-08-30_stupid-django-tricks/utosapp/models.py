from django.db import models

class SomeModel(models.Model):
    user = models.ForeignKey('auth.User')
    somefield = models.CharField(max_length='50')

class OtherModel(models.Model):
    somemodel = models.ForeignKey('utosapp.SomeModel')
