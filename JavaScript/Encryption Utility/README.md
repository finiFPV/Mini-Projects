**File Encryption and Decryption Utility**

---

### Introduction

This is a simple encryption and decryption utility implemented in Node.js. It allows users to encrypt text or files using AES-256-CBC symmetric encryption and RSA asymmetric encryption for securing the encryption key and initialization vector (IV). 

### Features

- Encrypt text or files securely.
- Decrypt encrypted messages or files.
- Interactive command-line interface for user interaction.

### Installation

To use this utility, follow these steps:

1. Clone the repository or download the code files.
2. Make sure you have Node.js installed on your system.
3. Install the required dependencies by running `npm install` in the project directory.

### Usage

To run the utility, execute the main script using Node.js:

```
node encryption_utility.js
```

You will be presented with a menu where you can choose to encrypt, decrypt, or quit the program.

### Encrypting Data

You can encrypt data in two ways:

1. **Enter Text:** Choose this option to enter text directly into the console for encryption.
2. **Open File:** Select this option to encrypt the contents of a file. You'll be prompted to enter the file path.

### Decrypting Data

To decrypt data, choose the decryption option from the main menu. If a message file exists, it will be decrypted using the private RSA key.

### Important Notes

- RSA key pairs are generated automatically if missing.
- Encrypted data is saved in a JSON file named `message.json`.
- Decryption requires the private RSA key (`rsaPrivate.key`) which should be kept secure.

### Further Development

This utility serves as a concept and can be expanded into a more comprehensive encrypted file sharing or messaging software.

**Note:** This code is provided as a demonstration and should not be used in production without thorough testing and security reviews.