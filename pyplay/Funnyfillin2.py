import json
import os
b = os.path.abspath(__file__)
jf = open("/Users/hvishwanath/sid/pyplay/stories.json")
content = jf.read()
# print(content)
l = json.loads(content)
# print(l)
for i in l:
    print("have fun with this funny fill in! you get to make your rown funny stories and the computer/mobile/ipad will be your ally.")
    print(i)
user_inputs = dict()
for i in i["inputs"]:
    # Prompt for every input, and store it.
    ui = input("Enter %s: " % i)
    user_inputs[i] = ui
    
    user_story = i["story"].format(**user_inputs)
    print(user_story)

