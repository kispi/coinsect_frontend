const AWS = require('aws-sdk')
const path = require('path')
const fs = require('fs')
const aExec = require('await-exec')
const chalk = require('chalk')
const promptConfirm = require('prompt-confirm')

const s3 = new AWS.S3()
const bucket = {
  dev: '',
  prod: '',
}

const exec = async arg => await aExec(arg)
const print = o => console.log(o)
const success = o => console.log(chalk.green(o))
const failed = o => console.log(chalk.red(o))
const uploadArgs = env => ({
  buildOpt: env === 'dev' ? 'build-dev' : 'build',
  bucketName: bucket[env],
  uploadTargetDirectory: env === 'dev' ? 'dist-dev' : 'dist'
})

const build = async (buildOpt) => {
  if (!buildOpt) {
    return Promise.reject('build: buildOpt is not specified.')
  }
  print('run ' + buildOpt + '...\n')
  print('\n\n1. Started building...')
  const result = await exec('npm run ' + buildOpt)
  print(result.stdout)
  success('Build finished!')
  return Promise.resolve()
}

const uploadToS3 = async (bucketName, uploadTargetDirectory) => {
  if (!uploadTargetDirectory) {
    return Promise.reject('uploadToS3: uploadTargetDirectory is not specified.')
  }

  print('\n\n3. Distributing current version...')

  const readDir = (dir) =>
    fs.readdirSync(dir)
      .reduce((files, file) =>
      fs.statSync(path.join(dir, file)).isDirectory() ?
        files.concat(readDir(path.join(dir, file))) :
        files.concat(path.join(dir, file)),
      [])

  let bucketPath, params
  let uploaded = 0
  let filePaths = readDir(uploadTargetDirectory)

  return new Promise((resolve) => {
    filePaths.forEach(filePath => {
      filePath = filePath.replace(/\\/g, '/')
      bucketPath = filePath.substring(uploadTargetDirectory.length+1)
  
      params = {
        Bucket: bucketName,
        Key: bucketPath,
        Body: fs.readFileSync(filePath),
        ACL: 'public-read',
        CacheControl: 'max-age=0',
      }
      if (filePath.includes('.html')) {
        params.ContentType = 'text/html'
      }
      if (filePath.includes('.css')) {
        params.ContentType = 'text/css'
      }
      if (filePath.includes('.js')) {
        params.ContentType = 'application/js'
      }
      if (filePath.includes('.svg')) {
        params.ContentType = 'image/svg+xml'
      }
      s3.putObject(params, (err) => {
        if (err) {
          failed(err)
          return
        }
        success('successfully uploaded '+ filePath +' to ' + bucketName)
        uploaded++

        if (filePaths.length === uploaded) {
          return resolve()
        }
      })
    })
  })
}

const deletePreviousDistribution = async (bucketName) => {
  const help = () =>
    `It seems like you don't have AWS-CLI. Copy and paste and run these and try again:\n\n` +
    `curl 'https://s3.amazonaws.com/aws-cli/awscli-bundle.zip' -o 'awscli-bundle.zip'\n` +
    `unzip awscli-bundle.zip\n` +
    `sudo ./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws\n` +
    `rm -rf awscli-bundle\n` +
    `rm awscli-bundle.zip\n\n` +
    `You might refer to this:\nhttps://docs.aws.amazon.com/ko_kr/cli/latest/userguide/install-macos.html`

  if (!bucketName) {
    return Promise.reject('deletePreviousDistribution: bucketName is not specified.')
  }

  print('\n\n2. Started deleting previous distribution from S3...')

  try {
    await exec('aws s3 rm s3://' + bucketName + ' --recursive')
    success('Bucket successfully got emptied!')
    return Promise.resolve()
  } catch (e) {
    return Promise.reject(help())
  }
}

const deploy = async (env) => {
  const o = uploadArgs(env)

  try {
    await build(o.buildOpt)
    await deletePreviousDistribution(o.bucketName)
    await uploadToS3(o.bucketName, o.uploadTargetDirectory)
    success('\n\nDeploy finished!')
  } catch (e) {
    failed(e)
  }
}

let arg = process.argv[2]
if (!arg || ['all', 'prod', 'dev'].indexOf(arg) === -1) {
  print('Usage:)\n' +
  'node deploy [branch] => branch: all, prod, dev\n' +
  'EX:) node deploy all')
  return
}

const TMI = arg === 'all' ? ' (This executes multiple deploys concurrently.)' : ''
confirm = new promptConfirm(`deploy ${arg}?` + TMI)
  .ask(yes => {
    if (yes) {
      if (arg === 'dev' || arg === 'all') deploy('dev')
      if (arg === 'prod' || arg === 'all') deploy('prod')
    } else {
      success(`Sure. Make sure everything is OK before deploying.`)
    }
  })