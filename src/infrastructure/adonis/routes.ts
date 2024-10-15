import router from '@adonisjs/core/services/router'

import './routes/waypoints.js'
import './routes/tag.js'
import './routes/collection.js'
import './routes/log.js'

// Route d'accueil pour tester l'API
router.get('/', async () => {
  return {
    hello: 'world',
  }
})
