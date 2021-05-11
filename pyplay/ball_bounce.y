

root=Tk()
w = Canvas(root, width=200, height=200,
           borderwidth=0,
           highlightthickness=0,
           background='white')
w.pack(padx=10,pady=10)
Dx=1
Dy=1
id1=w.create_rectangle(3,7,3+10,7+10)
root.after(50,move)
root.mainloop()