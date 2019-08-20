#include "SimpleLexer.h"

using namespace Demo;

int main(int argc, const char * argv[]) {
    
    SimpleLexer *p = new SimpleLexer();
    
    // p->tokenize("age>=123");
    // p->tokenize("int age = 123");
    // p->tokenize("2+3*5");
    p->tokenize("int age = 2+3*5");
    p->print();
    
    
    
    
    return 0;
}
