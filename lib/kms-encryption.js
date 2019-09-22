'use strict';

const KmsEncryptionError = require('./kms-encryption-error');
const KMSWrapper = require('./kms-crypto-wrapper');

class KmsEncryption {

	/**
	 * Constructs the object.
	 *
	 * @param {Object} arg1 object with ARNs
	 * @param {string} arg1.keyArn The arn with key created in KMS (AWS)
	 * @param {string} arg1.aliasArn The arn with alias created in KMS (AWS)
	 */
	constructor({ keyArn, aliasArn }) {
		this._keyId = this._validateArn([keyArn, aliasArn]);
		this._kms = new KMSWrapper({
			region: this._keyId.split(':')[3]
		});
	}

	/**
	 * Validate a ARN from KMS
	 *
	 * @param {array} arns The arns
	 * @throws Will throw an error if invalid ARNs
	 * @return {string} valid ARN
	 */
	_validateArn(arns) {

		const validArn = arns.find(arn => {
			if(typeof arn !== 'string')
				return false;

			const arnSplitted = arn.split(':');
			if(arnSplitted.length !== 6)
				return false;

			const type = arnSplitted[5].split('/');
			if((type[0] !== 'key' && type[0] !== 'alias') || !type[1])
				return false;

			return arnSplitted[0] === 'arn'
				&& arnSplitted[1] === 'aws'
				&& arnSplitted[2] === 'kms'
				&& !!arnSplitted[3]
				&& !!arnSplitted[4];
		});

		if(validArn)
			return validArn;

		throw new KmsEncryptionError('Error at create KMS: invalid ARN', KmsEncryptionError.codes.arn);
	}

	/**
	 * Process data with KMS package
	 *
	 * @param {string} method The method name to call in KMS
	 * @param {string} value The value to obtain in Process
	 * @return {Promise} Response formatted or error in another case
	 */
	async _process(method, options, propertyRes) {
		try {
			const { [propertyRes]: response } = await this._kms[method](options).promise();

			if(!response)
				throw new Error('invalid response from service');

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
		return this._process('encrypt', {
			KeyId: this._keyId,
			Plaintext: Buffer.from(JSON.stringify(toEncrypt))
		}, 'CiphertextBlob');
	}

	/**
	 * Decrypt data encrypted with KMS
	 *
	 * @param {string} toDecrypt To decrypt
	 * @return {promise} data decrypted
	 */
	decrypt(toDecrypt) {
		return this._process('decrypt', {
			CiphertextBlob: Buffer.from(toDecrypt, 'base64')
		}, 'Plaintext');
	}
}

module.exports = KmsEncryption;
