function MyExampleWebpackPlugin() {

};

// Defines `apply` method in it's prototype.
MyExampleWebpackPlugin.prototype.apply = function(compiler) {
  // Specifies webpack's event hook to attach itself.
  compiler.plugin("compilation", function(compilation) {

    // Now setup callbacks for accessing compilation steps:
    compilation.plugin("buildModule", function(module) {
      console.log("Assets are being optimized.", module);
    });
  });
};

module.exports = MyExampleWebpackPlugin;