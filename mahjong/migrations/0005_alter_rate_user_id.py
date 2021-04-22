# Generated by Django 3.2 on 2021-04-20 22:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mahjong', '0004_auto_20210420_1713'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rate',
            name='user_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='game_rate_user', to=settings.AUTH_USER_MODEL),
        ),
    ]
