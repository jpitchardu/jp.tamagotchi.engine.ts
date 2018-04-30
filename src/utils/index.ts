export declare function require(name: string);

export function promisify<T>(fn): (args: any) => Promise<T> {
  return args =>
    new Promise<T>((resolve, reject) =>
      fn(args, (err, res) => (err ? reject(err) : resolve(res)))
    );
}
