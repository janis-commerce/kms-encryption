'use strict';

const assert = require('assert');

const sandbox = require('sinon').createSandbox();

const KmsEncryption = require('./../index');

const KMSWrapper = require('./../lib/kms-crypto-wrapper');
const KmsEncryptionError = require('./../lib/kms-encryption-error');

describe('KmsEncryption', () => {

	beforeEach(() => {
		this.encrypt = new KmsEncryption('arn:aws:kms:us-east-1:111111111111', 'AliasForTest', 'a11a11a1-111f-1111-b111-1c11111111f1');
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('Should error on create a instance', async () => {
		assert.throws(() => {
			new KmsEncryption('', '', '');
		});
	});

	it('Should encrypt', async () => {
		const encryptStub = sandbox.stub(KMSWrapper, 'encrypt');
		encryptStub.resolves({
			ciphertext: Buffer.from('dGhpcyBpcyBhIHRlc3Q=', 'base64')
		});

		const res = await this.encrypt.encrypt('this is a test');

		assert(encryptStub.called);
		assert.equal(res, 'dGhpcyBpcyBhIHRlc3Q=');
	});

	it('Should error on encrypt', () => {
		const encryptStub = sandbox.stub(KMSWrapper, 'encrypt');
		encryptStub.resolves({});

		assert.rejects(async () => {
			await this.encrypt.encrypt('this is a test');
		}, new KmsEncryptionError('Error on encrypt: invalid ciphertext from service', KmsEncryptionError.codes.encrypt));

		assert(encryptStub.called);
	});

	it('Should decrypt', async () => {
		const decryptStub = sandbox.stub(KMSWrapper, 'decrypt');
		decryptStub.resolves({
			plaintext: Buffer.from(JSON.stringify('this is a test'), 'utf8')
		});

		const res = await this.encrypt.decrypt('dGhpcyBpcyBhIHRlc3Q=');

		assert(decryptStub.called);
		assert.equal(res, 'this is a test');
	});

	it('Should error on decrypt', () => {
		const decryptStub = sandbox.stub(KMSWrapper, 'decrypt');
		decryptStub.resolves({});

		assert.rejects(async () => {
			await this.encrypt.decrypt('dGhpcyBpcyBhIHRlc3Q=');
		}, new KmsEncryptionError('Error on decrypt: invalid plaintext from service', KmsEncryptionError.codes.decrypt));

		assert(decryptStub.called);
	});

});
