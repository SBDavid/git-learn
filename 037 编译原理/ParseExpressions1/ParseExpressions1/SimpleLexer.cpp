//
//  SimpleLexer.cpp
//  ParseExpressions1
//
//  Created by xmly on 2019/8/20.
//  Copyright © 2019 xmly. All rights reserved.
//

#include <stdio.h>
#include <iostream>
#include <regex>
#include <vector>
using std::string;
using std::regex;
using std::cout;
using std::vector;

#include "SimpleLexer.h"

namespace Demo {
    void Token::print() {
        cout << "type: " << TokenTypeStrings[tokenType] << "\t text: " << tokenText << std::endl;
    }
    
    bool SimpleLexer::isAlpha(char c) {
        regex r("[a-zA-Z]");
        return regex_match(string(1, c),r);
    }
    
    bool SimpleLexer::isDigit(char c) {
        regex r("[0-9]");
        return regex_match(string(1, c),r);
    }
    
    bool SimpleLexer::isBlank(char c) {
        return c == ' ';
    }
    
    DfaState SimpleLexer::initToken(char c) {
        
        // 保存到tokenList
        if (tokenText.length() > 0) {
            token.tokenText = tokenText;
            tokens.push_back(token);
            
            tokenText = "";
            token.tokenType = Initail_T;
            token.tokenText = "";
        }
        
        DfaState newState = Initail;
        if (isAlpha(c)) {
            if (c == 'i') {
                newState = IdInt1;
                token.tokenType = Identifier_T;
            } else {
                newState = Id;
                token.tokenType = Identifier_T;
            }
            
            tokenText.append(string(1, c));
        } else if (isDigit(c)) {
            newState = IntLiteral;
            token.tokenType = IntLiteral_T;
            tokenText.append(string(1, c));
        } else if (c == '>') {
            newState = GT;
            token.tokenType = GT_T;
            tokenText.append(string(1, c));
        } else if (c == '=') {
            newState = Assignment;
            token.tokenType = Assignment_T;
            tokenText.append(string(1, c));
        } else if (c == '+') {
            newState = Plus;
            token.tokenType = Plus_T;
            tokenText.append(string(1, c));
        } else if (c == '-') {
            newState = Minus;
            token.tokenType = Minus_T;
            tokenText.append(string(1, c));
        } else if (c == '*') {
            newState = Star;
            token.tokenType = Star_T;
            tokenText.append(string(1, c));
        } else if (c == '/') {
            newState = Slash;
            token.tokenType = Slash_T;
            tokenText.append(string(1, c));
        }
        
        return newState;
    }
    
    void SimpleLexer::tokenize(string code) {
        this->tokens.clear();
        DfaState dfaState = Initail;
        char ch = 0;
        
        for (int i = 0; i < code.length(); i++) {
            ch = code[i];
            switch (dfaState) {
                case Initail:
                    dfaState = initToken(ch);
                    break;
                case Id:
                    if (isAlpha(ch) || isDigit(ch)) {
                        tokenText.append(string(1, ch));
                    } else {
                        dfaState = initToken(ch);
                    }
                    break;
                case IdInt1:
                    if (ch == 'n') {
                        dfaState = IdInt2;
                        tokenText.append(string(1, ch));
                    } else if (isAlpha(ch) || isDigit(ch)) {
                        tokenText.append(string(1, ch));
                    } else {
                        dfaState = initToken(ch);
                    }
                    break;
                case IdInt2:
                    if (ch == 't') {
                        dfaState = IdInt3;
                        tokenText.append(string(1, ch));
                    } else if (isAlpha(ch) || isDigit(ch)) {
                        dfaState = Id;
                        tokenText.append(string(1, ch));
                    } else {
                        dfaState = initToken(ch);
                    }
                    break;
                case IdInt3:
                    if (isBlank(ch)) {
                        token.tokenType = Int_T;
                        dfaState = initToken(ch);
                    } else {
                        dfaState = Id;
                        tokenText.append(string(1, ch));
                    }
                    break;
                case GT:
                    if (ch == '=') {
                        dfaState = GE;
                        token.tokenType = GE_T;
                        tokenText.append(string(1, ch));
                    } else {
                        dfaState = initToken(ch);
                    }
                    break;
                case GE:
                    dfaState = initToken(ch);
                    break;
                case IntLiteral:
                    if (isDigit(ch)) {
                        tokenText.append(string(1, ch));
                    } else {
                        dfaState = initToken(ch);
                    }
                    break;
                case Assignment:
                case Plus:
                case Minus:
                case Star:
                case Slash:
                    dfaState = initToken(ch);
                    break;
            }
        }
        
        if (tokenText.length() > 0) {
            initToken(ch);
        }
    }
    
    void SimpleLexer::print() {
        for (int i = 0; i < tokens.size(); i++) {
            tokens[i].print();
        }
    }
}
