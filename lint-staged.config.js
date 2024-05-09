module.exports = {
  '*.{ts,tsx,js,jsx,graphql}': [
    'npx nx format:write --uncommitted',
    'npx eslint --cache --fix',
  ],
  '*.{json,md}': 'npx nx format:write --uncommitted',
};
