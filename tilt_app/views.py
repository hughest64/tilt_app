from django.shortcuts import render, redirect

# since there isn't really a home page, redirect to the Tilt list
def index(request):
    # return redirect('tilt:tilt_list', permanent=False)
    return redirect('calc', permanent=False)
    # return render(request, 'index.html')
