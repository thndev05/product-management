const systemConfig = require('../../config/system');
const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const productsCategoryRoutes = require('./product-category.route');
const rolesRoutes = require('./role.route');
const accountsRoutes = require('./account.route');
const authRoutes = require('./auth.route');
const myAccountRoutes = require('./my-account.route');
const authMiddleware = require('../../middlewares/admin/auth.middleware');

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(
    PATH_ADMIN + '/dashboard',
    authMiddleware.requireAuth,
    dashboardRoutes
  );

  app.use(
    PATH_ADMIN + '/products',
    authMiddleware.requireAuth,
    productRoutes
  );

  app.use(
    PATH_ADMIN + '/products-category',
    authMiddleware.requireAuth,
    productsCategoryRoutes
  );

  app.use(
    PATH_ADMIN + '/roles',
    authMiddleware.requireAuth,
    rolesRoutes
  );

  app.use(
    PATH_ADMIN + '/accounts',
    authMiddleware.requireAuth,
    accountsRoutes
  );

  app.use(
    PATH_ADMIN + '/my-account',
    authMiddleware.requireAuth,
    myAccountRoutes
  );

  app.use(PATH_ADMIN + '/auth', authRoutes);
}