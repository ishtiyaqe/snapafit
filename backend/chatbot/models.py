from django.db import models
from django.contrib.auth.models import User

class FacebookUser(models.Model):
    fb_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    language = models.CharField(max_length=10, blank=True, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    
class AutoMessage(models.Model):
    parent_message = models.CharField(max_length=800, unique=True, null=True)
    answer = models.TextField()
    class Meta:
        verbose_name = "Automated Messages"
        verbose_name_plural = "Automated Messages"
    
    def __str__(self):
        return self.parent_message


class AutoMessageQuestion(models.Model):
    q_id = models.ForeignKey(AutoMessage, null=True, blank=True, on_delete=models.CASCADE)
    question = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Automated Message Questions"
        verbose_name_plural = "Automated Message Questions"
        
    def __str__(self):
        return f"{self.q_id}: {self.question}"

class AutoLinkMessage(models.Model):
    parent_message = models.CharField(max_length=800, unique=True, null=True)
    title = models.CharField(max_length=800, help_text='title of the card')
    subtitle = models.CharField(max_length=800, help_text='Subtitle of the card',null=True)
    imegs = models.ImageField(upload_to="static/images", help_text='image for the card')
    link = models.CharField(max_length=800, null=True, default='https://snapafit.com/', help_text='Enter Target Page Link Here To Redirect')
    button_link = models.CharField(max_length=800, null=True, default='https://snapafit.com/', help_text='Enter Target Page Link Here To Redirect. this can be diffrent from the above link.')
    button_name = models.CharField(max_length=800, null=True, default='Visit Now', help_text='Button show this text on it')
    class Meta:
        verbose_name = "Automated Message Link & Image Answers"
        verbose_name_plural = "Automated Message Link & Image Answers"
        
    def __str__(self):
        return self.parent_message


class AutoLinkMessageQuestion(models.Model):
    q_id = models.ForeignKey(AutoLinkMessage, null=True, blank=True, on_delete=models.CASCADE)
    question = models.CharField(max_length=800, unique=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    class Meta:
        verbose_name = "Automated Message Link Questions"
        verbose_name_plural = "Automated Message Link Questions"
        

    def __str__(self):
        return f"{self.q_id}: {self.question}"

class ButtonLinkMessage(models.Model):
    parent_message = models.CharField(max_length=800, unique=True, null=True)
    text = models.CharField(max_length=800, help_text='title of the card')
    button_link = models.CharField(max_length=800, null=True, default='https://snapafit.com/', help_text='Enter Target Page Link Here To Redirect. this can be diffrent from the above link.')
    button_name = models.CharField(max_length=800, null=True, default='Visit Now', help_text='Button show this text on it')
    class Meta:
        verbose_name = "Automated Button Message Link Questions"
        verbose_name_plural = "Automated Button Message Link Questions"
        
    
    def __str__(self):
        return self.parent_message


class AdditionalBtnLink(models.Model):
    q_id = models.ForeignKey(ButtonLinkMessage, null=True, blank=True, on_delete=models.CASCADE)
    button_link = models.CharField(max_length=800, null=True, default='https://snapafit.com/', help_text='Enter Target Page Link Here To Redirect. this can be diffrent from the above link.')
    button_name = models.CharField(max_length=800, null=True, default='Visit Now', help_text='Button show this text on it')
    class Meta:
        verbose_name = "Automated Button Message Link Answers"
        verbose_name_plural = "Automated Button Message Link Answers"
        

    def __str__(self):
        return f"{self.q_id}: {self.button_name}"

class ButtonLinkMessageQuestion(models.Model):
    q_id = models.ForeignKey(ButtonLinkMessage, null=True, blank=True, on_delete=models.CASCADE)
    question = models.CharField(max_length=800, unique=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Automated Button Message Link Questions"
        verbose_name_plural = "Automated Button Message Link Questions"
    def __str__(self):
        return f"{self.q_id}: {self.question}"


class Extra_quick_replays(models.Model):
    name = models.CharField(max_length=800, unique=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    class Meta:
        verbose_name = "Automated Extra quicks replays"
        verbose_name_plural = "Automated Extra quicks replays"
