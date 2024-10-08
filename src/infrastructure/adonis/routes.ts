import router from '@adonisjs/core/services/router'

import './routes/waypoints.js'
import './routes/tag.js'

// Route d'accueil pour tester l'API
router.get('/', async () => {
  return {
    hello: 'world',
  }
})
