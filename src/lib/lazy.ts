import {default as Option} from "./Option"

function lazy<T>(f:() => T) {
  let value:Option<T> = Option.none<T>();
  return () => {
    return value.fold<T>(
      () => {
        const v:T = f()
        value = Option.some(v)
        return v;
      },
      (v) => v
    )
  }
}

export default lazy;