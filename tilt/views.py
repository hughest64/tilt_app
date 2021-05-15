from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render

# TODO:
# - rename tilt_list template (something fermenation related probably)

# place holder redirect until the fermentation list is live
def tilt(request):
    return redirect('tilt:tilt_list', permanent=False)
    # return render(request, 'tilt/tilt_list.html')

# @login_required
def tilt_list(request):
    return render(request, 'tilt/tilt_list.html')


def calc(request):
    return render(request, 'tilt/tilt_list.html')
