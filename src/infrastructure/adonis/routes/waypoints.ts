import router from '@adonisjs/core/services/router'
import { middleware } from '#infrastructure/adonis/kernel'
const DeleteWaypointController = () => import('#controllers/waypoints/delete_waypoint_controller')
const UpdateWaypointController = () => import('#controllers/waypoints/update_waypoint_controller')
const FindWaypointsController = () => import('#controllers/waypoints/find_waypoints_controller')
const FindWaypointByIdsController = () =>
  import('#controllers/waypoints/find_waypoint_by_ids_controller')
const CreateWaypointController = () => import('#controllers/waypoints/create_waypoint_controller')

// Groupes de routes GET avec paramètre de langue
router
  .group(() => {
    router
      .group(() => {
        router.get('', [FindWaypointsController]).as('find_waypoints_lang')
        router.get(':id', [FindWaypointByIdsController]).as('find_waypoint_by_id_lang')
      })
      .prefix('waypoints')
      .as('lang_waypoints_urls')
  })
  .prefix('api/:lang') // Le paramètre 'lang' est ici appliqué à toutes les routes GET
  .as('base_lang_url')
  .use(middleware.validLanguage())

// Groupes de routes POST/PATCH/DELETE/GET sans paramètre de langue
router
  .group(() => {
    router
      .group(() => {
        router.post('', [CreateWaypointController]).as('create_waypoint')
        router.patch(':id', [UpdateWaypointController]).as('update_waypoint')
        router.delete(':id', [DeleteWaypointController]).as('delete_waypoint')
        router.get('', [FindWaypointsController]).as('find_waypoints_d')
        router.get(':id', [FindWaypointByIdsController]).as('find_waypoint_by_id_d')
      })
      .prefix('waypoints')
      .as('lang_waypoints_urls')
  })
  .prefix('api') // Routes sans langue dans l'URL
  .as('base_others_urls')
