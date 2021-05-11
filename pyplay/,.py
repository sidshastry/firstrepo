m = 1
import random
p = [j, o, d, e, s, w, ]
while m < 3:
    random.choice(p) = input("enter letter:  ")
    if random.choice(p) == "e":
        print("you have one point")
        m = m + 1
    elif random.choice(p) =="a":
        print("you have one point")
    elif random.choice(p) =="t":
        print("you have one point")
    else:
        print("wrong")
        m = m - 1
    if m == 3:
        print("the game is finished")
    elif m== 2:
        print("nice try")
    elif m== 1:
        print("bad luck")
    elif m== 0:
        print("you failed")
import utils
utils.println("thank you for playing")
    
