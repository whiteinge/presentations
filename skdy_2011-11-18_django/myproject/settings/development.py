import os.path

from myproject.settings import *

def FP(*path):
    parent = os.path.join(os.path.dirname(__file__), os.path.pardir)
    return os.path.abspath(os.path.join(parent, *path))

DEBUG = True
INTERNAL_IPS = '127.0.0.1'

DATABASES['default'] = {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': FP('devel.sqlite'),
}

MIDDLEWARE_CLASSES += (
    'django.middleware.doc.XViewMiddleware',
)

TEMPLATE_DIRS += (
    FP('templates'),
)
