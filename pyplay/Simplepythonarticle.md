Hello everybody! I am **Siddharth**. This is a tutorial on how to use the print and input functions and the if, elif, and else statements, for loop, the while loop, and data structres!
# The print() function
you can put strings on the screen with the print funtion. Strings are like words or letters
## example:
```python
print("hello world!")
```
This is your output:
```
hello world!
```
you can also print integers. Integers are numbers
## example:
```python
print(1)
```
this is your output:
```
1
```
you can print very simple math calculations in python
## example:
```python
print(1 + 1 - 1 + 1 + 1)
```
your output is this:
```
3
```
you can print things based on inputs
## this is an example
```python
# we are making a variables value an input
inp = input("enter number:  ")
#we will convert this to an integer
inp = int(inp)
h = 1
g = inp + h
print("%d + %d = %d" % (h, inp, g))
# %d means integer. If %d has 2 or more variables you use (). Else, you don't use them.
```
this is what it wil do
```
enter number:  
```
it will wait for your input
then it will print the input variable + 1
## If and else:
If and else mean exactly what they mean
If something happens then
do this
else then
do this
you can use something called "elif". Before else, you can put elif there. elif means else if.
When you want to see if someones input is something specific, you might be thinking you use 1 = sign.
You actually use 2 = signs. Like this: ==.
When you use 1 =, you use that to assign a variables value
## example of if, elif, and else
```python
randominp = input("Who loves math the most:  ")
#if someone enters the name in capital, we can use this:
randominp = randominp.lower()
if randominp=="siddharth":
    print("correct")
elif randominp=="sid":
    print("enter full name nextime")
else:
    print("bad luck")
```
## one more example
```python
if 1==1:
    print("1 is equal to one")
elif 1==1.0:
    print("1 is equal to 1.0")
else:
    print("1 is not equal to 1")
```
## The for loop
The for loop is like saying: repeat this for (how many) times.
You can use it like this
```python
for i in range(1, 10):
    print(i + 1)
# i is the looping variable. The value of i will actually start at 0, not 1. Then, it will leave out the ten and end at nine. Chech how many times it will repeat it! 0, 1, 2, 3, 4, 5, 6, 7, 8, 9. Count the numbers. If you got ten, you are correct!
```
## The while loop
The while loop is like saying: Do this forever please.

This is an example
```python
while True:
    #true basically means forever in this case
    print("hello")
```
You can also do:
```python
while 1==1:
    print("byebye!")
#if you do:
#while 1==2:
#that won't work because 1 is not = 2
```
## data structres. Lists and dicttionaries!!!
## Lists
The list is a way of storing data. To make a list, you make a variables value a list. you use [] to make a list
## example
```python
randomlist = [3, 4, 5, 2, 6, 2, 2]
```
If you want to print a specific number, you need to learn what index is. Index is the position of items in a list. A lists index always starts from 0. You can do this
```python
# we will use our variable randomlist. If you want to make it print the first number which is 3, you need to do this
print(randomlist[0])
# for the third index, change 0 to 2
```
## Dictionaries
A dictionary has a key and a value. for example, in a real life dictionary, there is a word apple for sure. This is the key. The value of apple is what it means. Dictionaries are used to look up values. To make a dictionary, you use {}
## for example
```python
randomdict = {
    "45": "forty five",
    "356": "three fifty six"
}
inp = input("enter any of these numbers (45 or 356) to see the word form:  ")
if inp in randomdict:
    print(inp[randomdict])
```
if the input is 45 or 356, it will print the value of it


# Now for the review!
<details>
      <summary>
      What do you say when you use a for loop
      </summary>
      Do this (for the number of times)
</details>
<details>
      <summary>
      What do you say when you use a while loop
      </summary>
      Do this forever
</details>
<details>
      <summary>
      How do you convert a string to an integer
      </summary>
      you use the int function
</details>
<details>
      <summary>
      What does print do
      </summary>
      it puts the parameter on the screen
</details>
<details>
      <summary>
      how do you make an input
      </summary>
      you make a variables value an input
</details>
<details>
      <summary>
      Do you keep elif after else or before else
      </summary>
      Before else
</details>
<details>
      <summary>
      Lets say I have an input variable which is  called inp. How do I convert inp to an integer
      </summary>
      inp = int(inp)
</details>
<details>
      <summary>
      What does %d mean
      </summary>
      integer
</details>
<details>
      <summary>
      If you use %d and you have 2 variables, what do you use
      </summary>
      ()
</details>
<details>
      <summary>
      If you have 1 variable in the print function which has %d, do you use ()
      </summary>
      No
</details>
<details>
      <summary>
      What is index
      </summary>
      The position of an item in a list
</details>
<details>
      <summary>
      what does a dictionary have
      </summary>
      A key and a value
</details>

<details>
      <summary>
      How can you find the number of elements in a list?
      </summary>
      Using `len()` function. For ex: `len(l)`
</details>

Hope you enjoyed!!!
Thank you for looking.