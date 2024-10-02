import router from '@adonisjs/core/services/router'
const DeleteWaypointController = () => import('#controllers/waypoints/delete_waypoint_controller')
const UpdateWaypointController = () => import('#controllers/waypoints/update_waypoint_controller')
const FindWaypointsController = () => import('#controllers/waypoints/find_waypoints_controller')
const FindWaypointByIdsController = () =>
  import('#controllers/waypoints/find_waypoint_by_ids_controller')
const CreateWaypointController = () => import('#controllers/waypoints/create_waypoint_controller')

// Route d'accueil pour tester l'API
router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Groupes de routes GET avec paramètre de langue
router
  .group(() => {
    router
      .group(() => {
        router.get('', [FindWaypointsController]).as('find_waypoints')
        router.get(':id', [FindWaypointByIdsController]).as('find_waypoint_by_id')
      })
      .prefix('waypoints')
      .as('get_waypoints_urls')
  })
  .prefix('api/:lang') // Le paramètre 'lang' est ici appliqué à toutes les routes GET
  .as('base_lang_url')

// Groupes de routes POST/PATCH/DELETE sans paramètre de langue
router
  .group(() => {
    router
      .group(() => {
        router.post('', [CreateWaypointController]).as('create_waypoint')
        router.patch(':id', [UpdateWaypointController]).as('update_waypoint')
        router.delete(':id', [DeleteWaypointController]).as('delete_waypoint')
      })
      .prefix('waypoints')
      .as('other_waypoints_urls')
  })
  .prefix('api') // Routes sans langue dans l'URL
  .as('base_others_urls')
