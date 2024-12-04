import router from '@adonisjs/core/services/router'

// Importation des contrôleurs pour les adresses
const CreateAddressController = () => import('#controllers/addresses/create_address_controller')
const UpdateAddressController = () => import('#controllers/addresses/update_address_controller')
const DeleteAddressController = () => import('#controllers/addresses/delete_address_controller')
const FindByIdAddressController = () =>
  import('#controllers/addresses/find_by_id_address_controller')
const FindAddressesController = () => import('#controllers/addresses/find_addresses_controller')

// Groupement des routes pour les langues

router
  .group(() => {
    router
      .group(() => {
        router.post('', [CreateAddressController]).as('create_address')
        router.patch(':id', [UpdateAddressController]).as('update_address')
        router.delete(':id', [DeleteAddressController]).as('delete_address')
        router.get(':id', [FindByIdAddressController]).as('get_address')
        router.get('', [FindAddressesController]).as('get_addresses')
      })
      .prefix('addresses')
  })
  .prefix('api')
