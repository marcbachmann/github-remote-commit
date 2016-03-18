var fs = require('fs')
var path = require('path')
var rc = require('rc')('github_remote_commit')
var github = require('./index')

github.pullRequest({
  token: rc.t || rc.token,
  message: rc.m || rc.message,
  file: getFile(rc._[0]),
  base: rc.b || rc.base,
  head: rc.h || rc.head,
  pr: {
    title: rc.title,
    body: rc.body,
    issue: rc.issue
  }
}, function (err, res) {
  if (err) return exit(err)
  console.log('Success', res)
})

function getFile (filePath) {
  if (!filePath) return
  var fileContent = fs.readFileSync(path.resolve(filePath), 'utf8')
  return {
    path: filePath,
    content: fileContent
  }
}

function exit (error) {
  if (error) console.error(error + '\n')
  console.log([
    'Usage: pull-request path/to/file/to/commit.md [arguments]',
    '',
    'Where [arguments] is a combination of:',
    '  -t, --token     A github token',
    '  -m, --message   A commit message',
    '  -b, --base      Base branch, e.g. user/repo:master',
    '  -h, --head      Target branch, e.g. fix-something',
    '  --title         The pull request title, required',
    '  --body   The pull request body'
  ].join('\n'))

  process.exit(1)
}
