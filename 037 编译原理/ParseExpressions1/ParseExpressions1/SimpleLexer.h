//
//  SimpleLexer.h
//  ParseExpressions1
//
//  Created by xmly on 2019/8/20.
//  Copyright © 2019 xmly. All rights reserved.
//

#include <iostream>
#include <regex>
#include <vector>
using std::string;
using std::regex;
using std::cout;
using std::vector;

using namespace std;

#ifndef SimpleLexer_h
#define SimpleLexer_h

namespace Demo {
    enum DfaState {Initail = 0, Id, IdInt1, IdInt2, IdInt3, GT, GE, IntLiteral, Assignment, Plus, Minus, Star, Slash};
    enum TokenType {Initail_T = 0, Identifier_T, Int_T, GT_T, GE_T, IntLiteral_T, Assignment_T, Plus_T, Minus_T, Star_T, Slash_T};
    static const char * TokenTypeStrings[] = {"Initail", "Identifier", "Int", "GT", "GE", "IntLiteral", "Assignment", "Minus", "Star", "Slash"};
    
    struct Token {
        TokenType tokenType;
        string tokenText;
        
        void print();
    };
    
    class SimpleLexer {
        
    private:
        // 保存token
        vector<Token> tokens;
        // 临时保存token地址
        string tokenText;
        // 当前正在解析的token
        Token token;
        
    public:
        SimpleLexer() {
            tokenText = "";
            token.tokenText = "";
            token.tokenType = Initail_T;
        }
        
        bool isAlpha(char c);
        
        bool isDigit(char c);
        
        bool isBlank(char c);
        
        DfaState initToken(char c);
        
        void tokenize(string code);
        
        void print();
    };
}


#endif /* SimpleLexer_h */
