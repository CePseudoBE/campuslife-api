import router from '@adonisjs/core/services/router'
import { middleware } from '#infrastructure/adonis/kernel'
const AssociateCollectionTagsController = () =>
  import('#controllers/collections/associate_collection_tags_controller')
const CreateCollectionController = () =>
  import('#controllers/collections/create_collection_controller')
const DeleteCollectionController = () =>
  import('#controllers/collections/delete_collection_controller')
const UpdateCollectionController = () =>
  import('#controllers/collections/update_collection_controller')
const FindCollectionsController = () =>
  import('#controllers/collections/find_collections_controller')
const FindByIdCollectionController = () =>
  import('#controllers/collections/find_by_id_collection_controller')
router
  .group(() => {
    router
      .group(() => {
        router.get(':id', [FindByIdCollectionController]).as('get_collection_lang')
        router.get('', [FindCollectionsController]).as('get_collections_lang')
      })
      .prefix('collections')
  })
  .prefix('api/:lang')
  .use(middleware.validLanguage())

router
  .group(() => {
    router
      .group(() => {
        router.post(':id/tags', [AssociateCollectionTagsController]).as('associate_collection_tags')
        router.post('', [CreateCollectionController]).as('create_collection')
        router.delete(':id', [DeleteCollectionController]).as('delete_collection')
        router.patch(':id', [UpdateCollectionController]).as('update_collection')
        router.get(':id', [FindByIdCollectionController]).as('get_collection')
        router.get('', [FindCollectionsController]).as('get_collections')
      })
      .prefix('collections')
  })
  .prefix('api')
