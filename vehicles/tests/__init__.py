import json

from django.contrib.auth.models import User
from django.urls import reverse


def test_get_token(client):
    user = User.objects.create_user(username='test_user1', password='qwerty12345678', is_staff=True)
    url = reverse('token_obtain_pair')
    data = {
        "username": "test_user1",
        "password": "qwerty12345678"
    }
    json_data = json.dumps(data)
    response = client.post(url, data=json_data, content_type='application/json')
    return response.data['access']


def bad_token():
    return 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjU4OTE5NDc3LCJpYXQiOjE2NTg5MTkxNzcsImp0aSI6IjU1OWNhMzNjNWUyODQ1OTA4NGYzYTVjNzU5MmU5MTA2IiwidXNlcl9pZCI6MX0.ptA7-ETcPbLWQ3YqApWIMkpvZbWh0WYleqQxQJfqwhQ'
