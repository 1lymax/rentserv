from django.contrib import admin
from vehicles.models import Type, Vehicle, FeatureList, VehicleFeature, MessurementUnit, VehicleImage


class TypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


admin.site.register(Type, TypeAdmin)


class VehicleAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


admin.site.register(Vehicle, VehicleAdmin)


class FeatureListAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}


admin.site.register(FeatureList, FeatureListAdmin)

admin.site.register(VehicleFeature)

admin.site.register(MessurementUnit)

admin.site.register(VehicleImage)
