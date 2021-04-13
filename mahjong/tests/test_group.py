from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

GROUP_URL = 'http://127.0.0.1:8000/mahjong/group/'

class GroupTest(TestCase):
    def setUp(self):
        self.user=get_user_model().objects.create_user(email='dummy@test.com',password='dummy')
        self.user2=get_user_model().objects.create_user(email='dummy2@test.com',password='dummy')
        self.user3=get_user_model().objects.create_user(email='dummy3@test.com',password='dummy')
        self.client=APIClient()
        self.client.force_authenticate(user=self.user)
    
    def test_group_1_1_create_group(self):
        payload={
            'title':'testGroup',
            'userGroup':self.user.id
        }
        res=self.client.post(GROUP_URL,payload)
        self.assertEqual(res.status_code,status.HTTP_201_CREATED)
        self.assertEqual(res.data['userGroup'][0],self.user.id)
        self.assertEqual(res.data['title'],'testGroup')

    def test_group_1_2_create_group_many_user(self):
        payload={
            'title':'testGroup2',
            'userGroup':[self.user.id,self.user2.id,self.user3.id]
        }
        res=self.client.post(GROUP_URL,payload)
        self.assertEqual(res.status_code,status.HTTP_201_CREATED)
        self.assertIn(self.user.id,res.data['userGroup'])
        self.assertIn(self.user2.id,res.data['userGroup'])
        self.assertIn(self.user3.id,res.data['userGroup'])
        self.assertEqual(res.data['title'],'testGroup2')


    
