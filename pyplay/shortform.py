
word_dict = {
    "con": "constitution",
    "bt": "battleship",
    "grp": "grandpa", 
    "grm": "grandma",
    "grps": "grandpas",
    "grms": "grandmas",
    "st": "statistics",
    "sc": "screensaver",
    "btn": "button",
    "trh": "treehouse",
    "exp": "experiment",
    "dr": "doctor",
    "drs": "doctors",
    "dnt": "dentist",
    "dnts": "dentists",
    "ph": "phone",
    "sp": "spaceship",
    "grms1" "germs"
}
    def complete_word(s):
    try:
        r = word_dict[s]
    except Exception:
        print("what a crazy exception")
        r = None
    return r

def complete_sentence(s):
    tokens = s.split()
    for i, t in enumerate(tokens):
        if t in word_dict:
            tokens[i] = word_dict[t]
    return " ".join(tokens)