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

	it('Should error on create a instance when received an invalid parameter', async () => {
		// invalid type
		assert.throws(() => {
			new KmsEncryption('');
		}, KmsEncryptionError);

		// empty ARNs
		assert.throws(() => {
			new KmsEncryption({ keyArn: '', aliasArn: '' });
		}, KmsEncryptionError);

		// invalid format ARNs
		assert.throws(() => {
			new KmsEncryption({ keyArn: 'arn:test:error', aliasArn: 'arn:test:error' });
		}, KmsEncryptionError);

		// invalid type(key or alias) in ARNs
		assert.throws(() => {
			new KmsEncryption({ keyArn: 'arn:test:error:error:invalid:test', aliasArn: 'arn:test:error:error:invalid:test' });
		}, KmsEncryptionError);

		// valid type but empty value(type value)
		assert.throws(() => {
			new KmsEncryption({ keyArn: 'arn:test:error:error:key:', aliasArn: 'arn:test:error:error:alias:' });
		}, KmsEncryptionError);

		// valid structure ARN but invalid content
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

	it('Should error on encrypt when received a invalid body', () => {
		const encryptStub = sandbox.stub(this.encrypt._kms, 'encrypt');
		encryptStub.returns({
			promise: () => Promise.resolve({})
		});

		assert.rejects(async () => {
			await this.encrypt.encrypt('this is a test');
		}, new KmsEncryptionError('Error on encrypt: invalid response from service', KmsEncryptionError.codes.encrypt));

		assert(encryptStub.called);
	});

	it('Should error on encrypt when error on call to service', () => {
		const encryptStub = sandbox.stub(this.encrypt._kms, 'encrypt');
		encryptStub.returns({
			promise: () => Promise.reject()
		});

		assert.rejects(async () => {
			await this.encrypt.encrypt('this is a test');
		}, new KmsEncryptionError('Error on encrypt: call to service', KmsEncryptionError.codes.encrypt));

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

	it('Should error on decrypt when received a invalid body', () => {
		const decryptStub = sandbox.stub(this.encrypt._kms, 'decrypt');
		decryptStub.returns({
			promise: () => Promise.resolve({})
		});
		assert.rejects(async () => {
			await this.encrypt.decrypt('dGhpcyBpcyBhIHRlc3Q=');
		}, new KmsEncryptionError('Error on decrypt: invalid response from service', KmsEncryptionError.codes.decrypt));

		assert(decryptStub.called);
	});

	it('Should error on decrypt when error on call to service', () => {
		const decryptStub = sandbox.stub(this.encrypt._kms, 'decrypt');
		decryptStub.returns({
			promise: () => Promise.reject()
		});
		assert.rejects(async () => {
			await this.encrypt.decrypt('dGhpcyBpcyBhIHRlc3Q=');
		}, new KmsEncryptionError('Error on decrypt: call to service', KmsEncryptionError.codes.decrypt));

		assert(decryptStub.called);
	});

});
