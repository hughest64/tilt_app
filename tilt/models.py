from datetime import date, datetime

from django.contrib.auth.models import User
from django.db import models
from django.forms.models import model_to_dict


class Fermentation(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=200)
    date = models.DateField()
    original_gravity = models.DecimalField(decimal_places=3, max_digits=4, null=True)

    def __str__(self):
        return f"{self.name}, {self.date}"


class Tilt(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    color = models.CharField(max_length=20, unique=True)
    display_name = models.CharField(max_length=20, unique=True)
    uuid = models.UUIDField()
    is_active = models.BooleanField(default=False)
    # use this field to  "calibrate" the tilt
    # (subtract this from the reading before / 1000)
    # or should this be done in the client?
    calibration_offset = models.IntegerField(default=0)
    # frequency at which to post readings to the db in minutes
    # defaults to 240 min (4 hours)
    reading_post_interval = models.IntegerField(default=240)
    # whether or not to store incoming readings in the db
    store_readings = models.BooleanField(default=True)
    fermentation = models.ForeignKey(
        Fermentation, on_delete=models.SET_NULL, null=True, blank=True
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.display_name

    def serialize(self):
        model_dict = model_to_dict(self)
        del model_dict["user"]

        return model_dict

    class Meta:
        ordering = ["color"]
        # ensure each user can only have one of each tilt color
        constraints = [
            models.UniqueConstraint(fields=["user", "color"], name="unique tilts for users")
        ]


class TiltReading(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    # this will come from the tilt, maybe it should just be a CharField?
    timestamp = models.DateTimeField(default=datetime.now())
    specific_gravity = models.DecimalField(decimal_places=3, max_digits=4, null=True)
    temperature = models.IntegerField()
    fermentation = models.ForeignKey(Fermentation, on_delete=models.SET_NULL, null=True)

    class Meta:
        verbose_name = "Tilt Reading"

    def __str__(self):
        return f"{self.fermentation.name}, {self.created_at}"
