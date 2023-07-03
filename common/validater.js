
module.exports = {
    validateEmail(email) {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    },
    validatePayload(keys, payload) {
        const keysInPayload = Object.keys(payload);
        for (const key of keys) {
            if (!keysInPayload.includes(key)) {
                throw new Error(`${key} is required`);
            }
        }
    }
}