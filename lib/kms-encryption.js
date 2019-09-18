'use strict';

const KmsEncryptionError = require('./kms-encryption-error');
const KMSWrapper = require('./kms-crypto-wrapper');

class KmsEncryption {

	/**
	 * Constructs the object.
	 *
	 * @param {string} arn The arn create in KMS (AWS)
	 * @param {string} alias The alias of the key created in service
	 * @param {string} key The key of the key(KMS) created in service
	 */
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

	/**
	 * Process data with KMS package
	 *
	 * @param string method The method name to call in KMS
	 * @param string value The value to obtain in Process
	 * @param {Array} params The parameters
	 * @return {Promise} Response formatted or error in another case
	 */
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

	/**
	 * Format response from encrypt
	 *
	 * @param {string} ciphertext The ciphertext
	 * @return {string} response formatted
	 */
	_encryptFormat(ciphertext) {
		return ciphertext.toString('base64');
	}

	/**
	 * Format response from decrypt
	 *
	 * @param {string} plaintext The plaintext
	 * @return {mixed} response formatted
	 */
	_decryptFormat(plaintext) {
		return JSON.parse(plaintext.toString());
	}

	/**
	 * Encrypt data with KMS
	 *
	 * @param {mixed} toEncrypt To encrypt
	 * @return {promise} data encrypted
	 */
	encrypt(toEncrypt) {
		return this._process('encrypt', 'ciphertext', JSON.stringify(toEncrypt));
	}

	/**
	 * Decrypt data encrypted with KMS
	 *
	 * @param {string} toDecrypt To decrypt
	 * @return {promise} data decrypted
	 */
	decrypt(toDecrypt) {
		return this._process('decrypt', 'plaintext', toDecrypt, { encoding: 'base64' });
	}
}

module.exports = KmsEncryption;
