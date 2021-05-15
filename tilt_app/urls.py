"""tilt_app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path
from django.urls.conf import include

from . import views
import tilt.views

urlpatterns = [
    # home
    path('', views.index, name='index'),

    # app stuff
    path('calc/', tilt.views.calc, name='calc'),
    # TODO: path will be fermentations/
    path('tilt/', include('tilt.urls', namespace='tilt')),

    # authentication
    path('accounts/', include('django.contrib.auth.urls')),
    # the above enables all of the following, but maybe we should only use a few
    # https://docs.djangoproject.com/en/3.2/topics/auth/default/ for more info
    # accounts/login/ [name='login'],
    # accounts/logout/ [name='logout'],
    # accounts/password_change/ [name='password_change'],
    # accounts/password_change/done/ [name='password_change_done'],
    # accounts/password_reset/ [name='password_reset'],
    # accounts/password_reset/done/ [name='password_reset_done'],
    # accounts/reset/<uidb64>/<token>/ [name='password_reset_confirm'],
    # accounts/reset/done/ [name='password_reset_complete'],
    # like this:
    # path('change-password/', auth_views.PasswordChangeView.as_view()),

    # admin
    path('admin/', admin.site.urls),
]
