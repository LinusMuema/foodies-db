exports.serverError = (res, reason) => res.status(500).json({message: 'error', reason: reason})

exports.forbiddenError = (res, reason) => res.status(403).json({message: 'error', reason: reason})
