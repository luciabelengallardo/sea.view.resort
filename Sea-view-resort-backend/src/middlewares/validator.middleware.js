export const validateSchema = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const formattedErrors = result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    return res.status(400).json({
      errors: formattedErrors,
    });
  }

  next();
};
