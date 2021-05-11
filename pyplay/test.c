#include <stdio.h>
#include <

int calculate_rect_area(int l, int b){
    int a = 0;
    a = l * b;
    return a;
}

int main(int argc, char*argv[]){
    int a;
    int l, b;

    printf("hello world!");
    printf("\nEnter length : ");
    scanf("%d", &l);

    printf("\nEnter breadth: ");
    scanf("%d", &b);

    a = calculate_rect_area(l, b);
    printf("Area of the rectangle is %d\n", a);
    return 0;
}

