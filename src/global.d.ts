export {};

declare global {
  interface Window {
    fsChangeDir: () => Promise<Boolean>;
    fsWrite: (path: path, content64: string) => Promise<Boolean>;
    fsList: (arg: path) => Promise<string[]>;
    fsRead: (arg: path) => Promise<string>;
  }
}
