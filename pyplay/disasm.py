import dis

def f(l, b):
    counter = 0
    x = 0
    while counter < 3:
        x = x + l
        x = x + b
        counter += 1
    return x

# def f2(m):
#     import turtle
#     turle.forward(55)
def bitcode():
    print(dis.dis(f))
print(dis.dis(bitcode))