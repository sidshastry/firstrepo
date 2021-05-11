
word_dict = {
    "con": "constitution",
    "bt": "battleship",
    "grps": "grandpas",
    "grms": "grandmas",
    "st": "statistics",
    "sc": "screensaver",
    "btn": "button",
    "trh": "treehouse",
    "exp": "experiment"

}

def complete_word(s):
    try:
        r = word_dict[s]
    except KeyError: 
        print("I have no idea what that key is %s " % s)
        r = None

    return r



