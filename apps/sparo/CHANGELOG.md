# Change Log - sparo

This log was last generated on Tue, 02 Jul 2024 18:03:52 GMT and should not be manually modified.

## 1.4.0
Tue, 02 Jul 2024 18:03:52 GMT

### Updates

- Improve logic to check existence of a branch
- Enhance metric logic to accurately report success data

## 1.3.0
Fri, 31 May 2024 18:31:02 GMT

### Updates

- "sparo checkout -" can checkout to previous branch correctly
- "sparo pull" respects temporary rush selectors "--to" and "--from".

## 1.2.0
Fri, 24 May 2024 23:10:09 GMT

### Updates

- Improve "sparo checkout" help text for "--profile", "--add-profile" and "--no-profile" paramters
- "sparo fetch" and "sparo pull" automatically clean up merged branches from the git configuration before actually invoking git fetch or pull

## 1.1.0
Fri, 10 May 2024 20:44:01 GMT

### Updates

- Fix checkout command in a detached HEAD state
- [sparo checkout] support cli --to/--from option for projects selection
- Improve check logic to prevent unnecessary git operations when tracking remote branches

## 1.0.8
Mon, 15 Apr 2024 23:34:54 GMT

### Minor changes

- Sparo fetch all remote branches when "sparo fetch--all"
- Track the branch which specifies to sparo checkout
- Add "sparo pull" command

### Updates

- Fix typo in recommended configs

## 1.0.7
Fri, 29 Mar 2024 21:28:25 GMT

### Updates

- No need to sync sparse checkout state if the target kind is file path

## 1.0.6
Fri, 29 Mar 2024 19:27:13 GMT

### Updates

- Checkout can handle branch, tag, commit SHA and file path

## 1.0.5
Fri, 15 Mar 2024 19:46:56 GMT

### Updates

- Add more comments in Sparo profile template
- Add a new launch option called "additionalSkeletonFolders" to add more folders to skeleton

## 1.0.4
Sat, 09 Mar 2024 02:43:07 GMT

### Updates

- Fix parse sparo commit -m issue

## 1.0.3
Fri, 08 Mar 2024 23:50:26 GMT

### Updates

- Fix finding rush plugin paths issue in a subfolder of repository
- Specified version takes over the sparo-lib version

## 1.0.2
Tue, 05 Mar 2024 17:16:25 GMT

### Updates

- Set mininal supported git version to 2.43.0

## 1.0.1
Tue, 05 Mar 2024 17:04:18 GMT

_Version update only_

## 1.0.0
Tue, 05 Mar 2024 17:01:33 GMT

### Updates

- Update the minimal git supported version to 2.44.0
- Improve the "sparo init-profile" template comments

## 0.0.7
Tue, 05 Mar 2024 04:37:22 GMT

### Updates

- Support --profile parameter in clone command
- Fix a compatibility issue when getting profile name on Windows OS

## 0.0.6
Sat, 02 Mar 2024 06:30:17 GMT

### Patches

- Fix a regression in sparo checkout

## 0.0.5
Fri, 01 Mar 2024 23:21:32 GMT

### Updates

- Improve error logs when get projects from selection failed
- Allow other configuration files under sparo files folder
- Add subspace folders under all project folders into skeleton
- Add help alias and enable strict mode

## 0.0.4
Fri, 01 Mar 2024 09:03:08 GMT

### Updates

- --help and help shows basic help text
- List all available profiles when no --project specified
- Improve "sparo checkout" to support the --add-profile parameter
- Add update notifier
- Support checkout --to or --from in sparo-ci, replacing sparo-ci sparse
- support for cloning a specify branch
- Add website links to README.md and package.json

## 0.0.3
Sat, 24 Feb 2024 04:08:09 GMT

### Updates

- Improve terminal user interface
- Add "sparo init-profile --profile <name>" command
- Support checkout uncommitted sparo profiles
- add remote and branch arguments for sparo fetch & cr fix
- fix load path in sparo profile service
- Fix log format
- Add a startup banner display version infos

## 0.0.2
Thu, 22 Feb 2024 01:51:44 GMT

### Updates

- Remove housekeeping code
- Update documentation

## 0.0.1
Thu, 22 Feb 2024 00:07:39 GMT

### Updates

- Initial implementation

