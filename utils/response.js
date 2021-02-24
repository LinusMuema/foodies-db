exports.serverError = (res, error) => res.status(500).json({message: error})

exports.forbiddenError = (res, error) => res.status(403).json({message: error})
