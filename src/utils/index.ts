export declare function require(name: string);

type ICallback<T> = (err: Error, res: T) => void;

export function promisify<T>(fn): (args: any) => Promise<T> {
  return args =>
    new Promise<T>((resolve, reject) =>
      fn(args, (err, res) => (err ? reject(err) : resolve(res)))
    );
}
