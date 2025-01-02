import { Database } from 'typesdk/database/postgres';

import { isProduction } from '@/utils';


declare global {
  // eslint-disable-next-line no-var
  var db: Database | undefined;
}


export async function connect(): Promise<Database> {
  if(!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not defined');
  }

  const uri = new URL(process.env.POSTGRES_URL);

  if(!process.env.POSTGRES_DB) {
    process.env.POSTGRES_DB = uri.pathname.replace(/\//g, '');
  }

  if(isProduction()) return new Database(uri.toString());

  if(
    !globalThis.db ||
    !(await globalThis.db.isOnline())
  ) {
    globalThis.db = new Database(uri.toString());
  }

  return globalThis.db;
}
