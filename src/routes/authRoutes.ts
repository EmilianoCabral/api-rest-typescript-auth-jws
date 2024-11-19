import Express from 'express';
import { register, login } from '../controllers/authController';

const Router = Express.Router()

Router.post('/register',register)
Router.post('/login',login)

export default Router;