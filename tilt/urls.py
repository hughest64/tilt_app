from django.urls import path
from tilt import views

app_name = "tilt"

urlpatterns = [
    path("", views.tilt, name="tilt"),
    path("list/", views.tilt_list, name="tilt_list"),
]
