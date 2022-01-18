module.exports = {
  serverError: (res) => {
    const statusCode = 500
    return res.status(statusCode).render('error', {
      statusCode,
      message: 'Server went wrong, please try again later.'
    })
  }
}