"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.contrib import admin
from config import settings
from django.conf.urls.static import static

from rest_framework.documentation import include_docs_urls
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
   openapi.Info(
      title="Perceptyx API",
      default_version='v1',
      description="RESTful API for www.perceptyx.com",
      terms_of_service="https://www.perceptyx.com",
      contact=openapi.Contact(email="administrator@perceptyx.com"),
      license=openapi.License(name="Perceptyx, Inc"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    url(r'^apis(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    url(r'^apis/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    url(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    url(r'^admin/', admin.site.urls),
    url(r'api/v1/', include('authentication.urls')),
    url(r'api/v1/', include('client.urls')),
    url(r'api/v1/', include('other_provider.urls')),
    url(r'api/v1/', include('how_found_pyx.urls')),
    url(r'api/v1/', include('naics_code.urls')),
    url(r'api/v1/', include('project_status.urls')),
    url(r'api/v1/', include('project_type.urls')),
    url(r'api/v1/', include('role.urls')),
    url(r'api/v1/', include('consultant.urls')),
    url(r'api/v1/', include('project_manager.urls')),
    url(r'api/v1/', include('relationship_manager.urls')),
    url(r'api/v1/', include('project.urls')),
    url(r'api/v1/', include('account_manager.urls')),
    url(r'api/v1/', include('server.urls')),
    url(r'api/v1/', include('toolkit_tier.urls')),
] + static(settings.common.STATIC_URL, document_root=settings.common.STATIC_ROOT)
