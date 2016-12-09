export type Disj<L, R> = [L, null] | [null, R]

function isLeft<L, R>(v: Disj<L, R>): v is [L, null] {
  return v[0] != null;
}

class Either<L, R> {
  public static right<R>(t: R) {
    return new Either<any, R>([null, t]);
  }
  public static left<L>(l: L) {
    return new Either<L, any>([l, null]);
  }
  constructor(private value: Disj<L, R>) {
  }
  fold<T1>(onError: (err: L) => T1, onSuccess: (a: R) => T1): T1 {
    if (isLeft(this.value)) return onError(this.value[0]);
    else return onSuccess(this.value[1]);
  }
  isLeft() { return this.fold(() => true, () => false) }
  isRight() { return this.fold(() => true, () => false) }
  map<B>(f: (a: R) => B): Either<L, B> {
    return this.fold<Either<L, B>>((l: L) => Either.left(l), (r: R) => Either.right(f(r)))
  }
  flatMap<B>(f: (a: R) => Either<L, B>): Either<L, B> {
    return this.fold((err) => Either.left(err), (v) => f(v))
  }
  leftMap<B>(f: (a: L) => B): Either<B, R> {
    return this.fold<Either<B, R>>((l: L) => Either.left(f(l)), (r: R) => Either.right(r))
  }
}

export default Either
