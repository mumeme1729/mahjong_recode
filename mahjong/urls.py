from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

app_name='mahjong'

router = DefaultRouter()
router.register('profile',views.ProfileViewSet) #プロフィール作成
router.register('group',views.GroupViewSet) #グループ作成
router.register('game',views.GameViewSet) #対局作成
router.register('gameresults',views.GameResultsViewSet) #対局結果作成
router.register('rate',views.RateViewSet)


urlpatterns = [
    path('',include(router.urls)),
    path('register/', views.CreateUserView.as_view(), name='register'), #ユーザー登録
    path('activate/<uuid:token>',views.UserActiveView.as_view(),name='activate'), #ユーザーの有効化
    path('loginuserprofile/', views.MyProfileListView.as_view(), name='loginuserprofile'), #ログインユーザーのプロフィール
    path('groupmember/',views.GroupMemberProfiles.as_view(),name='groupmember'), #グループメンバーのプロフィール
    path('results/',views.ResultsForEachGroup.as_view(),name='results') # グループごとの対局結果
]
