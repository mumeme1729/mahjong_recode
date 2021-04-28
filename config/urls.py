
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('mahjong/', include('mahjong.urls')),
    path('authen/', include('djoser.urls.jwt')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/password/reset/confirm',include('rest_auth.urls'))
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)