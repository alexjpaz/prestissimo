module.exports = {
  addons: [
    '@storybook/addon-actions/register',
    '@storybook/addon-knobs/register'
  ],
  stories: [
    '../ui/**/*.stories.[tj]s',
  ],
};
