# tilt/consumers.py
"""
Channels consumers for passing along Tilt data.
"""
from datetime import datetime
import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.generic.http import AsyncHttpConsumer
from tilt.utils import utils


class TiltSocketConsumer(AsyncJsonWebsocketConsumer):
    groups = ["tilts"]

    async def connect(self):
        # accept the connection
        await self.accept()
        # TODO: this will need to pass a user_id from the scope
        # send the current tilt data be default
        data = await utils.get_tilt_data()
        await self.send_json({"type": "tiltPayload", "message": data})

        return super().connect()

    async def receive_json(self, content, **kwargs):
        type = content.get("type")

        if type == "updateActiveState":
            await utils.set_tilt_active_state(content["message"])
            # group send here to update any other clients
            await self.channel_layer.group_send(
                "tilts",
                {"type": "update_active_tilts", "message": content.get("message")},
            )

    async def update_active_tilts(self, content):
        content.update({"type": "updateActiveState"})
        await self.send_json(content)

    async def handle_tilt_data(self, content):
        data = content.get("message")
        tilt_data = {
            "type": "updateTiltReadings",
            "message": data
        }
        await self.send_json(tilt_data)


class TiltHttpConsumer(AsyncHttpConsumer):
    async def handle(self, body):
        reading_data = json.loads(body)
        tilt_color = reading_data.get('color')
        processed_data = await utils.process_tilt_data(reading_data)
        await self.channel_layer.group_send(
            "tilts", {"type": "handle_tilt_data", "message": {tilt_color: processed_data}}
        )

        # check the cache to see if we've recently set a reading for this tilt
        cache_value = await utils.get_cache_data(tilt_color)

        if not cache_value:
            tilt = await utils.get_tilt(tilt_color)
            # db value is in minutes, but Django sets timeouts in seconds
            reading_timeout = tilt.reading_post_interval * 60

            fermentation = tilt.fermentation
            store_readings = tilt.store_readings
            if fermentation and store_readings:
                processed_data["fermentation"] = fermentation.id
                ts = reading_data["timestamp"]
                processed_data["timestamp"] = datetime.fromisoformat(ts)
                # create and save a TiltReading
                await utils.create_tilt_reading_serializer(processed_data)

            await utils.set_cache_value(tilt_color, reading_timeout, timeout=reading_timeout)

        await self.send_response(200, b"Message Received")

        return await super().handle(body)
