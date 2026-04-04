const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((e) => {
      const field = e.path.length ? e.path.join('.') : 'general';
      return `${field}: ${e.message}`;
    });

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Replace body with sanitized/parsed data
  req.body = result.data;

  next();
};

export { validate };