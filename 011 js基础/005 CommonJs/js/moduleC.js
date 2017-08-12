var counter = {
  c: 0
};
function incCounter() {
  counter.c++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};