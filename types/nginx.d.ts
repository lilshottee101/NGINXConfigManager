
declare enum nginxSignals {
  stop,
  quit,
  reload,
  reopen
}

interface nginxInfoDictionary {
  nginxVersion: string,
  builtWith: string,
  tlsSniSupport: boolean,
  arguments: Array<String>
}
