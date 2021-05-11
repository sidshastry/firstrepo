from tkinter import *
from tkinter import colorchooser


def choose_color():
    color_code = colorchooser.askcolor(title="select color")
    print(color_code)

root = Tk()
button = Button(root, text = "Select color",command = choose_color)
button.pack()

root.geometry("300x300")
root.mainloop