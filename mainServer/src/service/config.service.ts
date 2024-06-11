import AppConfig from "../models/appConfig.model";

export const getConfig = async () => {
  const appConfig = await AppConfig.findOne().lean();
  if (!appConfig?.config) {
    return false;
  }
  return appConfig.config;
}

export const getConfigCategories = async () => {
  const appConfig = await AppConfig.findOne().lean();
  if (!appConfig?.config?.categories) {
    return false;
  }
  return appConfig.config.categories;
}

export const getConfigProductProps = async () => {
  const appConfig = await AppConfig.findOne().lean();
  if (!appConfig?.config?.productProps) {
    return false;
  }
  return appConfig.config.productProps;
}

export const getConfigAdmins = async () => {
  const appConfig = await AppConfig.findOne().lean();
  if (!appConfig?.config?.admins) {
    return false;
  }
  return appConfig.config.admins;
}