module.exports.loginPost = (req, res, next) => {
  if(!req.body.email) {
    req.flash('error', 'Vui lòng nhập email!');
    return res.redirect('back');
  }

  if(!req.body.password) {
    req.flash('error', 'Vui lòng nhập mật khẩu');
    return res.redirect('back');
  }

  next();
}