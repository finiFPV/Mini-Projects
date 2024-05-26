const fs = require("fs");
const crypto = require("crypto");
const prompt = require("prompt-sync")();
const path = require("path");

const messageFile = "./message.json";
const keyFolder = "./keys/";

// Ensure key folder exists
if (!fs.existsSync(keyFolder)) {
    fs.mkdirSync(keyFolder);
}

// Generate RSA keys if missing
const generateKeys = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: "spki",
            format: "pem"
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem"
        }
    });
    fs.writeFileSync(keyFolder + "rsaPublic.key", publicKey);
    fs.writeFileSync(keyFolder + "rsaPrivate.key", privateKey);
};

// Encryption function
const encrypt = async () => {
    console.log("Choose an option:");
    console.log("1) Enter text");
    console.log("2) Open file");

    const choice = prompt("Enter your choice > ");

    if (choice === "1") {
        const message = prompt("Enter the message > ");
        await encryptMessage(Buffer.from(message, "utf8"));
    } else if (choice === "2") {
        const filePath = prompt("Enter the file path > ");
        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
            console.error("Invalid file path or file does not exist. Example path: C:\Folder\Video.mp4");
            return;
        }
        const data = fs.readFileSync(filePath);
        await encryptMessage(data, path.basename(filePath));
    } else {
        console.error("Invalid choice! Please enter a valid choice.");
    }
};

const encryptMessage = async (message, fileName = null) => {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = Buffer.concat([cipher.update(message), cipher.final()]);

    const publicKey = fs.readFileSync(keyFolder + 'rsaPublic.key', "utf8");
    const encryptedKey = crypto.publicEncrypt(publicKey, key);
    const encryptedIV = crypto.publicEncrypt(publicKey, iv);

    const messageData = {
        key: encryptedKey.toString("base64"),
        iv: encryptedIV.toString("base64"),
        message: encrypted.toString("base64"),
        fileName: fileName
    };

    fs.writeFileSync(messageFile, JSON.stringify(messageData, null, 2));
    console.log("Message encrypted and saved to message.json!");
};

// Decryption function
const decrypt = async () => {
    if (!fs.existsSync(messageFile)) {
        console.log("Message file does not exist!");
        return;
    }

    const privateKey = fs.readFileSync(keyFolder + 'rsaPrivate.key', "utf8");
    const messageData = JSON.parse(fs.readFileSync(messageFile, "utf8"));

    const decryptedKey = crypto.privateDecrypt(privateKey, Buffer.from(messageData.key, "base64"));
    const decryptedIV = crypto.privateDecrypt(privateKey, Buffer.from(messageData.iv, "base64"));

    const decipher = crypto.createDecipheriv("aes-256-cbc", decryptedKey, decryptedIV);
    let decrypted = decipher.update(Buffer.from(messageData.message, "base64"));
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    if (messageData.fileName) {
        fs.writeFileSync(messageData.fileName, decrypted);
        console.log(`Decrypted file saved as: ${messageData.fileName}`);
    } else {
        console.log(`Decrypted message: ${decrypted.toString("utf8")}`);
        const answer = prompt("Do you want to save the decrypted message to a file? (y/n) > ").toLowerCase();
        if (answer === "y") {
            const fileName = prompt("Enter the file name > ") + ".txt";
            fs.writeFileSync(fileName, decrypted);
            console.log(`Decrypted message saved as: ${fileName}`);
        }
    }
};

// Main loop
const main = async () => {
    while (true) {
        console.log("Please choose an option:");
        console.log("1) Encrypt");
        console.log("2) Decrypt");
        console.log("3) Quit");

        const choice = prompt("Enter your choice > ");

        switch (choice) {
            case "1":
                console.clear();
                await encrypt();
                break;
            case "2":
                console.clear();
                await decrypt();
                break;
            case "3":
                process.exit();
            default:
                console.clear();
                console.error("Invalid choice! Please enter a valid choice.");
        }
    }
};

// Check if RSA keys exist, if not, generate them
if (!fs.existsSync(keyFolder + 'rsaPublic.key') || !fs.existsSync(keyFolder + 'rsaPrivate.key')) {
    generateKeys();
}

// Run the main loop
main();
