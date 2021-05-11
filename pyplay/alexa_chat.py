import datetime

def handle_time():
    print("The current time is %s" % datetime.datetime.now())

skills = {
    "1": ("What is the current time? ", handle_time)
}

def prompt():
    print("Hello, My name is alexa. Ask me any of the below: ")
    for k, v in skills.items():
        print("\n%s: %s" % (k, v[0]))

    m = input("Enter your choice: ")
    # item = skills[m]
    # func = item[1]
    # func()

while True:
    prompt()