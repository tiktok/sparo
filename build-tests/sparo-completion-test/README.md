# sparo-completion-test

Building this project tests sparo command completion outputs

# Details

`lib/start-test.js` is run after building the project. This scripts generate the output text files under `temp/etc`. In local builds, those files are copied to `etc` folder. During a CI build, the files under these two folders are compared and the CI build fails if they are different. This ensures that files under `etc` folder must be up to date in the PR, and people who review the PR must approve any changes.

# How to fix the build errors

Run `rush build -t sparo-completion-test` to regenerate files under `etc` folder and commit them into Git.