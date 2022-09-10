export * as browser from './browser';

import * as child_process from 'child_process';
import * as events from 'events';
import * as http from 'http';
import * as http2 from 'http2';
import * as https from 'https';
import * as net from 'net';
import * as os from 'os';
import * as path from 'path';
import * as process from 'process';
import * as repl from 'repl';
import * as stream from 'stream';
import * as string_decoder from 'string_decoder';
import * as tls from 'tls';
import * as dgram from 'dgram';
import * as url from 'url';
import * as worker_threads from 'worker_threads';
import * as zlib from 'zlib';

export const nodejs = {
  child_process,
  events,
  http,
  http2,
  https,
  net,
  os,
  path,
  process,
  repl,
  stream,
  string_decoder,
  tls,
  dgram,
  url,
  worker_threads,
  zlib,
};

import * as workspace from './workspace';
export const internal = {
  workspace: workspace,
};
