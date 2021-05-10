from django.core.cache import cache
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from tilt.models import Tilt
from tilt.serializers import TiltSerializer, TiltReadingSerializer


@sync_to_async
def process_tilt_data(data):
    return {
        "specificGravity": f"{(data.get('minor') / 1000):.3f}",
        "temperature": data.get("major"),
        "timestamp": data.get("timestamp")
    }


@database_sync_to_async
def set_tilt_active_state(data):
    tilt = Tilt.objects.get(color=data["color"])
    tilt.is_active = data["isActive"]
    tilt.save()


# TODO: this will need to take a user_id param, and filter to a specific user
@database_sync_to_async
def get_tilt_data():
    tilts = Tilt.objects.all()
    serializer = TiltSerializer(tilts, many=True)
    return serializer.data


@sync_to_async
def get_cache_data(color):
    return cache.get(color)


@sync_to_async
def set_cache_value(color, value, timeout):
    cache.set(color, value, timeout)
    return


@database_sync_to_async
def get_tilt(color):
    return Tilt.objects.select_related('fermentation').get(color=color)


@database_sync_to_async
def create_tilt_reading_serializer(data):
    sg = data.pop('specificGravity')
    data['specific_gravity'] = float(sg)
    serializer = TiltReadingSerializer(data=data)

    if serializer.is_valid():
        print('adding reading')
        serializer.save()

    # TODO: probably want to log a message here
    # else:
    #     print("some scary error message")

    return serializer
