def println(inp, n, before=False):
    if before:
        for i in range(n):
            print("\n")
    print(inp)
    if not before:
        for i in range(n):
            print("\n")



def inputln(inp2):
    inp = input(inp2 + "\n")
    return inp
def concat(l, g):
    # return " ".join([l, g])
    return l + " " + g

def wait(f):
    import time
    time.sleep(f)


def is_even(n):
    """
    n: Number to be evaluated
    Returns True if the number is even, else False
    """
    return n % 2 == 0




