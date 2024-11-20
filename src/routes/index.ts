import { Express } from 'express';
import AuthRoutes from './AuthRoutes';
import UserRoutes from './UserRoutes';
import SessionRoutes from './SessionRoutes';
import LabelRoutes from './LabelRoutes';
import NoteRoutes from './NoteRoutes';
import ArchiveRoutes from './ArchiveRoutes';
import StatusRoute from './StatusRoute';

const PREFIX_PATH = '';

const RoutesRegister = (app: Express): void => {
  app.use(`${PREFIX_PATH}/api/auth/`, AuthRoutes);
  app.use(`${PREFIX_PATH}/api/v1/user`, UserRoutes);
  app.use(`${PREFIX_PATH}/api/v1/session`, SessionRoutes);
  app.use(`${PREFIX_PATH}/api/v1/note`, NoteRoutes);
  app.use(`${PREFIX_PATH}/api/v1/label`, LabelRoutes);
  app.use(`${PREFIX_PATH}/api/v1/archive`, ArchiveRoutes);
  app.use(`${PREFIX_PATH}/api/v1/status`, StatusRoute);
};

export default RoutesRegister;
