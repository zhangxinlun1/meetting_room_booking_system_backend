import * as crypto from 'crypto';
export function md5(str: string): string {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}
