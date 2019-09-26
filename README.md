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

## Examples
```js
// In this example use arn with key, remember the package support this format and with alias
// Alias format example: 'arn:aws:kms:us-east-1:111111111111:alias/AliasExample';
const arnExample = 'arn:aws:kms:us-east-1:111111111111:key/a11a11a1-111f-1111-b111-1c11111111f1';

const kmsEncryption = new KmsEncryption(arnExample);

const dataEncrypted = await kmsEncryption.encrypt({ example: 'test' }); // return an object encrypted on string in format base64
/*
Example return:
AYADeOrOmWKhC7lgxvHFR44CgKYAXwABABVhd3MtY3J5cHRvLXB1YmxpYy1rZXkAREFsUThVbG8vWEZ0WVA2Lys5VE9uVzd3YTU5Y1RpQkJxWnJuSHliK0xyMG96b09veDFqK2lGSFgrUUVuWi9YYUN2QT09AAIAB2F3cy1rbXMAS2Fybjphd3M6a21zOnVzLWVhc3QtMTowMjY4MTM5NDI2NDQ6a2V5L2Q5MGExOGMzLTc1MGYtNDU4Ny1iMzk5LThjNzU3NTUyNzBmOQC4AQIBAHg2iyY8UNquOGwM6qeguNAJW0EuhxSHoU35+0skdmpZkwF+v3cIE+p6nwmMCNitdSZUAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMn2rNha3MelwaJ/FxAgEQgDtkjixqzNcarVQDVQzImtrcon7v9xH7ziLe0DsLMK1V5m2hYOL/pD2D4VH7vDUasiyI7unkeNJ6rx8WFAAHYXdzLWttcwBLYXJuOmF3czprbXM6dXMtZWFzdC0xOjAyNjgxMzk0MjY0NDprZXkvZDkwYTE4YzMtNzUwZi00NTg3LWIzOTktOGM3NTc1NTI3MGY5ALgBAgIAeDaLJjxQ2q44bAzqp6C40AlbQS6HFIehTfn7SyR2almTAZW4LP22MxFwif/eYKHAgoEAAAB+MHwGCSqGSIb3DQEHBqBvMG0CAQAwaAYJKoZIhvcNAQcBMB4GCWCGSAFlAwQBLjARBAxxr7mne8JkwB6tSYoCARCAO6HKo2T2ct2USArPNRpguauRaPY5ysbOIFirum5HEa79LtGvV+yM43OYYc6gOo/1sS2AbEZQ8ExxDpe8AgAAAAAMAAAQAAAAAAAAAAAAAAAAAMwC2Ox2yGQFm5V0YK4J5ln/////AAAAAQAAAAAAAAAAAAAAAQAAAJGG0gWfYn0BlXAlXc3q0GsuKZJKBBeDe+24CMQIIselixbmdgsncUt+9LfbqaW7d7IvgFSh5vfCYb+e6ab3jpd1nV2bH3aZzhFKMmTnSoWMDSbW/W0j5FP6mgji9X40J8y5GahPm/76VGdWmqODydIGHlRVn248KHS1hICvsea238KIeoIICB0U850dGhL9dHMxVfSw/aX/HWX0/99B4vlnmgBnMGUCMQDkKUL4PmI2X3nyggwSy76ay2b/kArqLc0ruwIiBOLa9hOwNucxBXWP8Z+m+dtIgV0CMEE6sEyVKYu9T5bR+oHT1Ww99FinSNMqDpN91MxYDvH9pXrDX1suAlMETgs1WzBZAw==
*/
const dataDecrypted = await kmsEncryption.decrypt(dataEncrypted); // return { example: 'test' }, dataEncrypted decrypted
```