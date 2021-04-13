from django.db import models
from config import settings
import uuid

def upload_group_path(instance, filename):
    ext = filename.split('.')[-1]
    return '/'.join(['group', str(instance.id)+str(".")+str(ext)])
class Group(models.Model):
    id=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False,db_index=True)
    title=models.CharField(max_length=30)
    img = models.ImageField(blank=True, null=True, upload_to=upload_group_path)
    userGroup=models.ManyToManyField(settings.AUTH_USER_MODEL,related_name='group_user',blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Game(models.Model):
    id=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False,db_index=True)
    group_id=models.ForeignKey(Group,related_name='group_id',on_delete=models.CASCADE)
    # results_id=models.ForeignKey(GameResults,related_name='game_resul_id',on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.group_id)+str(self.created_at)

class GameResults(models.Model):
    id=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False,db_index=True)
    game_id=models.ForeignKey(Game,related_name='game_id',on_delete=models.CASCADE)
    user_id=models.ForeignKey(settings.AUTH_USER_MODEL,related_name='game_user',null=True,on_delete=models.SET_NULL)
    rank=models.IntegerField()
    score=models.IntegerField()

    def __str__(self):
        return str(self.game_id)+str(self.user_id)

class Rate(models.Model):
    id=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False,db_index=True)
    group_id=models.ForeignKey(Group,related_name='group_rate_id',on_delete=models.CASCADE)
    user_id=models.ForeignKey(settings.AUTH_USER_MODEL,related_name='game_rate_user',on_delete=models.CASCADE)
    rate=models.IntegerField(default=1500)

    class Meta:
        unique_together=('group_id','user_id')



