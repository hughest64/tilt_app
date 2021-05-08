from django.shortcuts import render

def tilt_list(request):
    return render(request, 'tilt/tilt_list.html')
