# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-05 18:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0006_auto_20170305_1659'),
    ]

    operations = [
        migrations.AlterField(
            model_name='eventdetail',
            name='voting_deadline',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
