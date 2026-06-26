export const validateUser = (req, res, next) => {
    const errors = [];
    const { email, password } = req.body;

    if (!email || typeof email !== 'string') {
        errors.push("Email is missing or invalid.");
    }
    
    if (!password || typeof password !== 'string') {
        errors.push("Password is missing or invalid.");
    }

    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    next();
};