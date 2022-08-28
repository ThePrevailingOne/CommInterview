
export const emailValidator = (value: string) => {
    return /^\S+@\S+$/.test(value) ? null : "Invalid email";
};

export const passwordValidator = (value: string) => {
    // length equal or greater than 8
    if (value.length < 8) {
        return "Password must be 8 or more characters";
    }
    // must contain at least one special character
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (!specialChars.test(value)) {
        return "Password must contain at least one special character";
    }
    return null;
};

export const confirmPasswordValidator = (value: string, values: any) => {
    return value !== values.password ? "Passwords did not match" : null;
}