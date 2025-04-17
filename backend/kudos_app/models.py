from django.db import models

# Create your models here.
class Organization(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    

class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.username
    

class Kudos(models.Model):
    sender = models.ForeignKey(User, related_name='sent_kudos', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_kudos', on_delete=models.CASCADE)
    message = models.TextField()
    headline = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username}"