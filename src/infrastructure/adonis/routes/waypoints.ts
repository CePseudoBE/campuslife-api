import router from '@adonisjs/core/services/router'
import { middleware } from '#infrastructure/adonis/kernel'
const WaypointsTagsAssociateController = () =>
  import('#controllers/waypoints/waypoints_tags_associates_controller')
const FindSlugWaypointController = () =>
  import('#controllers/waypoints/find_slug_waypoints_controller')
const DeleteWaypointController = () => import('#controllers/waypoints/delete_waypoint_controller')
const UpdateWaypointController = () => import('#controllers/waypoints/update_waypoint_controller')
const FindWaypointsController = () => import('#controllers/waypoints/find_waypoints_controller')
const FindWaypointByIdsController = () =>
  import('#controllers/waypoints/find_waypoint_by_ids_controller')
const CreateWaypointController = () => import('#controllers/waypoints/create_waypoint_controller')
const FindWaypointsByCollectionController = () =>
  import('#controllers/waypoints/find_waypoints_by_collection_controller')
// Groupes de routes GET avec paramètre de langue
router
  .group(() => {
    router
      .group(() => {
        router.get('', [FindWaypointsController]).as('find_waypoints_lang')
        router.get(':id', [FindWaypointByIdsController]).as('find_waypoint_by_id_lang')
        router.get(':slug/slug', [FindSlugWaypointController]).as('find_waypoint_by_slug_lang')
      })
      .prefix('waypoints')
      .as('lang_waypoints_urls')
  })
  .prefix('api/:lang') // Le paramètre 'lang' est ici appliqué à toutes les routes GET
  .use(middleware.validLanguage())

// Groupes de routes POST/PATCH/DELETE/GET sans paramètre de langue
router
  .group(() => {
    router
      .group(() => {
        router.post(':id/tags', [WaypointsTagsAssociateController]).as('associate_waypoints_tags')
        router.post('', [CreateWaypointController]).as('create_waypoint')
        router.patch(':id', [UpdateWaypointController]).as('update_waypoint')
        router.delete(':id', [DeleteWaypointController]).as('delete_waypoint')
        router.get('', [FindWaypointsController]).as('find_waypoints_d')
        router.get(':id', [FindWaypointByIdsController]).as('find_waypoint_by_id')
        router.get(':slug/slug', [FindSlugWaypointController]).as('find_waypoint_by_slug')
        router
          .get('collections/:id/waypoints', [FindWaypointsByCollectionController])
          .as('get_waypoints_by_collection')
      })
      .prefix('waypoints')
      .as('waypoints_urls')
  })
  .prefix('api') // Routes sans langue dans l'URL
