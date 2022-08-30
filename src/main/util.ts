/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import fs from 'fs';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function isDebug(): boolean {
  return (
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'
  );
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function loadTextFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

export function saveTextFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content);
}

export function getFileNameFromPath(filePath: string) {
  return path.parse(filePath).base;
}

export function getRelativePath(from: string, to: string) {
  return path.relative(from, to);
}
