# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-28 01:31
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0016_auto_20170328_0100'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventuserattach',
            name='rating',
            field=models.IntegerField(default=0),
        ),
    ]
