module.exports.createPost = (req, res, next) => {
  const { fullName, email, password } = req.body;

  if(!fullName) {
    req.flash('error', 'Vui lòng nhập tên đầy đủ!');
    return res.redirect('back');
  }

  if(!email) {
    req.flash('error', 'Vui lòng nhập email!');
    return res.redirect('back');
  }

  if(!password) {
    req.flash('error', 'Vui lòng nhập mật khẩu!');
    return res.redirect('back');
  }

  if (password.length < 8) {
    req.flash('error', 'Mật khẩu phải có ít nhất 8 ký tự!');
    return res.redirect('back');
  }

  next();
}

module.exports.editPatch = (req, res, next) => {
  const { fullName, email } = req.body;

  if(!fullName) {
    req.flash('error', 'Vui lòng nhập tên đầy đủ!');
    return res.redirect('back');
  }

  if(!email) {
    req.flash('error', 'Vui lòng nhập email!');
    return res.redirect('back');
  }

  next();
}