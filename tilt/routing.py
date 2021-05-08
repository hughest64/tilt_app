# netsuite/routing.py
"""
ASGI routes for web sockets in the brew app
"""
from django.urls import path
from tilt import consumers


WEBSOCKET_URLPATTERNS = [
    path(r"ws/socket/tilt/", consumers.TiltSocketConsumer.as_asgi()),
]