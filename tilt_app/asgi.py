"""
ASGI config for tilt_app project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

import os

from django.urls import path, re_path
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tilt_app.settings')
django_asgi_app = get_asgi_application()

from channels.auth import AuthMiddlewareStack
from channels.http import AsgiHandler
from channels.routing import ProtocolTypeRouter, URLRouter
from tilt.consumers import TiltHttpConsumer
import tilt.routing

application = ProtocolTypeRouter({
    "http": URLRouter(
            [
                # receive tilt readings here
                path("api/tilt/reading/", TiltHttpConsumer.as_asgi()),
               
                # handle native Django http calls
                re_path("^", django_asgi_app),
            ]
        ),
    'websocket': AuthMiddlewareStack(
        URLRouter(
            tilt.routing.WEBSOCKET_URLPATTERNS
        )
    )
})
