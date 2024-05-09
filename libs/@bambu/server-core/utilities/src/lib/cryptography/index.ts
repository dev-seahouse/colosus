import * as OpenPgp from 'openpgp';

export interface IDecryptContentParamsDto {
  encryptedContentBase64: string;
  publicKeyBase64: string;
  privateKeyBase64: string;
  passphrase: string;
}

async function generateOpenPgpKeys(
  publicKeyBase64: string,
  privateKeyBase64: string,
  passphrase: string
): Promise<{ privateKey: OpenPgp.PrivateKey; publicKey: OpenPgp.Key }> {
  const publicKeyArmored: string = Buffer.from(
    publicKeyBase64,
    'base64'
  ).toString();
  const publicKey: OpenPgp.Key = await OpenPgp.readKey({
    armoredKey: publicKeyArmored,
  });

  const privateKeyArmored: string = Buffer.from(
    privateKeyBase64,
    'base64'
  ).toString();
  const privateKey: OpenPgp.PrivateKey = await OpenPgp.decryptKey({
    privateKey: await OpenPgp.readPrivateKey({ armoredKey: privateKeyArmored }),
    passphrase,
  });

  return { publicKey, privateKey };
}

export async function decryptContent(
  input: IDecryptContentParamsDto
): Promise<string> {
  const {
    privateKeyBase64,
    publicKeyBase64,
    encryptedContentBase64,
    passphrase,
  } = input;
  const { privateKey, publicKey } = await generateOpenPgpKeys(
    publicKeyBase64,
    privateKeyBase64,
    passphrase
  );

  const encrypted: string = Buffer.from(
    encryptedContentBase64,
    'base64'
  ).toString();
  const message: OpenPgp.Message<string> = await OpenPgp.readMessage({
    armoredMessage: encrypted,
  });
  const decrypted = await OpenPgp.decrypt({
    message,
    verificationKeys: publicKey,
    decryptionKeys: privateKey,
  });

  return decrypted.data as string;
}

export interface IEncryptContentParamsDto {
  content: string;
  publicKeyBase64: string;
  privateKeyBase64: string;
  passphrase: string;
}

export interface IEncryptContentResultDto {
  encryptedContentBase64: string;
  encryptedContentArmored: string;
}

export async function encryptContent(
  input: IEncryptContentParamsDto
): Promise<IEncryptContentResultDto> {
  const { content, publicKeyBase64, privateKeyBase64, passphrase } = input;

  const { privateKey, publicKey } = await generateOpenPgpKeys(
    publicKeyBase64,
    privateKeyBase64,
    passphrase
  );

  const encrypted = await OpenPgp.encrypt({
    message: await OpenPgp.createMessage({ text: content }),
    encryptionKeys: publicKey,
    signingKeys: privateKey,
  });

  return {
    encryptedContentBase64: Buffer.from(encrypted.toString()).toString(
      'base64'
    ),
    encryptedContentArmored: encrypted.toString(),
  };
}
