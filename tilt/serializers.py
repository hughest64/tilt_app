from django.db.models import fields
from rest_framework import serializers
from tilt.models import Fermentation, Tilt, TiltReading

class FermentationSerializer(serializers.ModelSerializer):
    originalGravity = serializers.DecimalField(
        max_digits=4, decimal_places=3, source='original_gravity'
    )
    date = serializers.DateField(format='%m/%d/%Y')

    class Meta:
        model = Fermentation
        fields=['name', 'date', 'originalGravity']


class TiltSerializer(serializers.ModelSerializer):
    # this allows us to control which fields get returned
    fermentation = FermentationSerializer()
    displayName = serializers.CharField(source='display_name')
    isActive = serializers.CharField(source='is_active')

    class Meta:
        # the depth method returns all fields of the related model(s)
        # depth = 1
        model = Tilt
        fields = ['color', 'displayName', 'isActive', 'fermentation']


class TiltReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiltReading
        exclude = ['created_at']