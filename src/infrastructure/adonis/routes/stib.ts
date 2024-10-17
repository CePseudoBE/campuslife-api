import router from '@adonisjs/core/services/router'
const FindByIdStibController = () => import('#controllers/stib/find_by_id_stib_controller')
const FindStibsController = () => import('#controllers/stib/find_stibs_controller')
const FindByNameStibController = () => import('#controllers/stib/find_by_name_stib_controller')
const DeleteStibController = () => import('#controllers/stib/delete_stib_controller')

router
  .group(() => {
    router
      .group(() => {
        router.delete(':id', [DeleteStibController]).as('delete_stib')
        router.get(':ligne/ligne', [FindByNameStibController]).as('get_stib_ligne')
        router.get(':id', [FindByIdStibController]).as('get_stib')
        router.get('', [FindStibsController]).as('get_stibs')
      })
      .prefix('stib')
  })
  .prefix('api')
