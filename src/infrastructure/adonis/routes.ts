/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const CreateWaypointController = () => import('#controllers/create_waypoint_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('waypoints', [CreateWaypointController])
