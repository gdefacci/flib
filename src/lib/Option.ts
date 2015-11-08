export abstract class Option<A> {
  static some<T>(v: T): Option<T> {
    return new SomeImpl<T>(v)
  }
  static none<T>(): Option<T> {
    return None.instance;
  }
  static option<T>(t: T): Option<T> {
    return (t !== null && t !== undefined) ? Option.some<T>(t) : Option.none<T>();
  }
  
  fold<B>(fnone: () => B, fsome: (v: A) => B): B {
    return fnone()
  }
  map<B>(f: (t: A) => B): Option<B> {
    return Option.none<B>()
  }
  forEach<B>(f: (t: A) => void): void {
  }
  flatMap<B>(f: (t: A) => Option<B>): Option<B> {
    return Option.none<B>()
  }
  getOrElse(f: () => A): A {
    return f()
  }
  orElse(f: () => Option<A>): Option<A> {
    return f()
  }
  isEmpty(): boolean {
    return true
  }
  isDefined(): boolean {
    return false
  }
  zip<A>(b: Option<A>): Option<[A, A]> {
    return Option.none<[A, A]>()
  }
  toArray(): A[] {
    return []
  }
}

class None<A> extends Option<A> {
  static instance = new None<any>()
}

class SomeImpl<A> extends Option<A> {
  constructor(public value: A) { 
    super() 
  }
  isEmpty(): boolean { return false }
  isDefined(): boolean { return true }
  fold<B>(fnone: () => B, fsome: (some: A) => B): B {
    return fsome(this.value)
  }
  forEach<B>(f: (a: A) => void): void {
    f(this.value)
  }
  map<B>(f: (a: A) => B): Option<B> {
    return Option.some<B>(f(this.value))
  }
  flatMap<B>(f: (a: A) => Option<B>): Option<B> {
    return f(this.value)
  }
  getOrElse(f: () => A): A {
    return this.value;
  }
  orElse(f: () => Option<A>): Option<A> {
    return this;
  }
  zip<B>(b: Option<B>): Option<[A, B]> {
    return b.map<[A, B]>(t1 => [this.value, t1])
  }
  toArray(): A[] {
    return [this.value]
  }
  toString(): string {
    return `Some(${this.value})`
  }
}

export default Option