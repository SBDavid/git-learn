// 发现注释中的错误
#include <iostream>

int main() {
	std::cout << "/*" << std::endl;
	std::cout << "*/" << std::endl;
	// std::cout << /* "*/" */ << std::endl;
	std::cout << /* "*/" /* "/*" */ << std::endl;
	return 0;
}