1. 编译命令

antlr4 .Hello.g4

javac -encoding utf-8 -d ./java/classes -classpath ./java/lib/antlr-4.7.2-complete.jar ./java/src/Hello.java

export CLASSPATH=".:/usr/local/lib/antlr-4.7.2-complete.jar:$CLASSPATH"

grun Hello tokens -tokens hello.play
