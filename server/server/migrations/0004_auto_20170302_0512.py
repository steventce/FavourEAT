# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-02 05:12
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0003_auto_20170222_0919'),
    ]

    operations = [
        migrations.AlterField(
            model_name='eventdetail',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='eventdetail',
            name='invite_code',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='eventdetail',
            name='voting_deadline',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='eventdetail',
            name='yelp_id',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='preference',
            name='max_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
        migrations.AlterField(
            model_name='preference',
            name='min_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='json',
            field=models.TextField(blank=True, null=True),
        ),
    ]