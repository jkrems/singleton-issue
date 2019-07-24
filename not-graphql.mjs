class X {
  getResult() {
    return 42;
  }
}

export default X;

export function run(x) {
  if (!(x instanceof X)) {
    throw new TypeError('Please pass an X!');
  }
  return x.getResult();
}
