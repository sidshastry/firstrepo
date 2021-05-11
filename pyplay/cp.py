import time

choices = [
    "I am alexa. You can ask me any of the following questions.",
    "\t1. What is the current time? ",
    "\t2. How do you do? ",
    "\t3. What is your name? ",
    "\t4. How old are you? ",
    "\t5. How to print something in python? ",
    "\t6. What are you going to have for lunch? ",
    "\t7. Set a timer. "

]

while 1==1:

    # print("\n".join(choices))
    print("\n".join(choices))
    m = input("Enter your choice: ")
    if m == "1":
        print("the time is %s" % time.localtime())
    elif m=="2":
        print("I am good")
    elif m=="3":
        print("I am alexa")
    elif m=="4":
        print("I am 39")
    elif m=="5":
        print("print")
    elif m=="6":
        print("I am gonna eat pizza")
    elif m=="7":
        for i in range(m, 0):
            m = m - 1
        if m ==0:
            print("the timer is finished.")
    