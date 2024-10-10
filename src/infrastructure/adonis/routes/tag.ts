import router from '@adonisjs/core/services/router'
import { middleware } from '#infrastructure/adonis/kernel'
const UpdateTagController = () => import('#controllers/tags/update_tags_controller')
const DeleteTagsController = () => import('#controllers/tags/delete_tags_controller')
const CreateTagController = () => import('#controllers/tags/create_tags_controller')
// Groupes de routes GET avec paramètre de langue
router
  .group(() => {
    router
      .group(() => {})
      .prefix('tags')
      .as('lang_tags_urls')
  })
  .prefix('api/:lang')
  .use(middleware.validLanguage())

// Groupes de routes POST/PATCH/DELETE/GET sans paramètre de langue
router
  .group(() => {
    router
      .group(() => {
        router.post('', [CreateTagController]).as('create_tag')
        router.delete(':id', [DeleteTagsController]).as('delete_tags')
        router.patch(':id', [UpdateTagController]).as('update_tags')
      })
      .prefix('tags')
  })
  .prefix('api')
