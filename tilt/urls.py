from django.urls import path
from tilt import views

app_name = 'tilt'

urlpatterns = [
    path('', views.tilt_list, name='tilt_list'),
]
