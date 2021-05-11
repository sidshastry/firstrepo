import turtle
import time

turtles = [
    {
        "shape": "turtle",
        "start_color": "black",
        "start_xy": (33, 65),
        "sleep_seconds": 2,
        "end_xy": (55, 55),
        "end_color": "purple"
    
    },

    {
        "shape": "turtle",
        "start_color": "black",
        "start_xy": (66, 33),
        "sleep_seconds": 2,
        "end_xy": (44, 77),
        "end_color": "yellow"
    
    },

]



tt = turtle.Turtle()
tt.penup()
tt.shape("turtle")
tt.goto(33, 65)
time.sleep(2)
tt.goto(55, 55)
tt.fillcolor("purple")
t = turtle.Turtle()
t.shape("turtle")
time.sleep(3)
t.penup()
t.goto(66, 33)
t.goto(44, 77)
t.fillcolor("yellow")
ttt = turtle.Turtle()
time.sleep(1)
ttt.shape("turtle")
ttt.penup()
ttt.goto(13, 51)
ttt.goto(15, 11)
ttt.goto(17, 31)
time.sleep(2.34)
ttt.fillcolor("green")
t1 = turtle.Turtle()
t1.penup()
t1.shape("turtle")
t1.goto(33, 66)
t1.goto(17, 53)
time.sleep(1)
t1.goto(9, 5)
t1.fillcolor("red")
ta = turtle.Turtle()
ta.shape("turtle")
ta.penup()
ta.goto(3, 21)
ta.goto(2, 61)
ta.goto(5, 95)
time.sleep(3)
tb = turtle.Turtle()
tb.penup()
tb.shape("circle")
tb.goto(11, 55)
tb.goto(77, 22)
tb.fillcolor("orange")
tc = turtle.Turtle()
time.sleep(1)
tc.penup()
tc.shape("circle")
tc.goto(87, 29)
tc.goto(55, 22)
tc.goto(11, 55)
tc.fillcolor("yellow")
td = turtle.Turtle()
td.penup()
td.shape("circle")
time.sleep(3)
td.goto(72, 72)
td.goto(55, 11)
td.fillcolor("green")
te = turtle.Turtle()
time.sleep(2)
te.penup()
te.shape("circle")
te.goto(61, 30)
te.goto(100, 77)
te.goto(66, 33)
tf = turtle.Turtle()
tf.penup()
tf.shape("turtle")
time.sleep(3)
tf.goto(109, 109)
tf.goto(115, 73)
tf.goto(101, 23)
tf.fillcolor("aliceblue")