from django.db import models

class accountInfo(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.TextField()
    account = models.TextField()
    pw = models.TextField()
    logo = models.TextField()
    note = models.TextField()
    
    def __str__(self):
        return self.title