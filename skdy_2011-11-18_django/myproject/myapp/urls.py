from django.conf.urls.defaults import \
        include, patterns, url
from myproject.myapp.views import MyTodos

urlpatterns = patterns('',
    url(r'^$', MyTodos.as_view(), name='todos'),
)
