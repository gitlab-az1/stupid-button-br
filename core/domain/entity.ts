import { uuid, uuidWithoutDashes } from 'ndforge';


export abstract class Entity<T> {
  protected readonly _id: string;
  protected readonly props: T;

  get id() {
    return this._id;
  }

  constructor(props: T, id?: string) {
    this._id = id ?? uuidWithoutDashes();
    this.props = props;
  }

  public static generateId(type: 'short' | 'uuid' | 'uuid-without-dashes'): string {
    switch(type) {
      case 'uuid':
        return uuid();
      case 'uuid-without-dashes':
        return uuidWithoutDashes();
      case 'short':
      default:
        return uuid().split('-').at(-1)!;
    }
  }

  public equals(object?: Entity<T>): boolean {
    if(object === null || object === undefined) return false;

    if(this === object) return true;

    if(!(object instanceof Entity)) return false;

    return this._id === object._id;
  }

  protected static _normalizeDateToString(input: any): string | undefined {
    if(input instanceof Date) return input.toISOString();
    return input ? String(input) : void 0;
  }
}

export default Entity;
