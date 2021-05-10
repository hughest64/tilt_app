# https://docs.djangoproject.com/en/3.1/howto/custom-management-commands/
import os
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from tilt.models import Tilt

TILTS = [
    {
        "color": "black",
        "display_name": "Black",
        "uuid": "a495bb30-c5b1-4b44-b512-1370f02d74de",
        "is_active": False,
        "calibration_offset": 0,
        "reading_post_interval": 240,
        "store_readings": True,
    },
    {
        "color": "blue",
        "display_name": "Blue",
        "uuid": "a495bb60-c5b1-4b44-b512-1370f02d74de",
        "is_active": True,
        "calibration_offset": 0,
        "reading_post_interval": 240,
        "store_readings": False,
    },
    {
        "color": "green",
        "display_name": "Green",
        "uuid": "a495bb20-c5b1-4b44-b512-1370f02d74de",
        "is_active": False,
        "calibration_offset": 0,
        "reading_post_interval": 240,
        "store_readings": True,
    },
    {
        "color": "orange",
        "display_name": "Orange",
        "uuid": "a495bb50-c5b1-4b44-b512-1370f02d74de",
        "is_active": False,
        "calibration_offset": 0,
        "reading_post_interval": 240,
        "store_readings": True,
    },
    {
        "color": "pink",
        "display_name": "Pink",
        "uuid": "a495bb80-c5b1-4b44-b512-1370f02d74de",
        "is_active": False,
        "calibration_offset": 0,
        "reading_post_interval": 240,
        "store_readings": True,
    },
    {
        "color": "purple",
        "display_name": "Purple",
        "uuid": "a495bb40-c5b1-4b44-b512-1370f02d74de",
        "is_active": False,
        "calibration_offset": 0,
        "reading_post_interval": 240,
        "store_readings": True,
    },
    {
        "color": "red",
        "display_name": "Red",
        "uuid": "a495bb10-c5b1-4b44-b512-1370f02d74de",
        "is_active": False,
        "calibration_offset": 0,
        "reading_post_interval": 240,
        "store_readings": True,
    },
    {
        "color": "yellow",
        "display_name": "Yellow",
        "uuid": "a495bb70-c5b1-4b44-b512-1370f02d74de",
        "is_active": False,
        "calibration_offset": 0,
        "reading_post_interval": 240,
        "store_readings": True,
    },
]


class Command(BaseCommand):
    help = "Use this command to generate all the tilt colors for a given user."

    def add_arguments(self, parser):
        parser.add_argument(
            "user_id",
            type=int,
            help="the id of the user for whom the tilt objects will be created",
        )

    def handle(self, *args, **kwargs):
        user = User.objects.get(id=kwargs["user_id"])

        try:
            [Tilt.objects.create(user=user, **tilt) for tilt in TILTS]
            self.stdout.write(
                self.style.SUCCESS(f"succesfully created tilts for {user.username}")
            )

        except Exception as e:
            self.stdout.write(self.style.ERROR(e))
