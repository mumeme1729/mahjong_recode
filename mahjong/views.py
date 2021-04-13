from django.shortcuts import render
from rest_framework import generics,pagination
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from . import serializers
from .models import UserActivate,Profile,Group,Game,GameResults,Rate

#ユーザー作成
class CreateUserView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = (AllowAny,)

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

#グループ
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer

    def perform_create(self, serializer):
        serializer.save()
        
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

#グループメンバーのプロフィール
class GroupMemberProfiles(generics.ListAPIView):
    serializer_class =serializers.GroupMemberProfilesSerializer
    def get_queryset(self):
        queryset=Group.objects.filter(userGroup=self.request.user)
        return queryset

#グループごとの対局結果一覧
class ResultsForEachGroup(generics.ListAPIView):
    serializer_class=serializers.ResultsForEachGroupSerializer
    def get_queryset(self):
        queryset=Game.objects.filter(group_id=self.request.query_params.get('group_id'))
        return queryset

    
# 認証
# def activate(request,token):
#     user_activate_token=UserActivate.objects.activate_user(token)
    
