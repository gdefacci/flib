import {default as Option} from "./Option"
import {default as JsMap} from "./JsMap"
import isNull from "./isNull"

module Arrays {

  export function flatMap<A,B>(arr:A[], f:(a:A) => B[]):B[] {
    let res:B[] = [];
    arr.forEach( a => res = res.concat(f(a)))
    return res;
  }

  export function find<A>(arr: A[], pred: (a: A) => boolean): Option<A> {
    return findIndex(arr, pred).map( idx => arr[idx] )
  }

  export function findIndex<A>(arr: A[], pred: (a: A) => boolean): Option<number> {
    for (let i = 0; i < arr.length; i++) {
      const v = arr[i]
      if (pred(v)) return Option.some<number>(i)
    }
    return Option.none<number>();
  }

  export function split<A>(arr:A[], pred:(a:A) => boolean):[A[], A[]] {
    const res1:A[] = []
    const res2:A[] = []
    arr.forEach( i => {
      if (pred(i)) res1.push(i)
      else res2.push(i)
    })
    return [res1, res2];
  }

  export function exists<A>(arr:A[], pred:(a:A) => boolean):boolean {
    for (let i = 0; i < arr.length; i++) {
      const v = arr[i]
      if (pred(v)) return true
    }
    return false;
  }

  export function foldLeft<A,B>(arr:A[], z:B, f:(acc:B,i:A) => B):B {
    let res = z
    arr.forEach( i => res = f(res,i))
    return res
  }

  export function foldRight<A,B>(arr:A[], z:B, f:(i:A, acc:B) => B):B {
    let res = z
    const len = arr.length
    for (let idx = len-1; idx >= 0; idx--) {
      res = f(arr[idx], res)
    }
    return res
  }

  export function groupBy<A>(arr:A[], group:(a:A) => string):JsMap<A[]> {
    const res:JsMap<A[]> = {}
    const addToMap = (k:string, v:A) => {
      let arr = res[k]
      if (isNull(arr)) {
        res[k] = [v]
      } else {
        arr.push(v)
      }
    }
    arr.forEach( e => addToMap(group(e), e))
    return res;
  }

}

export default Arrays