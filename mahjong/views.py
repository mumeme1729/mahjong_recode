from django.shortcuts import render
from rest_framework import generics,pagination
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from . import serializers
from .serializers import PasswordResetSerializer
from rest_framework.generics import GenericAPIView
from rest_framework import status
from rest_framework.response import Response
from .models import UserActivate,Profile,Group,Game,GameResults,Rate,User
from django.core.mail import send_mail
#ユーザー作成
class CreateUserView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = (AllowAny,)

class UserView(generics.ListAPIView):
    serializer_class = serializers.UserViewSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        email=self.kwargs.get('email')
        query=User.objects.filter(email=email)
        return query

#有効化
class UserActiveView(generics.ListAPIView):
    serializer_class =serializers.ActivateSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        token=self.kwargs.get('token')
        user_activate_token=UserActivate.objects.activate_user(token)
        query=UserActivate.objects.filter(token=token)
        return query

#プロフィール
class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer
    
    #新規でプロフィールを作る
    def perform_create(self, serializer):
        serializer.save(userProfile=self.request.user)

#ログインユーザーのプロフィール
class MyProfileListView(generics.ListAPIView):
    serializer_class = serializers.ProfileSerializer
    #ログインしているユーザーのプロフィールを返す
    def get_queryset(self):
        queryset=Profile.objects.filter(userProfile=self.request.user)
        return queryset
class SelectProfileListView(generics.ListAPIView):
    serializer_class = serializers.ProfileSerializer
    #ログインしているユーザーのプロフィールを返す
    def get_queryset(self):
        queryset=Profile.objects.filter(userProfile=self.request.query_params.get('id'))
        return queryset

#グループ
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer

    def perform_create(self, serializer):
        serializer.save(userGroup=[self.request.user])
        
class RateViewSet(viewsets.ModelViewSet):
    queryset = Rate.objects.all()
    serializer_class = serializers.RateSerializer

    def perform_create(self, serializer):
        serializer.save()

#対局
class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = serializers.GameSerializer

    def perform_create(self, serializer):
        serializer.save()
#対局結果
class GameResultsViewSet(viewsets.ModelViewSet):
    queryset=GameResults.objects.all()
    serializer_class = serializers.GameResultsSerializer

    def perform_create(self,serializer):
        serializer.save()

#所属しているグループ一覧
class GroupMemberProfiles(generics.ListAPIView):
    serializer_class =serializers.GroupMemberProfilesSerializer
    def get_queryset(self):
        queryset=Group.objects.filter(userGroup=self.request.user)
        return queryset
#選択したグループを返す
class GroupMember(generics.ListAPIView):
    serializer_class =serializers.GroupMemberProfilesSerializer
    def get_queryset(self):
        queryset=Group.objects.filter(id=self.request.query_params.get('id'))
        return queryset

#グループごとの対局結果一覧
class ResultsForEachGroup(generics.ListAPIView):
    serializer_class=serializers.ResultsForEachGroupSerializer
    def get_queryset(self):
        queryset=Game.objects.filter(group_id=self.request.query_params.get('group_id')).order_by('-created_at')
        
        return queryset
class ContactView(APIView):
    def post(self,request):
        serializer_class =serializers.ContactSerailizer(data=request.data)
        if serializer_class.is_valid():
            title= request.data['title']
            sender= request.data['sender']
            message= request.data['message']
  
            #メール送信
            subject = title
            msg = f'''
                        {sender}　様からのお問い合わせ

                        #################################

                        {message}
                        
                       '''
            from_email = 'mahjon.score1027@gmail.com'  # 送信者
            to = ['mumeme.exe@gmail.com']  # 宛先
            send_mail(subject, msg, from_email, to)
    
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

#パスワード変更用
class PasswordResetView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = PasswordResetSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response('Password reset e-mail has been sent.', status=200)
        return Response(serializer.errors, status=400)
    
# 認証
# def activate(request,token):
#     user_activate_token=UserActivate.objects.activate_user(token)
    
