export type TryValue<T> = [Error, null] | [null, T]

function isLeft<T>(v:TryValue<T>):v is [Error, null] {
  return v[0] != null;
}

class Try<T> {
  public static fromValue<T>(v:() => T) {
    try {
      return Try.success(v())
    } catch (e) {
      return Try.failure(e)
    }
  }
  public static success<T>(t:T) {
    return new Try<T>([null, t]);
  }
  public static failure(err:Error) {
    return new Try<any>([err, null]);
  }
  constructor(private value:TryValue<T>) {
  }
  fold<T1>( onError:(err:Error) => T1, onSuccess:(a:T) => T1):T1 {
    if (isLeft(this.value)) return onError(this.value[0]);
    else return onSuccess(this.value[1]);
  }
  isEmpty() { return this.fold(() => true, () => false)}
  isDefined() { return this.fold(() => true, () => false)}
  map<B>(f:(a:T) => B):Try<B> {
    return this.fold((err) => Try.failure(err), (v) => Try.fromValue(() => f(v)) )
  }
  flatMap<B>(f:(a:T) => Try<B>):Try<B> {
    try {
      return this.fold((err) => Try.failure(err), (v) => f(v))
    } catch(e) {
      return Try.failure(e)
    }
  }
  toPromise():Promise<T> {
    return this.fold( err => Promise.reject(err), v => Promise.resolve(v))
  }
}

export default Try
