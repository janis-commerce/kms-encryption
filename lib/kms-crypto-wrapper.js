'use strict';

const { KmsKeyringNode, encrypt, decrypt } = require('@aws-crypto/client-node');

module.exports = { KmsKeyringNode, encrypt, decrypt };
