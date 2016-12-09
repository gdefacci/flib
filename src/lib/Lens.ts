import Option from "./Option"

export interface Accessors<S, A> {
  get: (s: S) => A
  set: (a: A) => (s: S) => S
}


function accessors<S, K extends keyof S>(k: K, objectCopy: <T>(v: T) => T): Accessors<S, S[K]> {
  return {
    get: (s: S) => s[k],
    set: (v: S[K]) => (s: S) => {
      const cpy = objectCopy(s)
      cpy[k] = v
      return cpy
    }
  }
}

function objectAssign<A, B>(target: A, source: B): A & B {
  const output = <any>target;
  if (source !== undefined && source !== null) {
    for (const nextKey in source) {
      if (source.hasOwnProperty(nextKey)) {
        output[nextKey] = source[nextKey];
      }
    }
  }
  return output;
}

export function copy<A>(a: A): A {
  return objectAssign({}, a)
}

export function overwrite<A>(a:A):A {
  return a;
}

function update<S, A, FA, FS>(accessors: Accessors<S, A>, fmap: <A, B>(a: FA, f: (a: A) => B) => FS, f: (a: A) => FA): (s: S) => FS {
  return s => {
    return fmap(f(accessors.get(s)), (v: A) => accessors.set(v)(s))
  }
}

export function optionFMap<A, B>(a: Option<A>, f: (a: A) => B) {
  return a.map(f)
}

export function idFMap<A, B>(a: A, f: (a: A) => B) {
  return f(a)
}

export function constFMap<K>(k: K) {
  return <A, B>(b: K, f: (a: A) => B) => k
}

function accessorsCompose<S, A, B>(acc1: Accessors<S, A>, acc2: Accessors<A, B>): Accessors<S, B> {
  const get: (s: S) => B = (s: S) => acc2.get(acc1.get(s))
  const set: (b: B) => (s: S) => S = (b: B) => (s: S) => acc1.set(acc2.set(b)(acc1.get(s)))(s)
  return { get, set }
}

export class Lens<S, A> {
  static create<S, K extends keyof S>(k: K, objectCopy:<T>(v:T) => T = copy): Lens<S, S[K]> {
    return new Lens<S,S[K]>(accessors<S,K>(k, objectCopy))
  }
  static lensed<T>(sample:T,  objectCopy: <T>(v: T) => T = copy):Lensed<T> {
    return lensed(sample, objectCopy)
  }

  constructor(private accessors: Accessors<S, A>) {
  }
  get: (s: S) => A = this.accessors.get
  set: (a: A) => (s: S) => S = this.accessors.set
  update: (f: (a: A) => A) => (s: S) => S = f => s => update<S, A, A, S>(this, idFMap, f)(s)
  optUpdate: (f: (a: A) => Option<A>) => (s: S) => Option<S> = f => s => update<S, A, Option<A>, Option<S>>(this, optionFMap, f)(s)
  compose<B>(acc2: Accessors<A, B>) {
    return new Lens<S, B>(accessorsCompose(this, acc2))
  }
}

export type Lensed<T> = {
    readonly [P in keyof T]: Lens<T, T[P]>;
};

function lensed<T>(sample:T,  objectCopy: <T>(v: T) => T = copy):Lensed<T> {
  const res = <any>{}
  for (const nextKey in sample) {
    if (sample.hasOwnProperty(nextKey)) {
      res[nextKey] = Lens.create<T, any>(nextKey, objectCopy);
    }
  }
  return res;
}