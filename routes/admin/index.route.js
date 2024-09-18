const systemConfig = require('../../config/system');
const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const productsCategoryRoutes = require('./product-category.route');
const rolesRoutes = require('./role.route');
const accountsRoutes = require('./account.route');


module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(PATH_ADMIN + '/dashboard', dashboardRoutes);

  app.use(PATH_ADMIN + '/products', productRoutes);

  app.use(PATH_ADMIN + '/products-category', productsCategoryRoutes);

  app.use(PATH_ADMIN + '/roles', rolesRoutes);

  app.use(PATH_ADMIN + '/accounts', accountsRoutes);
}