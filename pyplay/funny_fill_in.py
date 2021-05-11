# Let us read the file stories.json, go through every story
# Print that story and ask for user inputs.
# Once input is given, let us print the story by substituting all the inputs.

import json
import os
path = os.path.dirname(os.path.abspath(__file__))
jf = open(os.path.join(path, "stories.json"), "r")
content = jf.read()

# Content is in JSON format. Lets decode.
stories = json.loads(content)

print(stories)
for item in stories:
    print("You are now about to get a funny story, based on whatever you input")
    print("Be creative, and for every prompt type whatever comes to your mind!")
    print("The computer will sense what you wrote and hopefully print out a funny story it made up!")

    user_inputs = dict()
    for i in item["inputs"]:
        # Prompt for every input, and store it.
        ui = input("Enter %s: " % i)
        user_inputs[i] = ui
    
    user_story = item["story"].format(**user_inputs)
    print(user_story)


