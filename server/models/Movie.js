module.exports = (sequelize, DataTypes) => {
    const Movie = sequelize.define("Movie", {
        MovieID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Genre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: false,  // Disable automatic createdAt and updatedAt fields
    });

    Movie.associate = (models) => {
        Movie.hasMany(models.Showtime, {
            foreignKey: "MovieID",
        });
    };

    return Movie;
};
