
from textblob import TextBlob
 
a=input("enter word:  ")
 
b = TextBlob(a)
 
# prints the corrected spelling
print("correct text is " + str(b.correct()))