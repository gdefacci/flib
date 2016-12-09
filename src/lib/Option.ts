class Option<T> {
  public static None = new Option<any>(null);
  public static some<T>(t:T):Option<T> {
    return new Option<T>(t)
  }
  public static option<T>(v:T|null|undefined):Option<T> {
    return new Option<T>(v);
  }

  constructor(public value: T | null | undefined) {
  }
  isEmpty(): boolean {
    return this.value === null || this.value === undefined
  }
  isDefined() {
    return !this.isEmpty()
  }
  fold<B>(fnone: () => B, fsome: (some: T) => B): B {
    return (this.value === null || this.value === undefined) ? fnone() : fsome(this.value)
  }
  forEach(f: (a: T) => void): void {
    if (!(this.value === null || this.value === undefined)) f(this.value)
  }
  map<B>(f: (a: T) => B): Option<B> {
    return this.fold<Option<B>>(() => Option.None, v => new Option<B>(f(v)))
  }
  flatMap<B>(f: (a: T) => Option<B>): Option<B> {
    return this.fold<Option<B>>(() => Option.None, v => f(v))
  }
  getOrElse<B>(f: () => B): T | B {
    return this.fold<T | B>(() => f(), v => v)

  }
  orElse<B>(f: () => Option<B>): Option<T | B> {
    return this.fold<Option<T | B>>(f, v => new Option<T>(v))
  }

  zip<B>(b: Option<B>): Option<[T, B]> {
    if (this.value !== null && this.value !== undefined) {
      const v:T = this.value
      return b.map( (b1: B) => {
        const r:[T, B] = [v, b1]
        return r;
      })
    } else {
      return Option.None;
    }
  }
  toArray(): T[] {
    return this.fold<T[]>(() => [], v => [v])
  }
  toString(): string {
    return this.fold(() => "None", v => `Some(${v})`)
  }
}

export default Option
