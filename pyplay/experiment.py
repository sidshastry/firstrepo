import tkinter as tk
def writing():
    print("Tkinter is REALLY easy!!!")
root = tk.Tk()
myCanvas = tk.Canvas(root, bg="white", width=700, height=700)
c = 10, 33, 55, 77
aff = myCanvas.create_text(100,10,fill="darkblue",font="Times 20 italic bold",text="click hidden buttons")
button = tk.Button(root, text="click me", command=writing) 
ss = tk.Button(root, text="exit", command=quit)
dd = tk.Button(root, text="dont click me" , command=quit)
def pleee():
    print("babablacksheephaveyouanywool...")
ee = tk.Button(root, text="click me if you want", command=pleee) 
button.pack(side=tk.LEFT)
ss.pack(side=tk.RIGHT)
dd.pack(side=tk.TOP)
ee.pack(side=tk.BOTTOM)
myCanvas.pack()
#this is using tkinter.
root.mainloop()