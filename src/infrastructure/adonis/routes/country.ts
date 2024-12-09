import router from '@adonisjs/core/services/router'
import { middleware } from '#infrastructure/adonis/kernel'

// Importation des contrôleurs pour les pays
const CreateCountryController = () => import('#controllers/countries/create_country_controller')
const UpdateCountryController = () => import('#controllers/countries/update_country_controller')
const DeleteCountryController = () => import('#controllers/countries/delete_country_controller')
const FindByIdCountryController = async () =>
  (await import('#controllers/countries/find_by_id_country_controller')).default
const FindCountriesController = async () =>
  (await import('#controllers/countries/find_countries_controller')).default

// Groupement des routes pour les langues
router
  .group(() => {
    router
      .group(() => {
        router.get(':id', [FindByIdCountryController]).as('get_country_lang')
        router.get('', [FindCountriesController]).as('get_countries_lang')
      })
      .prefix('countries')
  })
  .prefix('api/:lang')
  .use(middleware.validLanguage())

// Groupement principal des routes pour les pays
router
  .group(() => {
    router
      .group(() => {
        router.post('', [CreateCountryController]).as('create_country')
        router.patch(':id', [UpdateCountryController]).as('update_country')
        router.delete(':id', [DeleteCountryController]).as('delete_country')
        router.get(':id', [FindByIdCountryController]).as('get_country')
        router.get('', [FindCountriesController]).as('get_countries')
      })
      .prefix('countries')
  })
  .prefix('api')
