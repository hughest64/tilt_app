from django.contrib import admin

from tilt import models

admin.site.register(models.Tilt)
admin.site.register(models.TiltReading)
admin.site.register(models.Fermentation)