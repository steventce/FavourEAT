# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-30 02:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0018_auto_20170328_1739'),
    ]

    operations = [
        migrations.AddField(
            model_name='swipe',
            name='avg_rating',
            field=models.IntegerField(default=0),
        ),
    ]
