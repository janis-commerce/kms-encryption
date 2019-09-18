'use strict';

class KmsEncryptionError extends Error {

	static get codes() {

		return {};

	}

	constructor(err, code) {
		super(err);
		this.message = err.message || err;
		this.code = code;
		this.name = 'KmsEncryptionError';
	}
}

module.exports = KmsEncryptionError;
