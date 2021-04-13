from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import UserActivate,Profile,Group,Game,GameResults,Rate

# ユーザー
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id','email','password')
        extra_kwargs= {'password': {'write_only': True}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user

#有効化
class ActivateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivate
        fields=('token','user')

#プロフィール
class ProfileSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    
    class Meta:
        model=Profile
        fields = ('id','nickName','text','userProfile', 'created_at', 'img')
        extra_kwargs = {'userProfile': {'read_only': True}}

#グループ
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model=Group
        fields=('id','title','img','userGroup')

#グループごとのレート
class RateSerializer(serializers.ModelSerializer):
    class Meta:
        model=Rate
        fields=('id','group_id','user_id','rate')

#ゲーム
class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model=Game
        fields=('id','group_id','created_at')

#ゲーム結果
class GameResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model=GameResults
        fields=('id','game_id','user_id','rank','score')

#グループメンバーのプロフィール
class GroupMemberProfilesSerializer(serializers.ModelSerializer):
    profile=serializers.SerializerMethodField()
    class Meta:
        model=Group
        fields=('id','title','img','profile')
    
    def get_profile(self,obj):
        profiles=[]
        for user in obj.userGroup.all():
            profile_abstruct_contents = ProfileSerializer(Profile.objects.filter(userProfile=user).first()).data
            if profile_abstruct_contents !=None:
                profiles.append(profile_abstruct_contents)
        
        if len(profiles)!=0:
            return profiles
        else:
            return None

#グループごとのゲーム結果
class ResultsForEachGroupSerializer(serializers.ModelSerializer):
    results=serializers.SerializerMethodField()
    class Meta:
        model=Game
        fields=('id','group_id','created_at','results')
    
    def get_results(self,obj):
         try:
             results=[]
             results_query=GameResults.objects.filter(game_id=obj.id)
             for result in results_query:
                results_abstruct_contents =GameResultsSerializer(GameResults.objects.filter(game_id=obj.id,user_id=result.user_id).first()).data
                results.append(results_abstruct_contents)
             return results
         except:
             results_abstruct_contents=None
             return results_abstruct_contents
    





   
    