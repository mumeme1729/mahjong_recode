from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
import uuid 
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from datetime import datetime,timedelta
from django.utils.timezone import make_aware
from django.core.mail import send_mail
from config import settings


def upload_avatar_path(instance, filename):
    ext = filename.split('.')[-1]
    return '/'.join(['avatars', str(instance.userProfile.id)+str(instance.nickName)+str(".")+str(ext)])

class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('email is must')
        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.create_user(email, password)
        user.is_active=True
        user.is_staff = True
        user.is_superuser = True
        user.save(using= self._db)

        return user

class User(AbstractBaseUser, PermissionsMixin):
    id=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    email = models.EmailField(max_length=50, unique=True)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    #ログインに使う物
    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email

class Profile(models.Model):
    id=models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False,db_index=True)
    nickName = models.CharField(max_length=20,blank=True)
    text=models.CharField(max_length=200,blank=True,null=True)
    userProfile = models.OneToOneField(
        settings.AUTH_USER_MODEL, related_name='userProfile',
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    img = models.ImageField(blank=True, null=True, upload_to=upload_avatar_path)
    
    def __str__(self):
        return self.nickName


#本登録
class UserActivateManager(models.Manager):
    def activate_user(self,token):
        user_activate_token= self.filter(
            token=token,
            expired_at__gte=make_aware(datetime.now())
        ).first()
        if user_activate_token !=None:
            user=user_activate_token.user
            user.is_active=True
            user.save()
        else:
            user_token= self.filter(token=token).first()
            if user_token!=None:
                user=user_token.user
                User.objects.filter(email=user).delete()
                self.filter(token=token).delete()
            

class UserActivate(models.Model):
    token =models.UUIDField(db_index=True)
    expired_at=models.DateTimeField()
    user=models.ForeignKey(
        'User',on_delete=models.CASCADE
    )
    objects=UserActivateManager()

    


@receiver(post_save,sender=User)
def publish_token(sender,instance,**kwargs):
    if instance.is_active==False:
        activate_token=UserActivate.objects.create(
            user=instance,
            token=str(uuid.uuid4()),
            expired_at=make_aware(datetime.now())+timedelta(days=1)
            #expired_at=make_aware(datetime.now())+timedelta(seconds=10)
        )
        # print(f'email:{activate_token.user}')
        # print(f'http://127.0.0.1:8000/mahjong/activate/{activate_token.token}')

        #メール送信
        subject = "ご登録ありがとうございます"
        # message = f'''
        #             以下のURLから本登録を行ってください。
        #             http://127.0.0.1:8000/mahjong/activate/{activate_token.token}
                    
        #            '''
        message = f'''
                    以下のURLから本登録を行ってください。
                    http://localhost:8080/activate/{activate_token.token}
                    
                   '''

        from_email = 'mahjon.score1027@gmail.com'  # 送信者
        to = [activate_token.user]  # 宛先
        send_mail(subject, message, from_email, to)