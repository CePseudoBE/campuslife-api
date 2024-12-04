import router from '@adonisjs/core/services/router'
import { middleware } from '#infrastructure/adonis/kernel'

// Importation des contrôleurs pour les services
const CreateServiceController = () => import('#controllers/services/create_service_controller')
const DeleteServiceController = () => import('#controllers/services/delete_service_controller')
const UpdateServiceController = () => import('#controllers/services/update_service_controller')
const FindServicesController = () => import('#controllers/services/find_services_controller')
const FindByIdServiceController = () =>
  import('#controllers/services/find_by_id_service_controller')

// Groupement des routes par langue
router
  .group(() => {
    router
      .group(() => {
        router.get(':id', [FindByIdServiceController]).as('get_service_lang')
        router.get('', [FindServicesController]).as('get_services_lang')
      })
      .prefix('services')
  })
  .prefix('api/:lang')
  .use(middleware.validLanguage())

// Groupement principal des routes pour les services
router
  .group(() => {
    router
      .group(() => {
        router.post('', [CreateServiceController]).as('create_service')
        router.delete(':id', [DeleteServiceController]).as('delete_service')
        router.patch(':id', [UpdateServiceController]).as('update_service')
        router.get(':id', [FindByIdServiceController]).as('get_service')
        router.get('', [FindServicesController]).as('get_services')
      })
      .prefix('services')
  })
  .prefix('api')
