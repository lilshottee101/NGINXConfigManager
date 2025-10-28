import { spawnSync, spawn, ChildProcess } from 'node:child_process';
import type { nginxSignals, nginxInfoDictionary } from "../types/nginx.d.ts";

function sendSignal(signal: nginxSignals): ChildProcess {
  const command = spawnSync('nginx', ['-s', signal]);
  return command;
}

function testConfig(suppressNonError: Boolean, configPath?: string): ChildProcess {
  const commandArg = suppressNonError ? '-tq' : '-t';
  const configArg = configPath ? `-c ${configPath}` : '';
  const command = spawn('nginx', [commandArg, configArg]);
  return command;
}

function getInfo(): nginxInfoDictionary {
  const command: ChildProcess = spawnSync('nginx', ['-V']);
  const rawArray: Array<string> = command.output[2].toString('utf8').split("\n")
  const infoDict: nginxInfoDictionary = {
    nginxVersion: rawArray[0],
    builtWith: rawArray[1],
    tlsSniSupport: rawArray[2].endsWith("enabled"),
    arguments: rawArray[3].split(" ")
  }
  console.log(infoDict)
  return infoDict;
}
export {
  sendSignal,
  testConfig,
  getInfo
};

getInfo();
