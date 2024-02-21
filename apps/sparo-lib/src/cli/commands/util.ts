import path from 'path';
import childProcess from 'child_process';

/**
 * The string of cmd here can be "clone <repository> [directory]", this function extracts
 *  the command name from the string.
 */
export function getCommandName(cmd: string): string {
  const commandName: string = cmd.split(' ')[0];
  return commandName;
}

// parse CLI program name (as invoked)
export function prog(): string {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const $_: string | undefined = process.env['_'];
  const scriptFile: string = process.argv[1];
  if (!scriptFile) {
    // unlikely
    return $_ || process.argv[0];
  }
  if ($_ && !path.isAbsolute($_)) {
    // accurate in some shells (like bash, but not in zsh)
    return $_;
  }
  let prefix: string = '';
  if ($_) {
    const nodeExecName: string = path.basename(process.execPath);
    if ($_.endsWith(path.sep + nodeExecName)) {
      // the script was invoked by explicitly calling node.
      // e.g. "node sparo/dist/cli.js"
      prefix = `${nodeExecName} `;
    }
  }
  if (scriptFile.startsWith(process.cwd())) {
    let rel: string = path.relative(process.cwd(), scriptFile);
    if (
      !rel.startsWith(`node_modules${path.sep}`) &&
      rel.indexOf(`${path.sep}node_modules${path.sep}`) === -1
    ) {
      if (path.sep === '/') {
        // on posix systems, this is needed to avoid PATH resolution
        rel = `./${rel}`;
      }
      return rel;
    }
  }
  return prefix + scriptFile;
}

export function executeSelfCmd(cmd: string, args: string[] = []): void {
  childProcess.execSync(`${prog()} ${cmd} ${args.join(' ')}`);
}
