from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

REGISTER_USER_URL = 'http://127.0.0.1:8000/mahjong/register/'
TOKEN_USRL        = 'http://127.0.0.1:8000/authen/jwt/create'
CRETE_PROFILE_URL = 'http://127.0.0.1:8000/mahjong/profile/'

class UserRegisterTest(TestCase):
    def setUp(self):
        self.client=APIClient()

    def test_user_1_1_create_new_user(self):
        payload={
            'email':'dummy@test.com',
            'password':'dummy',
        }
        res=self.client.post(REGISTER_USER_URL,payload)
        self.assertEqual(res.status_code,status.HTTP_201_CREATED)
        user=get_user_model().objects.get(**res.data)
        self.assertTrue(
            user.check_password(payload['password'])
        )
        self.assertNotIn('password',res.data)
        self.assertEqual(user.is_active,False)
    
    def test_user_1_2_create_new_user_same_email(self):
        payload={
            'email':'dummy@test.com',
            'password':'dummy',
        }
        get_user_model().objects.create_user(**payload)
        res=self.client.post(REGISTER_USER_URL,payload)

        self.assertEqual(res.status_code,status.HTTP_400_BAD_REQUEST)
    
    def test_user_1_3_not_response_token_with_non_exist_user(self):
        payload={
            'email':'dummy@test.com',
            'password':'dummy',
        }
        res=self.client.post(TOKEN_USRL,payload)
        self.assertNotIn('token',res.data)
        self.assertEqual(res.status_code,status.HTTP_401_UNAUTHORIZED)

class UserAuthorizedTests(TestCase):
    def setUp(self):
        self.user=get_user_model().objects.create_user(email='dummy@test.com',password='dummy')
        self.client=APIClient()
        self.client.force_authenticate(user=self.user)
    
    def test_user_2_1_create_user_profile(self):
        payload={
            'nickName':'test',
            'text':'dummy',  
        }
        res=self.client.post(CRETE_PROFILE_URL,payload)
        self.assertEqual(res.status_code,status.HTTP_201_CREATED)
        self.assertEqual(res.data['userProfile'],self.user.id)
        self.assertEqual(res.data['nickName'],'test')
        self.assertEqual(res.data['text'],'dummy')



    

