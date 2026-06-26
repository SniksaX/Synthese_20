export const validateProduct = (req, res, next) => {
    const errors = [];
    const { name, quantity } = req.body;

    if (!name || typeof name !== 'string') {
        errors.push("Name is mondatory");
    } else if (name.length < 3 || name.length > 40) {
        errors.push("Name needs to be between 3 and 40 characters");
    }

    if (!quantity || typeof quantity !== 'number' || quantity < 0) {
        errors.push("Quantity needs to have a positive number");
    }

    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }

    next();
};