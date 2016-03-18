var defaults = require('lodash.defaults')
var assert = require('assert')
var github = require('github-basic')

module.exports = {
  pullRequest: pullRequest,
  commit: commit
}

function pullRequest (opts, callback) {
  try {
    assert(typeof opts.pr === 'object', "The parameter 'config.pr' is required.")
    if (opts.pr.issue) {
      assert(typeof opts.pr.issue === 'number', "The parameter 'config.pr.issue' must be a number.")
    } else {
      assertString(opts.pr.title, 'config.pr.title')
    }
  } catch (err) {
    return callback(err)
  }

  // hack to circumvent commit
  if (!opts.file && !(opts.files && opts.files.length)) opts._skip = true
  commit(opts, function (err) {
    if (err) return callback(err)
    var pr = {title: opts.pr.title, body: opts.pr.body, issue: opts.pr.issue}
    var base = getRepoFromStringOrObject(opts.base)
    var head = getRepoFromStringOrObject(opts.head)
    defaults(base, head)
    defaults(head, base)
    var client = github({version: 3, auth: opts.token})
    client.pull(head, base, pr, callback)
  })
}

function commit (opts, callback) {
  try {
    var base = getRepoFromStringOrObject(opts.base)
    var head = getRepoFromStringOrObject(opts.head)
    assertString(opts.token, 'config.token')
    assertString(opts.message, 'config.message')
    assertString(base.user, 'config.base.user')
    assertString(base.repo, 'config.base.repo')
    assertString(base.branch, 'config.base.branch')
    assertString(head.branch, 'config.head.branch')
  } catch (err) {
    return callback(err)
  }
  if (opts._skip) return callback()

  var files
  if (typeof opts.file === 'object') files = [opts.file]
  else files = opts.files || []

  try {
    files = files.filter(Boolean).map(function (file, i) {
      assertString(file.path, `config.files[${i}].path`)
      assertString(file.content, `config.files[${i}].content`)
      return {path: file.path, content: file.content}
    })
    assert(files.length, "One of the parameters 'config.file' or 'config.files' is required.")
  } catch (err) {
    return callback(err)
  }

  var client = github({version: 3, auth: opts.token})
  client.branch(base.user, base.repo, base.branch, head.branch, function (err) {
    if (err && err.statusCode === 422) err = undefined // ignore branch existence errors
    if (err) return callback(err)
    client.commit(base.user, base.repo, {
      branch: head.branch,
      message: opts.message,
      updates: files
    }, callback)
  })
}

function getRepoFromStringOrObject (head) {
  var obj = {user: undefined, repo: undefined, branch: undefined}
  if (typeof head === 'string') {
    var m = head.match(/^(.*)\/(.*):(.*)$/)
    if (m) {
      obj.user = m[1]
      obj.repo = m[2]
      obj.branch = m[3]
    } else if (/\//.test(head)) {
      m = head.split('/')
      obj.user = m[0]
      obj.repo = m[1]
      obj.branch = 'master'
    } else {
      if (!/[\/:]/.test(head)) obj.branch = head
    }
  } else if (typeof head === 'object') {
    obj.user = head.user
    obj.repo = head.repo
    obj.branch = head.branch
  }

  return obj
}

function assertString (param, name) {
  assert(typeof param === 'string', "The parameter '" + name + "' is required.")
}
