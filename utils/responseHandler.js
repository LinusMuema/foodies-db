exports.handleServerError = (res, reason) => res.status(500).json({message: 'error', reason: reason})

exports.handleForbiddenError = (res, reason) => res.status(403).json({message: 'error', reason: reason})
