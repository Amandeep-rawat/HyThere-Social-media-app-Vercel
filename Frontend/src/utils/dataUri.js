export const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if(typeof reader.result === 'string') {
                resolve(reader.result);
            }
        }
        reader.readAsDataURL(file);
    })
};
// Haan, bilkul! Aap sirf image file ko base64 format me convert kar rahe hain. Yeh conversion aapko image ko directly web page par display karne ki suvidha deta hai