# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-22 09:19
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0002_auto_20170221_2116'),
    ]

    operations = [
        migrations.AlterField(
            model_name='eventdetail',
            name='yelp_id',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='yelp_id',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='swipe',
            name='yelp_id',
            field=models.CharField(max_length=200),
        ),
    ]
