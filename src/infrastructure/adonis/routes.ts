/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const FindWaypointByIdsController = () =>
  import('#controllers/waypoints/find_waypoint_by_ids_controller')
const CreateWaypointController = () => import('#controllers/waypoints/create_waypoint_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.post('', [CreateWaypointController])
    router.get(':id', [FindWaypointByIdsController])
  })
  .prefix('waypoints')
