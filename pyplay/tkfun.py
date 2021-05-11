#===================================
# import tkinter
# def color_choose():
#     cocode = tkinter.colorchooser.askcolor(title="choose color")
#     print(cocode)
# root = tkinter.Tk()
# button = Button(root, text="select color", command=color_choose)
# button.pack
# root.geometry("300x300")
# root.mainloop
import tkinter as tk
    

def write_slogan():
    print("Tkinter is easy to use!")

# root = tk.Tk()
# frame = tk.Frame(root)
# frame.pack()
root = tk.Tk()

button = tk.Button(#frame, 
                   text="QUIT", 
                   fg="red",
                   command=quit)
button.pack(side=tk.LEFT)
slogan = tk.Button(#frame,
                   text="Hello",
                   command=write_slogan)
slogan.pack(side=tk.LEFT)

root.mainloop()