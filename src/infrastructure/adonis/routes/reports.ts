import router from '@adonisjs/core/services/router'
const CreateReportController = () => import('#controllers/reports/create_report_controller')
const DeleteReportController = () => import('#controllers/reports/delete_report_controller')
const FindByIdReportController = () => import('#controllers/reports/find_by_id_report_controller')
const FindReportsController = () => import('#controllers/reports/find_reports_controlller')
router
  .group(() => {
    router
      .group(() => {
        router.post('', [CreateReportController]).as('create_report')
        router.delete(':id', [DeleteReportController]).as('delete_report')
        router.get(':id', [FindByIdReportController]).as('get_report')
        router.get('', [FindReportsController]).as('get_reports')
      })
      .prefix('reports')
  })
  .prefix('api')
