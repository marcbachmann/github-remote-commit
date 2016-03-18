var fs = require('fs')
var path = require('path')
var rc = require('rc')('github_commit')
var github = require('./index')

var file = getFile(rc._[0])
github.commit({
  token: rc.t || rc.token,
  message: rc.m || rc.message,
  file: file,
  base: rc.b || rc.base,
  head: rc.h || rc.head
}, function (err, res) {
  if (err) return exit(err)
  console.log('Success', res)
})

function getFile (filePath) {
  if (!filePath) exit("Can't commit without a file. Please pass one in the arguments.")
  var fileContent = fs.readFileSync(path.resolve(filePath), 'utf8')
  return {
    path: filePath,
    content: fileContent
  }
}

function exit (error) {
  if (error) console.error(error + '\n')
  console.log([
    'Usage: commit path/to/file/to/commit.md [arguments]',
    '',
    'Where [arguments] is a combination of:',
    '  -t, --token     A github token',
    '  -m, --message   A commit message',
    '  -b, --base      Base branch, e.g. user/repo:master',
    '  -h, --head      Target branch, e.g. fix-something'
  ].join('\n'))

  process.exit(1)
}
