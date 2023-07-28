
module.exports = {
    validateEmail(email) {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    },
    validatePayload(keys, payload, parentKey=null) {
        const keysInPayload = Object.keys(payload);
        for (const key of keys) {
            if (!keysInPayload.includes(key)) {
                if(parentKey){
                    throw new Error(`${key} is required in ${parentKey}`);
                }
                throw new Error(`${key} is required`);
            }
        }
    }
}