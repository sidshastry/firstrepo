from tkinter import *
from tkinter import colorchooser
def choose_color():
    color=colorchooser.askcolor(title="color chooser")
    print("this was what you chose %t" % color)
root = Tk()
button = Button(root, text="click me for colorchooser!", command=choose_color)
button.pack()
root.geometry("300x300")
root.mainloop()