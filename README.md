# github-remote-commit

## cli

### Commit a file
```bash
commit package.json \
  -m 'Foo bar' \
  -b user/repo:master \
  -h fix-foo \
  -t [github-token]
```

### Create a pull request
```bash
pull-request \
  -b user/repo:master \
  -h user/repo:fix-foo \
  --title 'Title of pull request' \
  --body 'Optional body of pull request' \
  -t [github-token]
```

### Commit and create a pull request at once
```bash
pull-request package.json
  -t [github-token]
  -m 'Upgrade Version'
  -h user/repo:fix-foo \
  -b user/repo:master \
  --title 'Title of pull request'
```


The module **will** support std-input for the file content
```bash
commit package.json -b user/repo:master -h foobar -m 'Foo bar' -
```


## api

```javascript
var github = require('github-remote-commit')
github.commit(config, callback)
github.pullRequest(config, callback)
```

### github.commit config
```javascript
{
  token: 'github token'
  message: 'commit message',

  // one file
  file: {path: 'path/to/file.js', content: 'content as string'},
  // or many
  files: [{path: 'path/to/file.js', content: 'content as string'}],

  base: 'user/repo:branch', # use user/repo:master
  head: 'branch-to-create' # just use 'master' if
                           # you want to commit to that branch
```


### github.pullRequest config
```javascript
{
  token: 'github token',
  message: 'commit message',

  // one file
  file: {path: 'path/to/file.js', content: 'content as string'},
  // or many
  files: [{path: 'path/to/file.js', content: 'content as string'}],

  base: 'user/repo:branch', # use user/repo:master
  head: 'branch-to-create', # just use 'master' if
                            # you want to commit to that branch

  pr: {
    title: 'Pull request title',
    body: 'Pull request body',
    // or
    issue: 1 // issue to convert
  }
```
