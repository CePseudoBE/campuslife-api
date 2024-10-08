import router from '@adonisjs/core/services/router'
import { middleware } from '#infrastructure/adonis/kernel'
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
      })
      .prefix('tags')
  })
  .prefix('api')
