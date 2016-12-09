interface JsMap<A> {
  [s:string]:A
}

module JsMap  {
  export type Entry<T> = {key:string, value:T}

  export function create<T>(kps:Entry<T>[]) {
    const res:JsMap<T> = {}
    kps.forEach( kp => res[kp.key] = kp.value);
    return res;
  }
  export function forEach<A>(mp:JsMap<A>, f:(k:string, v:A) => void) {
    Object.keys(mp).forEach( k => f(k, mp[k]) )
  }
  export function map<A,B>(mp:JsMap<A>, f:(k:string, v:A) => B):JsMap<B> {
    const res:JsMap<B> = {}
    JsMap.forEach(mp, (k,v) => res[k] = f(k,v) );
    return res;
  }
  export function merge<A>(mps:JsMap<A>[]):JsMap<A> {
    const res:JsMap<A> = {}
    mps.forEach( mp => JsMap.forEach(mp, (k,v) => res[k] = v ))
    return res;
  }
  export function flatMap<A,B>(mp:JsMap<A>, f:(k:string, v:A) => JsMap<B>):JsMap<B> {
    const res:JsMap<B> = {}
    JsMap.forEach(mp, (k,v) => JsMap.forEach(f(k,v), (k,v) => res[k] = v) );
    return res;
  }
}

export default JsMap