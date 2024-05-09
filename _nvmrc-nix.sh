. ~/.nvm/nvm.sh --version
nvm use
version=$(head -n 1 .nvmrc)
nvm install $version

# This enables the use of the bundled Yarn.
npm i -g corepack
corepack enable
