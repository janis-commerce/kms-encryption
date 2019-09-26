# kms-encryption

[![Build Status](https://travis-ci.org/janis-commerce/kms-encryption.svg?branch=master)](https://travis-ci.org/janis-commerce/kms-encryption)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/kms-encryption/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/kms-encryption?branch=master)



## Installation
```sh
npm install @janiscommerce/kms-encryption
```

## Usage
```js
const KmsEncryption = require('@janiscommerce/kms-encryption');
```

## API
* constructor(options)
  * options {object} The configuration options for the package. See details below.
  
* *async* encrypt(toEncrypt)
  * toEncrypt {mixed} The data you want to encript
  * **returns** {string} The encripted data, base64 encoded.

* *async* decrypt(toDecrypt)
  * toDecrypt {string} The encripted data, base64 encoded.
  * **returns** {mixed} The decoded data
  
## Options

This are all the available options you can pass to the constructor:
* keyArn {string} The complete ARN of the AWS KMS Key
* aliasArn {string} The complete ARN of the AWS KMS Key Alias

## Examples
```js
const keyArn = 'arn:aws:kms:us-east-1:111111111111:key/a11a11a1-111f-1111-b111-1c11111111f1';

// It also works with key's alias, for example:
// const keyArn = 'arn:aws:kms:us-east-1:111111111111:alias/SomeAlias';

const kmsEncryption = new KmsEncryption({ keyArn });

const dataEncrypted = await kmsEncryption.encrypt({ example: 'test' });
/*
Example result:
AQN4zpliC2BHAl8BFWF3cy1jcnlwdG8tcHVibGljLWtleURBbFE4VWxvL1hGdFlQNi8rOVRPblc3d2E1OWNUaUJCcVpybkh5YitMcjBvem9Pb3gxaitpRkhYK1FFblovWGFDdkE9PQIHYXdzLWttc0thcm46YXdzOmttczp1cy1lYXN0LTE6MDAwMDAwMDAwMDAwOmtleS8xMjM0NTY3OC0xMjM0LTU2NzgtYWJjZC1lZjEyMzQ1Njc4OWEBAgF4NiY8UNquOGwM6qegCVtBLhRNSyR2alkBfncIE3oJCNitdSZUfjB8BgkqSAoBBwZvMG0CATBoBgkqSAoBBwEwHgYJYEgBZQMEAS4wEQQMas2FelwaJ3ECARA7ZCxqGlQDVQzImtyifhEiOwswVW1gPVE1Gix4eh8WFAdhd3Mta21zS2Fybjphd3M6a21zOnVzLWVhc3QtMTowMDAwMDAwMDAwMDA6a2V5LzEyMzQ1Njc4LTEyMzQtNTY3OC1hYmNkLWVmMTIzNDU2Nzg5YQECAng2JjxQ2q44bAzqp6AJW0EuFE1LJHZqWQEsMxFwYH4wfAYJKkgKAQcGbzBtAgEwaAYJKkgKAQcBMB4GCWBIAWUDBAEuMBEEDHF7ZB5JAgEQO8qjZHLdlEgKNRpgaDkgWG5HES7Rr1dzYc6gOi1sRlBMcQ4CDBACdmQFdGAJWQEBBWJ9AXAlXWsuKUoEF3sICCLHpRZ2CydxS37bqXcvVGF1XR92EUoyZEoKJm0jUwh+NCfMuRlPVGdWBh5UVW48KHTCiHoICB0UHRoSdHMxVR1lQWdnMGUCMSlCPmI2X3kMEsu+ZgotKwIiBBM2MQV1SF0CMEE6TClPbD1YSCoOfVgOel9bLgJTBE4LNVswWQM=
*/

const dataDecrypted = await kmsEncryption.decrypt(dataEncrypted);
/*
Expected result:
{
	example: 'test'
}
```
