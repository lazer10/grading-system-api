/* eslint-disable import/prefer-default-export */
import config from '../config';
import out from '../helpers/response';
import { verify } from '../helpers/jwt';

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const decodeToken = (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = verify(token, config.JWT_SECRET);
    return user;
  } catch (error) {
    return out(res, 401, capitalize(error.message || error), null, 'AUTHENTICATION_ERROR');
  }
};

export const isAdminDos = async (req, res, next) => {
  req.user = await decodeToken(req, res);
  if (req.user.role !== 'Admin' && req.user.role !== 'DOS') {
    return out(res, 403, 'You don\'t have access to do that action', null, 'FORBIDDEN');
  }
  return next();
};
