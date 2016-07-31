import Router from 'koa-router'
import home from '../controllers/home'

const router = Router()
router.get('/', home.index)
router.get('about', home.about)
router.get('movie', home.movie)
router.get('movie_Redux', home.movieRedux)
export default router
