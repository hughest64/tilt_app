from django.shortcuts import redirect

# since there isn't really a home page, redirect to the Tilt list
def index(request):
    return redirect('tilt:tilt_list', permanent=True)