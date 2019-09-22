/* eslint no-underscore-dangle: 0 */

'use strict';

const assert = require('assert');
const sandbox = require('sinon').createSandbox();

const KmsEncryption = require('./../index');
const KmsEncryptionError = require('./../lib/kms-encryption-error');

describe('KmsEncryption', () => {

	beforeEach(() => {
		this.encrypt = new KmsEncryption({ keyArn: 'arn:aws:kms:us-east-1:111111111111:key/a11a11a1-111f-1111-b111-1c11111111f1' });
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('Should error on create a instance', async () => {
		assert.throws(() => {
			new KmsEncryption('');
		}, KmsEncryptionError);

		assert.throws(() => {
			new KmsEncryption({ keyArn: '', aliasArn: '' });
		}, KmsEncryptionError);

		assert.throws(() => {
			new KmsEncryption({ keyArn: 'arn:test:error', aliasArn: 'arn:test:error' });
		}, KmsEncryptionError);

		assert.throws(() => {
			new KmsEncryption({ keyArn: 'arn:test:error:error:invalid:test', aliasArn: 'arn:test:error:error:invalid:test' });
		}, KmsEncryptionError);

		assert.throws(() => {
			new KmsEncryption({ keyArn: 'arn:test:error:error:key:', aliasArn: 'arn:test:error:error:alias:' });
		}, KmsEncryptionError);

		assert.throws(() => {
			new KmsEncryption({ keyArn: 'arn:test:error:error:key:test', aliasArn: 'arn:test:error:error:alias:test' });
		}, KmsEncryptionError);
	});

	it('Should encrypt', async () => {
		const encryptStub = sandbox.stub(this.encrypt._kms, 'encrypt');
		encryptStub.returns({
			promise: () => Promise.resolve({
				CiphertextBlob: Buffer.from('dGhpcyBpcyBhIHRlc3Q=', 'base64')
			})
		});

		const res = await this.encrypt.encrypt('this is a test');

		assert(encryptStub.called);
		assert.equal(res, 'dGhpcyBpcyBhIHRlc3Q=');
	});

	it('Should error on encrypt', () => {
		const encryptStub = sandbox.stub(this.encrypt._kms, 'encrypt');
		encryptStub.returns({
			promise: () => Promise.resolve({})
		});

		assert.rejects(async () => {
			await this.encrypt.encrypt('this is a test');
		}, new KmsEncryptionError('Error on encrypt: invalid response from service', KmsEncryptionError.codes.encrypt));

		assert(encryptStub.called);
	});

	it('Should decrypt', async () => {
		const decryptStub = sandbox.stub(this.encrypt._kms, 'decrypt');
		decryptStub.returns({
			promise: () => Promise.resolve({
				Plaintext: Buffer.from(JSON.stringify('this is a test'), 'utf8')
			})
		});

		const res = await this.encrypt.decrypt('dGhpcyBpcyBhIHRlc3Q=');

		assert(decryptStub.called);
		assert.equal(res, 'this is a test');
	});

	it('Should error on decrypt', () => {
		const decryptStub = sandbox.stub(this.encrypt._kms, 'decrypt');
		decryptStub.returns({
			promise: () => Promise.resolve({})
		});
		assert.rejects(async () => {
			await this.encrypt.decrypt('dGhpcyBpcyBhIHRlc3Q=');
		}, new KmsEncryptionError('Error on decrypt: invalid response from service', KmsEncryptionError.codes.decrypt));

		assert(decryptStub.called);
	});

});
