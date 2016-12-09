import {default as Option} from "./Option"

function lazy<T>(f:() => T):() => T {
  let value:Option<T> = Option.None;
  return () => {
    return value.fold<T>(() => {
      const v:T = f()
      value = Option.some(v)
      return v;
    }, v => v)
  }
}

/*not used */
class Lazy<T> {
  value:() => T
  constructor(f:() => T) {
    this.value = lazy(f)
  }
  map<T1>(f:(v:T) => T1):Lazy<T1> {
    return new Lazy( () => f(this.value()) )
  }
  flatMap<T1>(f:(v:T) => Lazy<T1>):Lazy<T1> {
    return new Lazy( () => f(this.value()).value() )
  }
}

export default lazy;