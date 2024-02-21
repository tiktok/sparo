---
title: Security
---

Because the Sparo tool acts as a wrapper for Git, our goal is to provide comparable security expectations as the `git` command.

> ⚠️ **This is a goal not a guarantee.** ⚠️
> 
> The software is still in its early stages of development, and not all security
> requirements have been identified or implemented yet.  Efforts to improve Sparo
> security should not be interpreted to contradict the terms of the MIT license:
>
> ```
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
> MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
> NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
> LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
> OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
> WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
> ```

## Security scenarios

Git doesn't provide a formal security specification, so to facilitate analysis of Sparo contributions, we've identified usage scenarios that imply security requirements. We welcome your feedback -- please [let us know](../support/contributing.md) if we've overlooked an important use case or if Git does not behave as described.

### SS1: Safely clone an untrusted repo

Suppose that an unfamiliar remote Git repository contains malicious files, which includes malicious config files such as `.gitattributes`, `.gitignore`, and Git hook scripts.  The following operations are expected to be safe:

- Using `git clone` to clone the remote repo.
- Using `git checkout` to checkout files.
- Using `git commit` to commit modifications of local files.

Git ensures safety by ignoring Git hooks and `.gitattributes` filters by default.  The user must explicitly run a command to "opt-in", signifying their trust that the repository is free from malicious code.  For example, invoking `rush install` will register predefined Git hooks, because NPM installation involves executing untrusted scripts and therefore signifies trust in the cloned repository.  As another example, if `.gitattributes` references the LFS filter, the user must first opt-in by running `git lfs install`, signifying their trust that the filter author has implemented security protections against malicious inputs for that filter.

Sparo introduces additional config files such as [&lt;profile-name&gt;.json](../configs/profile_json.md).  Parsing of these config files must also treat the inputs as potentially malicious, and provide the same guarantees.

### SS2: Safely clone an untrusted repository parameter

A command such as `git clone https://github.com/example/project.git` will write into a subfolder called `project`.  The Git documentation calls this the ["humanish"](https://git-scm.com/docs/git-clone#Documentation/git-clone.txt-ltdirectorygt) portion of the URL.

Consider a remote service that receives the `REPOSITORY` parameter as a text string and then invokes `git clone REPOSITORY` with correct shell-escaping of the parameter.  In calculating the humanish folder name, Git should not incorporate special characters such as `..` or `/` that would cause the operation to write cloned files outside of the intended folder.

And of course, if an explicit target folder is specified using `git clone https://github.com/example/project.git my-folder`, then no files should be cloned outside of the `my-folder` folder.

### SS3: Git parameters may include special characters

Shell interpreters commonly transform expressions involving special characters such as `$`, `%`, `(`, etc.  For example:

```shell
# Problem: Bash would replace "$project" with the value of 
# the environment variable whose name is "project".
git clone https://github.com/example/project.git $project
```

This requires escaping:

```shell
# This backslash escape ensures that a literal dollar sign
# is included in the created folder name:
git clone https://github.com/example/project.git \$project
```

When the `sparo` command-line invokes subprocesses such as `git`, it must carefully ensure that process arguments are correctly escaped to avoid being transformed by the shell.  For example, if `\$project` gets expanded by the shell during subprocess invocation, the escaping will be defeated, which could be exploited to circumvent the other Sparo security guarantees.  If certain characters [cannot be safely escaped](https://github.com/microsoft/rushstack/blob/e2a17c81731cadc6b39b8e75c08dfccb9bc5ce9c/libraries/node-core-library/src/Executable.ts#L689) by Node.js, they should be rejected with an error message.


## Security assumptions

It's also useful to point out aspects that are NOT expected to be secure.

## Assumption: Shell environment variables are trusted

For the most part, the `git` CLI assumes that the shell environment variables are trusted.  For example, it relies on the `PATH` variable to discover the location of the `ssh` binary, and most of the parent process's variables are passed through to child processes.

Because Sparo the tool is invoked by the Node.js runtime, arbitrary code execution is possible via environment variables such as [NODE_OPTIONS](https://nodejs.org/api/cli.html#node_optionsoptions).

## Assumption: Command line is generally trusted

The `git` command-line accepts parameters such as [-c](https://git-scm.com/docs/git#Documentation/git.txt--cltnamegtltvaluegt) which can trigger execution of arbitrary code.  Therefore in general, we assume that the command-line parameters are trusted.  However, certain parameters can provide stricter guarantees, for example the `<repository>` argument for `git clone` mentioned in **SS3**.

## Assumption: Commands may consume excessive resources

Commands such as `git clone` may consume an arbitrary amount of disk space or take arbitrarily long to complete. In general, denial-of-service attacks are not considered an important risk for this type of development tool.

## Assumption: STDOUT and STDERR may contain arbitrary characters

When invoking the `git` CLI, the console output may include strings printed by hook scripts or other shell commands. These strings may contain special characters that are unsafe to embed in other contexts such as an HTML document or SQL string literal. It is the responsibility of the calling processes to correctly escape any STDOUT or STDERR output produced by the `git` or `sparo` process.

