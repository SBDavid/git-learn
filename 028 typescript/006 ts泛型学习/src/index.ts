function identity<T>(arg: T): T {
  return arg;
}

identity<number>(0);

interface GI<T> {
  identity: (arg: T) => T;
  test: string;
}

let myIndentity: GI<number> = {
  test: '',
  identity
};

class GenericNumber<T> {
  public zeroValue: T;
  public add (x: T, y: T): T {
    console.log(x);
    return x
  }
}

let c = new GenericNumber<string>();
c.add('11', '22');

function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}



let x = { a: 1, b: 2, c: 3, d: 4 };

interface X {
  aa: number;
}

type TT = keyof X;

function getProperty2<T>(obj: T, key: TT) {
  return obj[key];
}

getProperty2(x, "aa"); // okay

function create<T>(c: new() => T): T {
  return new c();
}

create<GenericNumber<number>>(GenericNumber);

type Proxify<T> = {
  [P in keyof T]: { get(): T[P]; set(v: T[P]): void }
};

interface Person {
  name: string;
  age: number;
}

let personProps: keyof Person = 'age'; // 'name' | 'age'
console.info(personProps);

type NullablePerson = { [P in keyof Person]: Person[P] | null }

// pick
interface PickBase {
  a: number;
  b: string;
  c: boolean;
}
type PickTest = Pick<PickBase, 'a'|'b'>

type ThreeStringProps = Record<string, string>