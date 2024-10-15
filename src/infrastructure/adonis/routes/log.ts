import router from '@adonisjs/core/services/router'
const FindLogsController = () => import('#controllers/logs/find_logs_controller')
const CreateLogController = () => import('#controllers/logs/create_log_controller')
const DeleteLogController = () => import('#controllers/logs/delete_log_controller')
const FindByIdLogController = () => import('#controllers/logs/find_by_id_log_controller')

router
  .group(() => {
    router
      .group(() => {
        router.post('', [CreateLogController]).as('create_log')
        router.delete(':id', [DeleteLogController]).as('delete_log')
        router.get(':id', [FindByIdLogController]).as('get_log')
        router.get('', [FindLogsController]).as('get_logs')
      })
      .prefix('logs')
  })
  .prefix('api')
