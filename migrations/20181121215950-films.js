'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn('films', 'genres', { type: Sequelize.STRING });
    
  },

  down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('films', 'genres');
  }
};