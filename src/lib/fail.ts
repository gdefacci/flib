function fail<T>(msg:string):T {
  throw new Error(msg);
}

export default fail