const pluginName = require('./package.json').name

module.exports = {
  branches: 'main',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      { npmPublish: false }
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'zip -qq -r ' + pluginName + '-${nextRelease.version}.zip package.json logo.png dist/'
      }
    ],
    [
      '@semantic-release/github',
      {
        assets: [`${pluginName}-*.zip`]
      }
    ]
  ]
}