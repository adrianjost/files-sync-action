import * as core from "@actions/core";

// @ts-ignore-next-line
import { seal } from "tweetsodium";

export function encrypt(value: string, key: string): string {
	// Convert the message and key to Uint8Array's (Buffer implements that interface)
	const messageBytes = Buffer.from(value, "utf8");
	const keyBytes = Buffer.from(key, "base64");

	// Encrypt using LibSodium
	const encryptedBytes = seal(messageBytes, keyBytes);

	// Base64 the encrypted secret
	const encrypted = Buffer.from(encryptedBytes).toString("base64");

	// tell Github to mask this from logs
	core.setSecret(encrypted);

	return encrypted;
}
