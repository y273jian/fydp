# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.

import uuid
from django.utils import timezone
from django.db import models

class CameraInfo(models.Model):
    camera_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    ch = models.ForeignKey('CentralHub', models.CASCADE, related_name='camera_infos', blank=True, null=True)
    serial_number = models.CharField(max_length=255, blank=True, null=True)
    camera_alias = models.CharField(max_length=255, blank=True, null=True)
    latitude = models.DecimalField(max_digits=65535, decimal_places=7, blank=True, null=True)
    longitude = models.DecimalField(max_digits=65535, decimal_places=7, blank=True, null=True)
    altitude = models.DecimalField(max_digits=65535, decimal_places=2, blank=True, null=True)
    setup_date = models.DateTimeField(blank=True, auto_now_add=True)
    battery_level = models.IntegerField(blank=True, null=True)
    is_long_range = models.BooleanField(blank=True, null=True)
    bandwidth = models.IntegerField(blank=True, null=True)
    bit_rate = models.IntegerField(blank=True, null=True)
    spread_factor = models.IntegerField(blank=True, null=True)
    freq_deviation = models.IntegerField(blank=True, null=True)
    transmit_power = models.IntegerField(blank=True, null=True)
    last_active_time = models.DateTimeField(blank=True, default=timezone.now)

    class Meta:
        managed = False
        db_table = 'camera_info'


class CentralHub(models.Model):
    ch_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    ch_serial = models.CharField(max_length=255, blank=True, null=True)
    ip_addr = models.GenericIPAddressField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'central_hub'


class CorrectedData(models.Model):
    extracted = models.OneToOneField('ExtractedData', models.CASCADE, related_name='corrected_data', primary_key=True)
    amount = models.IntegerField(blank=True, null=True)
    type = models.ForeignKey('WildlifeTypes', models.CASCADE, related_name='corrected_data', blank=True, null=True)
    user = models.ForeignKey('UserInfo', models.CASCADE, related_name='corrected_data', blank=True, null=True)
    corrected_time = models.DateTimeField(blank=True, auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'corrected_data'

class ExtractedData(models.Model):
    record_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    type = models.ForeignKey('WildlifeTypes', models.CASCADE, related_name='extracted_data', blank=True, null=True)
    amount = models.IntegerField(blank=True, null=True)
    image = models.ForeignKey('ImageInfo', models.CASCADE, related_name='extracted_data', blank=True, null=True)
    processed_time = models.DateTimeField(blank=True, auto_now_add=True)
    is_viewed = models.BooleanField(blank=True, null=True)
    viewed_time = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'extracted_data'

class ImageInfo(models.Model):
    image_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    ori_file_path = models.TextField(blank=True, null=True)
    ext_file_path = models.TextField(blank=True, null=True)
    size = models.DecimalField(max_digits=65535, decimal_places=2, blank=True, null=True)
    width = models.IntegerField(blank=True, null=True)
    height = models.IntegerField(blank=True, null=True)
    taken_camera = models.ForeignKey(CameraInfo, models.CASCADE, related_name='image_infos', blank=True, null=True)
    taken_time = models.DateTimeField(blank=True, default=timezone.now)

    class Meta:
        managed = False
        db_table = 'image_info'


class RoleOfUser(models.Model):
    role_of_user_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('UserInfo', models.CASCADE, blank=True, null=True)
    role = models.ForeignKey('UserRole', models.CASCADE, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'role_of_user'


class UserInfo(models.Model):
    user_id = models.UUIDField(primary_key=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    password = models.CharField(max_length=255)
    salt = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255, blank=True, null=True)
    signup_date = models.DateTimeField(blank=True, null=True),
    last_login_time = models.DateTimeField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'user_info'


class UserRole(models.Model):
    role_id = models.AutoField(primary_key=True)
    role_name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_role'


class WildlifeTypes(models.Model):
    type_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'wildlife_types'

