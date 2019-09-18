'use strict';

const KmsEncryptionError = require('./kms-encryption-error');
const KMSWrapper = require('./kms-crypto-wrapper');

class KmsEncryption {

	constructor(arn, alias, key) {
		try {
			this.keyProcess = new KMSWrapper.KmsKeyringNode({
				generatorKeyId: `${arn}:alias/${alias}`,
				keyIds: [`${arn}:key/${key}`]
			});
		} catch(err) {
			throw new KmsEncryptionError(`Error at create KMS Key: ${err.message}`, KmsEncryptionError.codes.key);
		}
	}

	async _process(method, value, ...params) {
		try {
			const { [value]: response } = await KMSWrapper[method](this.keyProcess, ...params);

			if(!response)
				throw new Error(`invalid ${value} from service`);

			return this[`_${method}Format`](response);

		} catch(err) {
			throw new KmsEncryptionError(`Error on ${method}: ${err.message}`, KmsEncryptionError.codes[method]);
		}
	}

	_encryptFormat(ciphertext) {
		return ciphertext.toString('base64');
	}

	_decryptFormat(plaintext) {
		return JSON.parse(plaintext.toString());
	}

	encrypt(toEncrypt) {
		return this._process('encrypt', 'ciphertext', JSON.stringify(toEncrypt));
	}

	decrypt(toDecrypt) {
		return this._process('decrypt', 'plaintext', toDecrypt, { encoding: 'base64' });
	}
}

module.exports = KmsEncryption;
