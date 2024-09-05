module.exports.createPost = (req, res, next) => {
  if(!req.body.title) {
    req.flash('error', 'Vui lòng nhập tên danh mục!');
    return res.redirect('back');
  }

  next();
}