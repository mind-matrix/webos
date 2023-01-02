declare global {
    interface Crypto {
      randomUUID: () => string;
    }
}

export function randomUUID() {
    return crypto.randomUUID()
}