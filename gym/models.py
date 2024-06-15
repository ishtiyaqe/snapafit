from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class GymPackage(models.Model):
    name = models.CharField(max_length=100)
    duration_months = models.IntegerField()
    price_usd = models.DecimalField(max_digits=6, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2,  editable=False,default=0.0)
    discounted_price_usd = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    image = models.ImageField(upload_to='gym_packages/', null=True, blank=True)
    
    def save(self, *args, **kwargs):
        self.discount = ((self.price_usd - self.discounted_price_usd)/self.price_usd) * 100
        super(GymPackage, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.duration_months} months for ${self.price_usd} (Discount: {self.discount}%, Discounted Price: ${self.discounted_price_usd})"
    
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    gym_package = models.ForeignKey(GymPackage, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    payment_id = models.CharField(max_length=255, null=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.username} for {self.gym_package.name}"
    
class affiliate(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    affiliate_code = models.CharField(max_length=255, unique=True, blank=True)  # Ensure unique and allow blank
    total_amunt = models.CharField(max_length=20, default=0)  # Use DecimalField for monetary values
    total_order = models.IntegerField(default=0)  # Use DecimalField for monetary values
    paypal_address = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.user.username}"